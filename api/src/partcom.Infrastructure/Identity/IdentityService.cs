using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using partcom.Application.Common;
using partcom.Application.DTOs.Auth;
using partcom.Application.Interfaces;
using partcom.Infrastructure.Persistence;

namespace partcom.Infrastructure.Identity;

public class IdentityService(
    UserManager<ApplicationUser> userManager,
    AppDbContext dbContext) : IIdentityService
{
    private readonly UserManager<ApplicationUser> _userManager = userManager;
    private readonly AppDbContext _dbContext = dbContext;
    private const string SessionProvider = "PartcomIdentitySession";
    private const string SessionTokenName = "SessionId";

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

        return await GenerateSessionResponseAsync(appUser, cancellationToken);
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

        return await GenerateSessionResponseAsync(appUser, cancellationToken);
    }

    public async Task<Result> RevokeSessionAsync(
        string sessionId, 
        CancellationToken cancellationToken = default)
    {
        var userToken = await _dbContext.UserTokens
            .FirstOrDefaultAsync(t => t.LoginProvider == SessionProvider && 
                                      t.Name == SessionTokenName && 
                                      t.Value == sessionId, cancellationToken);

        if (userToken == null)
        {
            return Result.Failure("Сессия не найдена или уже неактивна.");
        }

        _dbContext.UserTokens.Remove(userToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }

    private async Task<Result<AuthResponse>> GenerateSessionResponseAsync(
        ApplicationUser appUser,
        CancellationToken cancellationToken)
    {
        var roles = await _userManager.GetRolesAsync(appUser);
        
        var sessionId = Guid.NewGuid().ToString("N");

        await _userManager.SetAuthenticationTokenAsync(
            appUser, 
            SessionProvider, 
            SessionTokenName, 
            sessionId);

        return Result<AuthResponse>.Success(new AuthResponse(
            UserId: appUser.Id,
            Email: appUser.Email ?? string.Empty,
            SessionId: sessionId,
            Roles: roles
        ));
    }
}
