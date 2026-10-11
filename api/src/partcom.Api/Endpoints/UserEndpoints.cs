using Microsoft.AspNetCore.Mvc;
using partcom.Application.DTOs.Auth;
using partcom.Application.Interfaces;

namespace partcom.Api.Endpoints;

public static class UserEndpoints
{
    public static IEndpointRouteBuilder MapUserEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/users")
                       .WithTags("Users");

        group.MapPost("/login", async (
            [FromBody] LoginRequest request,
            IIdentityService identityService,
            HttpContext httpContext,
            CancellationToken ct) =>
        {
            var result = await identityService.LoginAsync(request, ct);
            if (!result.IsSuccess || result.Value is null)
            {
                return Results.BadRequest(new { error = result.Error });
            }

            return Results.Ok(new
            {
                userId = result.Value.UserId,
                email = result.Value.Email,
                accessToken = result.Value.AccessToken,
                roles = result.Value.Roles,
                refreshToken = result.Value.RefreshToken
            });
        })
        .WithName("Login")
        .Produces(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest);

        group.MapPost("/refresh-token", async (
            [FromBody] RefreshTokenBodyRequest request,
            IIdentityService identityService,
            CancellationToken ct) =>
        {
            var refreshToken = request.RefreshToken;

            if (string.IsNullOrEmpty(refreshToken))
            {
                return Results.BadRequest(new { error = "Refresh Token не передан." });
            }

            var refreshRequest = new RefreshTokenRequest(request.AccessToken, refreshToken);
            var result = await identityService.RefreshTokenAsync(refreshRequest, ct);

            if (!result.IsSuccess || result.Value is null)
            {
                return Results.Unauthorized();
            }

            return Results.Ok(new
            {
                userId = result.Value.UserId,
                email = result.Value.Email,
                accessToken = result.Value.AccessToken,
                refreshToken = result.Value.RefreshToken
            });
        })
        .WithName("RefreshToken")
        .Produces(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status401Unauthorized);

        group.MapPost("/register", async (
            [FromBody] RegisterRequest request,
            IIdentityService identityService,
            HttpContext httpContext,
            CancellationToken ct) =>
        {
            var result = await identityService.RegisterAsync(request, ct);
            if (!result.IsSuccess || result.Value is null)
            {
                return Results.BadRequest(new { error = result.Error });
            }

            return Results.Ok(new
            {
                userId = result.Value.UserId,
                email = result.Value.Email,
                accessToken = result.Value.AccessToken,
                refreshToken = result.Value.RefreshToken
            });
        })
        .WithName("Register")
        .Produces(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest);

        group.MapPost("/revoke-session", async (
            [FromBody] RevokeSessionRequest request,
            IIdentityService identityService,
            CancellationToken ct) =>
        {
            if (request == null || string.IsNullOrEmpty(request.RefreshToken))
            {
                return Results.BadRequest(new { error = "Refresh Token не передан." });
            }

            var result = await identityService.RevokeTokenAsync(request.RefreshToken, ct);
            if (!result.IsSuccess)
            {
                return Results.BadRequest(new { error = result.Error });
            }

            return Results.Ok(new { message = "Сессия успешно отозвана." });
        })
        .WithName("RevokeSession")
        .Produces(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest);

        return app;
    }
}

public record RefreshTokenBodyRequest(string AccessToken, string? RefreshToken);
public record RevokeSessionRequest(string RefreshToken);
