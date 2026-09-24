namespace partcom.Api.Endpoints;

using partcom.Application.DTOs;
using partcom.Application.Interfaces;

public static class ProductEndpoints
{
    public static void MapProductEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/products")
                       .WithTags("Products");

        group.MapGet("/", async (IProductService productService, CancellationToken ct) =>
        {
            var products = await productService.GetAllAsync(ct);
            return Results.Ok(products);
        });

        group.MapGet("/{id:guid}", async (Guid id, IProductService productService, CancellationToken ct) =>
        {
            var product = await productService.GetByIdAsync(id, ct);
            return product is not null ? Results.Ok(product) : Results.NotFound();
        });

        group.MapPost("/", async (CreateProductDto dto, IProductService productService, CancellationToken ct) =>
        {
            var createdProduct = await productService.CreateAsync(dto, ct);
            return Results.Created($"/api/products/{createdProduct.Id}", createdProduct);
        });

        group.MapPut("/{id:guid}", async (Guid id, UpdateProductDto dto, IProductService productService, CancellationToken ct) =>
        {
            var updated = await productService.UpdateAsync(id, dto, ct);
            return updated ? Results.NoContent() : Results.NotFound();
        });

        group.MapDelete("/{id:guid}", async (Guid id, IProductService productService, CancellationToken ct) =>
        {
            var deleted = await productService.DeleteAsync(id, ct);
            return deleted ? Results.NoContent() : Results.NotFound();
        });
    }
}