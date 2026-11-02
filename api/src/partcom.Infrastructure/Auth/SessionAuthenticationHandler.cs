using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using System.Text.Encodings.Web;
using partcom.Infrastructure.Identity;
using partcom.Infrastructure.Persistence;

namespace partcom.Infrastructure.Auth;

public class SessionSchemeOptions : AuthenticationSchemeOptions { }

public class SessionAuthenticationHandler(
    IOptionsMonitor<SessionSchemeOptions> options,
    ILoggerFactory logger,
    UrlEncoder encoder,
    UserManager<ApplicationUser> userManager,
    AppDbContext dbContext) : AuthenticationHandler<SessionSchemeOptions>(options, logger, encoder)
{
    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        if (!Request.Headers.TryGetValue("X-Session-Id", out var sessionIdValues))
        {
            return AuthenticateResult.NoResult();
        }

        var sessionId = sessionIdValues.ToString();
        if (string.IsNullOrWhiteSpace(sessionId))
        {
            return AuthenticateResult.Fail("Пустой идентификатор сессии.");
        }

        var session = await dbContext.UserSessions
            .FirstOrDefaultAsync(s => s.Token == sessionId, Context.RequestAborted);

        if (session == null)
        {
            return AuthenticateResult.Fail("Сессия не найдена.");
        }

        if (session.ExpiresAt < DateTime.UtcNow)
        {
            return AuthenticateResult.Fail("Срок действия сессии истек.");
        }

        var appUser = await userManager.FindByIdAsync(session.UserId.ToString());
        if (appUser == null)
        {
            return AuthenticateResult.Fail("Пользователь не найден.");
        }

        var roles = await userManager.GetRolesAsync(appUser);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, appUser.Id.ToString()),
            new(ClaimTypes.Email, appUser.Email ?? string.Empty),
            new(ClaimTypes.Name, appUser.UserName ?? string.Empty),
        };

        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var identity = new ClaimsIdentity(claims, Scheme.Name);
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, Scheme.Name);

        return AuthenticateResult.Success(ticket);
    }
}
