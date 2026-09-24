namespace partcom.Application;

using Microsoft.Extensions.DependencyInjection;
using partcom.Application.Interfaces;
using partcom.Application.Services;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IProductService, ProductService>();
        
        return services;
    }
}