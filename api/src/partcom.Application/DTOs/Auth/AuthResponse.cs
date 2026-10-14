namespace partcom.Application.DTOs.Auth;

public record AuthResponse(
    Guid UserId,
    string Email,
    string SessionId,
    IEnumerable<string> Roles
);
