using Microsoft.AspNetCore.Mvc;

using partcom.Application.DTOs.Auth;
using partcom.Application.Interfaces;

namespace partcom.Api.Endpoints;

public static class AuthEndpoints
{
    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/auth")
                       .WithTags("Auth");

        group.MapPost("/register", async (
            [FromBody] RegisterRequest request,
            IIdentityService identityService,
            HttpContext httpContext,
            CancellationToken ct) =>
        {
            var result = await identityService.RegisterAsync(request, ct);
            if (!result.IsSuccess)
            {
                return Results.BadRequest(new { error = result.Error });
            }

            SetRefreshTokenCookie(httpContext, result.Value!.RefreshToken, result.Value.RefreshTokenExpiresAtUtc);

            return Results.Ok(new
            {
                userId = result.Value.UserId,
                email = result.Value.Email,
                accessToken = result.Value.AccessToken
            });
        })
        .WithName("Register")
        .Produces(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest);

        group.MapPost("/login", async (
            [FromBody] LoginRequest request,
            IIdentityService identityService,
            HttpContext httpContext,
            CancellationToken ct) =>
        {
            var result = await identityService.LoginAsync(request, ct);
            if (!result.IsSuccess)
            {
                return Results.BadRequest(new { error = result.Error });
            }

            SetRefreshTokenCookie(httpContext, result.Value!.RefreshToken, result.Value.RefreshTokenExpiresAtUtc);

            return Results.Ok(new
            {
                userId = result.Value.UserId,
                email = result.Value.Email,
                accessToken = result.Value.AccessToken
            });
        })
        .WithName("Login")
        .Produces(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest);

        group.MapPost("/refresh-token", async (
            [FromBody] RefreshTokenBodyRequest request,
            IIdentityService identityService,
            HttpContext httpContext,
            CancellationToken ct) =>
        {
            var refreshToken = httpContext.Request.Cookies["refreshToken"] ?? request.RefreshToken;

            if (string.IsNullOrEmpty(refreshToken))
            {
                return Results.BadRequest(new { error = "Refresh Token не передан." });
            }

            var refreshRequest = new RefreshTokenRequest(request.AccessToken, refreshToken);
            var result = await identityService.RefreshTokenAsync(refreshRequest, ct);

            if (!result.IsSuccess)
            {
                return Results.Unauthorized();
            }

            SetRefreshTokenCookie(httpContext, result.Value!.RefreshToken, result.Value.RefreshTokenExpiresAtUtc);

            return Results.Ok(new
            {
                userId = result.Value.UserId,
                email = result.Value.Email,
                accessToken = result.Value.AccessToken
            });
        })
        .WithName("RefreshToken")
        .Produces(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status401Unauthorized)
        .RequireAuthorization();

        group.MapPost("/revoke-token", async (
            [FromBody] RevokeTokenRequest? request,
            IIdentityService identityService,
            HttpContext httpContext,
            CancellationToken ct) =>
        {
            var refreshToken = httpContext.Request.Cookies["refreshToken"] ?? request?.RefreshToken;

            if (string.IsNullOrEmpty(refreshToken))
            {
                return Results.BadRequest(new { error = "Refresh Token не передан." });
            }

            var result = await identityService.RevokeTokenAsync(refreshToken, ct);
            if (!result.IsSuccess)
            {
                return Results.BadRequest(new { error = result.Error });
            }

            httpContext.Response.Cookies.Delete("refreshToken");

            return Results.Ok(new { message = "Токен успешно отозван." });
        })
        .WithName("RevokeToken")
        .Produces(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest)
        .RequireAuthorization();;

        return app;
    }

    private static void SetRefreshTokenCookie(HttpContext httpContext, string token, DateTime expiresAtUtc)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = expiresAtUtc
        };

        httpContext.Response.Cookies.Append("refreshToken", token, cookieOptions);
    }
}
public record RefreshTokenBodyRequest(string AccessToken, string? RefreshToken);
public record RevokeTokenRequest(string? RefreshToken);