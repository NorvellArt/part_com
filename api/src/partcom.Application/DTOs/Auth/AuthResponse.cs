namespace partcom.Application.DTOs.Auth;

public record AuthResponse(
    Guid UserId,
    string Email,
    string AccessToken,
    string RefreshToken,
    DateTime RefreshTokenExpiresAtUtc,
    IEnumerable<string> Roles
);