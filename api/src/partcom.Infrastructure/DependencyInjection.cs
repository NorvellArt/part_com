namespace partcom.Infrastructure;

using Microsoft.Extensions.DependencyInjection;
using partcom.Application.Interfaces;
using partcom.Domain.Interfaces;
using partcom.Infrastructure.Repositories;
using partcom.Infrastructure.Services;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<IProductRepository, PostgresProductRepository>();
        services.AddScoped<IExcelProductParser, ExcelProductParser>();

        return services;
    }
}