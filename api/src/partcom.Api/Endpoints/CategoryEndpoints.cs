using partcom.Application.DTOs;
using partcom.Application.Interfaces;

namespace partcom.API.Endpoints;

public static class CategoryEndpoints
{
    public static void MapCategoryEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/categories")
                       .WithTags("Categories");

        group.MapGet("/tree", async (ICategoryService categoryService, CancellationToken ct) =>
        {
            var tree = await categoryService.GetTreeAsync(ct);
            return Results.Ok(tree);
        })
        .WithName("GetCategoriesTree")
        .Produces<List<CategoryNodeDto>>(StatusCodes.Status200OK);

        group.MapPost("/", async (CreateCategoryDto dto, ICategoryService categoryService, CancellationToken ct) =>
        {
            try
            {
                var category = await categoryService.CreateAsync(dto, ct);
                return Results.Created($"/api/categories/{category.Id}", category);
            }
            catch (ArgumentException ex)
            {
                return Results.BadRequest(new { error = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Results.BadRequest(new { error = ex.Message });
            }
        })
        .WithName("CreateCategory")
        .Produces<CategoryDto>(StatusCodes.Status201Created)
        .Produces(StatusCodes.Status400BadRequest);

        group.MapPut("/{id:guid}", async (Guid id, UpdateCategoryDto dto, ICategoryService categoryService, CancellationToken ct) =>
        {
            var updated = await categoryService.UpdateAsync(id, dto, ct);
            return updated ? Results.NoContent() : Results.NotFound();
        })
        .WithName("UpdateCategory")
        .Produces(StatusCodes.Status204NoContent)
        .Produces(StatusCodes.Status404NotFound);

        group.MapPut("/{id:guid}/move", async (Guid id, Guid? newParentId, ICategoryService categoryService, CancellationToken ct) =>
        {
            try
            {
                var moved = await categoryService.MoveAsync(id, newParentId, ct);
                return moved ? Results.NoContent() : Results.NotFound();
            }
            catch (InvalidOperationException ex)
            {
                return Results.BadRequest(new { error = ex.Message });
            }
        })
        .WithName("MoveCategory")
        .Produces(StatusCodes.Status204NoContent)
        .Produces(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status404NotFound);

        group.MapDelete("/{id:guid}", async (Guid id, ICategoryService categoryService, CancellationToken ct) =>
        {
            var result = await categoryService.DeleteAsync(id, ct);

            if (!result.IsSuccess)
            {
                if (result.Error == "Категория не найдена.")
                {
                    return Results.NotFound(new { error = result.Error });
                }
                
                return Results.BadRequest(new { error = result.Error });
            }

            return Results.NoContent();
        })
        .WithName("DeleteCategory")
        .Produces(StatusCodes.Status204NoContent)
        .Produces(StatusCodes.Status404NotFound);
    }
}
