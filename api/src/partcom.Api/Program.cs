using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using partcom.Api.Endpoints;
using partcom.API.Endpoints;
using partcom.Application;
using partcom.Infrastructure;
using partcom.Infrastructure.Identity;
using partcom.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

string myAllowSpecificOrigins = "_myAllowSpecificOrigins";

var corsOriginsEnv = Environment.GetEnvironmentVariable("CORS_ALLOWED_ORIGINS")
                     ?? "http://localhost:3000";

var allowedOrigins = corsOriginsEnv.Split(',', StringSplitOptions.RemoveEmptyEntries);

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: myAllowSpecificOrigins,
        policy =>
        {
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApplication();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await dbContext.Database.MigrateAsync();

    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
    await IdentityDataSeeder.SeedRolesAsync(roleManager);
}

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapUserEndpoints();
app.MapProductEndpoints();
app.MapCategoryEndpoints();

app.Run();
