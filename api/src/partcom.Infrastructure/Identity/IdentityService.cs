using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

using partcom.Application.Common;
using partcom.Application.DTOs.Auth;
using partcom.Application.Interfaces;
using partcom.Domain.Entities;
using partcom.Infrastructure.Persistence;

namespace partcom.Infrastructure.Identity;

public class IdentityService(
    UserManager<ApplicationUser> userManager,
    ITokenService tokenService,
    AppDbContext dbContext,
    IConfiguration configuration) : IIdentityService
{
    private readonly UserManager<ApplicationUser> _userManager = userManager;
    private readonly ITokenService _tokenService = tokenService;
    private readonly AppDbContext _dbContext = dbContext;
    private readonly IConfiguration _configuration = configuration;

    public async Task<Result<AuthResponse>> RegisterAsync(
        RegisterRequest request, 
        CancellationToken cancellationToken = default)
    {
        var existingUser = await _userManager.FindByEmailAsync(request.Email);
        if (existingUser != null)
        {
            return Result<AuthResponse>.Failure("Пользователь с таким Email уже существует.");
        }

        var appUser = new ApplicationUser
        {
            Id = Guid.NewGuid(),
            Email = request.Email,
            UserName = request.Email,
        };

        var result = await _userManager.CreateAsync(appUser, request.Password);
        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            return Result<AuthResponse>.Failure(errors);
        }

        await _userManager.AddToRoleAsync(appUser, "User");

        return await GenerateAuthResponseAsync(appUser, cancellationToken);
    }

    public async Task<Result<AuthResponse>> LoginAsync(
        LoginRequest request, 
        CancellationToken cancellationToken = default)
    {
        var appUser = await _userManager.FindByEmailAsync(request.Email);
        if (appUser == null)
        {
            return Result<AuthResponse>.Failure("Неверный Email или пароль.");
        }

        var isPasswordValid = await _userManager.CheckPasswordAsync(appUser, request.Password);
        if (!isPasswordValid)
        {
            return Result<AuthResponse>.Failure("Неверный Email или пароль.");
        }

        return await GenerateAuthResponseAsync(appUser, cancellationToken);
    }

    public async Task<Result<AuthResponse>> RefreshTokenAsync(
        RefreshTokenRequest request, 
        CancellationToken cancellationToken = default)
    {
        var principal = GetPrincipalFromExpiredToken(request.AccessToken);
        if (principal == null)
        {
            return Result<AuthResponse>.Failure("Невалидный Access Token.");
        }

        var userIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier) 
            ?? principal.FindFirst(JwtRegisteredClaimNames.Sub);

        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
        {
            return Result<AuthResponse>.Failure("Невалидный токен.");
        }

        var appUser = await _dbContext.Users
            .Include(u => u.RefreshTokens)
            .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);

        if (appUser == null)
        {
            return Result<AuthResponse>.Failure("Пользователь не найден.");
        }

        var existingRefreshToken = appUser.RefreshTokens
            .FirstOrDefault(r => r.Token == request.RefreshToken);

        if (existingRefreshToken == null || !existingRefreshToken.IsActive)
        {
            return Result<AuthResponse>.Failure("Невалидный или истекший Refresh Token.");
        }

        existingRefreshToken.IsRevoked = true;

        return await GenerateAuthResponseAsync(appUser, cancellationToken);
    }

    public async Task<Result> RevokeTokenAsync(
        string refreshToken, 
        CancellationToken cancellationToken = default)
    {
        var tokenEntity = await _dbContext.Set<RefreshToken>()
            .FirstOrDefaultAsync(r => r.Token == refreshToken, cancellationToken);

        if (tokenEntity == null || !tokenEntity.IsActive)
        {
            return Result.Failure("Токен не найден или уже неактивен.");
        }

        tokenEntity.IsRevoked = true;
        await _dbContext.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }

    private async Task<Result<AuthResponse>> GenerateAuthResponseAsync(
        ApplicationUser appUser, 
        CancellationToken cancellationToken)
    {
        var roles = await _userManager.GetRolesAsync(appUser);
        
        var domainUser = appUser.ToDomain();

        var accessToken = _tokenService.GenerateAccessToken(domainUser, roles);
        var refreshTokenValue = _tokenService.GenerateRefreshToken();

        var refreshDays = Convert.ToDouble(_configuration["JwtSettings:RefreshTokenExpiryDays"] ?? "7");
        var refreshTokenExpiresAt = DateTime.UtcNow.AddDays(refreshDays);

        var refreshToken = new RefreshToken
        {
            Token = refreshTokenValue,
            UserId = appUser.Id,
            ExpiresAtUtc = refreshTokenExpiresAt
        };

        _dbContext.Set<RefreshToken>().Add(refreshToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return Result<AuthResponse>.Success(new AuthResponse(
            UserId: domainUser.Id,
            Email: domainUser.Email,
            AccessToken: accessToken,
            RefreshToken: refreshTokenValue,
            RefreshTokenExpiresAtUtc: refreshTokenExpiresAt
        ));
    }

    private ClaimsPrincipal? GetPrincipalFromExpiredToken(string token)
    {
        var secretKey = _configuration["JwtSettings:Secret"] 
            ?? throw new InvalidOperationException("JWT Secret is not configured.");

        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = true,
            ValidAudience = _configuration["JwtSettings:Audience"],
            ValidateIssuer = true,
            ValidIssuer = _configuration["JwtSettings:Issuer"],
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
            ValidateLifetime = false
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var securityToken);

        if (securityToken is not JwtSecurityToken jwtSecurityToken ||
            !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
        {
            return null;
        }

        return principal;
    }
}