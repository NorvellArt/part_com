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
    private readonly UserManager<ApplicationUser> _userManager = userManager;
    private readonly AppDbContext _dbContext = dbContext;

    private const string SessionProvider = "PartcomIdentitySession";
    private const string SessionTokenName = "SessionId";

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

        var userToken = await _dbContext.UserTokens
            .FirstOrDefaultAsync(t => t.LoginProvider == SessionProvider &&
                                      t.Name == SessionTokenName &&
                                      t.Value == sessionId);

        if (userToken == null)
        {
            return AuthenticateResult.Fail("Сессия не найдена или недействительна.");
        }

        var appUser = await _userManager.FindByIdAsync(userToken.UserId.ToString());
        if (appUser == null)
        {
            return AuthenticateResult.Fail("Пользователь не найден.");
        }

        var roles = await _userManager.GetRolesAsync(appUser);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, appUser.Id.ToString()),
            new(ClaimTypes.Email, appUser.Email ?? string.Empty),
            new(ClaimTypes.Name, appUser.UserName ?? string.Empty)
        };

        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var identity = new ClaimsIdentity(claims, Scheme.Name);
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, Scheme.Name);

        return AuthenticateResult.Success(ticket);
    }
}
