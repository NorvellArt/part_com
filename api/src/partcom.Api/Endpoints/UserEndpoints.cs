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
                roles = result.Value.Roles,
                sessionId = result.Value.SessionId
            });
        })
        .WithName("Login")
        .Produces(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest);

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
                roles = result.Value.Roles,
                sessionId = result.Value.SessionId
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
            if (request == null || string.IsNullOrEmpty(request.SessionId))
            {
                return Results.BadRequest(new { error = "Session Id не передан." });
            }

            var result = await identityService.RevokeSessionAsync(request.SessionId, ct);
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

public record RevokeSessionRequest(string SessionId);
