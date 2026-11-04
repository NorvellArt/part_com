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
    private const int SessionLifetimeDays = 30;

    public async Task<Result<AuthResponse>> RegisterAsync(
        RegisterRequest request,
        CancellationToken cancellationToken = default)
    {
        var existingUser = await _userManager.FindByEmailAsync(request.Email);
        if (existingUser != null)
        {
            return Result<AuthResponse>.Failure("Пользователь с таким Email уже существует.");
        }

        var phoneExists = await _userManager.Users
            .AnyAsync(u => u.PhoneNumber == request.PhoneNumber, cancellationToken);

        if (phoneExists)
        {
            return Result<AuthResponse>.Failure("Пользователь с таким номером телефона уже существует.");
        }

        var appUser = new ApplicationUser
        {
            Id = Guid.NewGuid(),
            Email = request.Email,
            UserName = request.Email,
            PhoneNumber = request.PhoneNumber,
            FirstName = request.FirstName,
            LastName = request.LastName
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
        var session = await _dbContext.UserSessions
            .FirstOrDefaultAsync(s => s.Token == sessionId, cancellationToken);

        if (session == null)
        {
            return Result.Failure("Сессия не найдена или уже неактивна.");
        }

        _dbContext.UserSessions.Remove(session);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }

    private async Task<Result<AuthResponse>> GenerateSessionResponseAsync(
        ApplicationUser appUser,
        CancellationToken cancellationToken)
    {
        var roles = await _userManager.GetRolesAsync(appUser);

        var sessionId = Guid.NewGuid().ToString("N");

        var userSession = new UserSession
        {
            Id = Guid.NewGuid(),
            Token = sessionId,
            UserId = appUser.Id,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddDays(SessionLifetimeDays)
        };

        _dbContext.UserSessions.Add(userSession);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return Result<AuthResponse>.Success(new AuthResponse(
            UserId: appUser.Id,
            Email: appUser.Email ?? string.Empty,
            SessionId: sessionId,
            Roles: roles
        ));
    }
}
