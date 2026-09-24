namespace partcom.Infrastructure;

using Microsoft.Extensions.DependencyInjection;
using partcom.Domain.Interfaces;
using partcom.Infrastructure.Repositories;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddSingleton<IProductRepository, InMemoryProductRepository>();
        return services;
    }
}