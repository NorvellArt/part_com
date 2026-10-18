using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using partcom.Application.Interfaces;
using partcom.Infrastructure.Identity;
using partcom.Infrastructure.Persistence;
using partcom.Infrastructure.Auth;
using partcom.Domain.Interfaces;
using partcom.Infrastructure.Repositories;
using partcom.Infrastructure.Services;

namespace partcom.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(connectionString));

        services.AddIdentity<ApplicationUser, IdentityRole<Guid>>(options =>
        {
            options.Password.RequireDigit = true;
            options.Password.RequiredLength = 8;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequireUppercase = true;
            options.Password.RequireLowercase = true;

            options.User.RequireUniqueEmail = true;
        })
        .AddEntityFrameworkStores<AppDbContext>()
        .AddDefaultTokenProviders();

        // ВМЕСТО JWT BEARER: Регистрируем кастомную сессионную схему аутентификации.
        // Она будет перехватывать заголовок X-Session-Id через наш SessionAuthenticationHandler.
        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = "PartcomSessionScheme";
            options.DefaultChallengeScheme = "PartcomSessionScheme";
        })
        .AddScheme<SessionSchemeOptions, SessionAuthenticationHandler>("PartcomSessionScheme", null);

        services.AddAuthorization();

        services.AddScoped<IIdentityService, IdentityService>();

        services.AddScoped<IProductRepository, PostgresProductRepository>();
        services.AddScoped<ICategoryRepository, PostgresCategoryRepository>();
        services.AddScoped<IExcelProductParser, ExcelProductParser>();

        return services;
    }
}
