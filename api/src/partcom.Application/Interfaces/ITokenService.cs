using partcom.Domain.Entities;

namespace partcom.Application.Interfaces;

public interface ITokenService
{
    string GenerateAccessToken(User user, IEnumerable<string> roles);

    string GenerateRefreshToken();
}