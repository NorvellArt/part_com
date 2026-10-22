namespace partcom.Api.Endpoints;

using partcom.Application.DTOs;
using partcom.Application.Interfaces;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using partcom.Domain.Common;

public static class ProductEndpoints
{
    public static void MapProductEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/products")
                       .WithTags("Products");

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

        group.MapGet("/search", SearchProducts)
             .Produces<PagedResult<ProductDto>>(StatusCodes.Status200OK);

        group.MapPut("/{id:guid}/assign-category", async (
            Guid id,
            [FromBody] AssignCategoryRequest request,
            IProductService productService,
            CancellationToken ct) =>
        {
            try
            {
                var success = await productService.AssignCategoryAsync(id, request.CategoryId, ct);
                return success ? Results.NoContent() : Results.NotFound();
            }
            catch (InvalidOperationException ex)
            {
                return Results.BadRequest(new { error = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return Results.BadRequest(new { error = ex.Message });
            }
        })
        .WithName("AssignProductCategory")
        .Produces(StatusCodes.Status204NoContent)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status404NotFound)
        .RequireAuthorization();

        group.MapPost("/import", async (IFormFile file, IProductService productService, CancellationToken ct) =>
        {
            if (file is null || file.Length == 0)
            {
                return Results.BadRequest(new { message = "Файл не был загружен или пуст." });
            }

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (extension != ".xlsx" && extension != ".xls")
            {
                return Results.BadRequest(new { message = "Неверный формат файла. Поддерживаются только .xlsx и .xls" });
            }

            using var stream = file.OpenReadStream();
            var (importedCount, updatedCount) = await productService.ImportFromExcelAsync(stream, ct);

            return Results.Ok(new
            {
                importedCount,
                updatedCount
            });
        })
        .DisableAntiforgery()
        .Accepts<IFormFile>("multipart/form-data")
        .Produces(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status400BadRequest)
        .RequireAuthorization();

        group.MapPut("/bulk-assign-category", BulkAssignCategoryAsync);
    }

    private static async Task<IResult> SearchProducts(
        [FromQuery] string? query,
        [FromQuery] string? categorySlug,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        IProductService productService = null!,
        CancellationToken ct = default)
    {
        var result = await productService.SearchAsync(query, categorySlug, page, pageSize, ct);
        return Results.Ok(result);
    }

    private static async Task<IResult> BulkAssignCategoryAsync(
        [FromBody] BulkAssignCategoryRequest request,
        [FromServices] IProductService productService,
        CancellationToken cancellationToken)
    {
        if (request.ProductIds == null || !request.ProductIds.Any())
        {
            return Results.BadRequest("Список идентификаторов товаров (ProductIds) не может быть пустым.");
        }

        await productService.BulkAssignCategoryAsync(request.ProductIds, request.CategoryId, cancellationToken);

        return Results.NoContent();
    }
}

public record AssignCategoryRequest(Guid? CategoryId);
public record BulkAssignCategoryRequest(IEnumerable<Guid> ProductIds, Guid? CategoryId);
