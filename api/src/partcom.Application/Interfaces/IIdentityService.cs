using partcom.Application.Common;
using partcom.Application.DTOs.Auth;

namespace partcom.Application.Interfaces;

public interface IIdentityService
{
    Task<Result<AuthResponse>> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default);
    Task<Result<AuthResponse>> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default);
    Task<Result> RevokeSessionAsync(string sessionId, CancellationToken cancellationToken = default);
}
