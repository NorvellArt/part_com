namespace partcom.Application.Services;

using partcom.Application.Common;
using partcom.Application.DTOs;
using partcom.Application.Interfaces;
using partcom.Domain.Entities;
using partcom.Domain.Interfaces;

public class CategoryService(
    ICategoryRepository categoryRepository,
    IProductRepository productRepository
    ) : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository = categoryRepository;
    private readonly IProductRepository _productRepository = productRepository;

    public async Task<List<CategoryNodeDto>> GetTreeAsync(CancellationToken cancellationToken = default)
    {
        var allCategories = await _categoryRepository.GetAllFlatAsync(cancellationToken);

        var lookup = allCategories.ToLookup(c => c.ParentId);

        List<CategoryNodeDto> BuildTree(Guid? parentId)
        {
            return [.. lookup[parentId]
                .OrderBy(c => c.SortOrder)
                .Select(c => new CategoryNodeDto(
                    c.Id,
                    c.Name,
                    c.Slug,
                    c.Level,
                    c.SortOrder,
                    BuildTree(c.Id)
                ))];
        }

        return BuildTree(null);
    }


    public async Task<CategoryDto> CreateAsync(CreateCategoryDto dto, CancellationToken cancellationToken = default)
    {
        Category category;

        var siblings = await _categoryRepository.GetChildrenByParentIdAsync(dto.ParentId, cancellationToken);
        int nextSortOrder = siblings.Count;

        if (dto.ParentId == null)
        {
            category = new Category(dto.Name, dto.Slug, nextSortOrder);
        }
        else
        {
            var parent = await _categoryRepository.GetByIdAsync(dto.ParentId.Value, cancellationToken)
                ?? throw new ArgumentException("Родительская категория не найдена.");

            category = parent.CreateChild(dto.Name, dto.Slug, nextSortOrder);
        }

        await _categoryRepository.AddAsync(category, cancellationToken);
        await _categoryRepository.SaveChangesAsync(cancellationToken);

        return new CategoryDto(
            category.Id,
            category.Name,
            category.Slug,
            category.ParentId,
            category.Level,
            category.SortOrder
        );
    }


    public async Task<Result> UpdateAsync(Guid id, UpdateCategoryDto dto, CancellationToken cancellationToken = default)
    {
        var category = await _categoryRepository.GetByIdAsync(id, cancellationToken);
        if (category == null)
            return Result.Failure("Категория не найдена.");

        if (category.Slug != dto.Slug)
        {
            var existingCategoryWithSlug = await _categoryRepository.GetBySlugAsync(dto.Slug, cancellationToken);
            if (existingCategoryWithSlug != null)
                return Result.Failure("Категория с таким Slug уже существует.");
        }

        category.Update(dto.Name, dto.Slug);

        await _categoryRepository.UpdateAsync(category, cancellationToken);
        await _categoryRepository.SaveChangesAsync(cancellationToken);
        return Result.Success();
    }

    public async Task<Result> MoveAsync(
        Guid id,
        Guid? newParentId,
        int newSortOrder,
        CancellationToken cancellationToken = default)
    {
        var category = await _categoryRepository.GetByIdWithSubTreeAsync(id, cancellationToken);
        if (category == null)
        {
            return Result.Failure($"Категория с Id {id} не найдена.");
        }

        Guid? oldParentId = category.ParentId;
        int oldSortOrder = category.SortOrder;

        if (oldParentId == newParentId && oldSortOrder == newSortOrder)
        {
            return Result.Success();
        }

        Category? newParent = null;
        if (newParentId.HasValue)
        {
            newParent = await _categoryRepository.GetByIdAsync(newParentId.Value, cancellationToken);
            if (newParent == null)
            {
                return Result.Failure($"Новая родительская категория с Id {newParentId} не найдена.");
            }
        }

        try
        {
            category.MoveToParent(newParent, newSortOrder);
        }
        catch (InvalidOperationException ex)
        {
            return Result.Failure(ex.Message);
        }

        if (oldParentId == newParentId)
        {
            var siblings = await _categoryRepository.GetChildrenByParentIdAsync(oldParentId, cancellationToken);

            var otherSiblings = siblings.Where(c => c.Id != category.Id).ToList();
            otherSiblings.Insert(Math.Min(newSortOrder, otherSiblings.Count), category);

            for (int i = 0; i < otherSiblings.Count; i++)
            {
                otherSiblings[i].UpdateSortOrder(i);
                await _categoryRepository.UpdateAsync(otherSiblings[i], cancellationToken);
            }
        }
        else
        {
            var oldSiblings = await _categoryRepository.GetChildrenByParentIdAsync(oldParentId, cancellationToken);
            var remainingOldSiblings = oldSiblings.Where(c => c.Id != category.Id).ToList();
            for (int i = 0; i < remainingOldSiblings.Count; i++)
            {
                remainingOldSiblings[i].UpdateSortOrder(i);
                await _categoryRepository.UpdateAsync(remainingOldSiblings[i], cancellationToken);
            }

            var newSiblings = await _categoryRepository.GetChildrenByParentIdAsync(newParentId, cancellationToken);

            int targetIndex = Math.Min(newSortOrder, newSiblings.Count);

            newSiblings.Insert(targetIndex, category);
            for (int i = 0; i < newSiblings.Count; i++)
            {
                newSiblings[i].UpdateSortOrder(i);
                await _categoryRepository.UpdateAsync(newSiblings[i], cancellationToken);
            }
        }

        await _categoryRepository.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }

    public async Task<Result> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var category = await _categoryRepository.GetByIdAsync(id, cancellationToken);
        if (category == null)
            return Result.Failure("Категория не найдена.");

        var hasSubCategories = await _categoryRepository.HasSubCategoriesAsync(id, cancellationToken);
        if (hasSubCategories)
        {
            return Result.Failure("Нельзя удалить категорию, так как у нее есть дочерние подкатегории.");
        }

        var hasProducts = await _productRepository.HasProductsAsync(id, cancellationToken);
        if (hasProducts)
        {
            return Result.Failure("Нельзя удалить категорию, так как к ней привязаны товары.");
        }

        await _categoryRepository.DeleteAsync(id, cancellationToken);
        await _categoryRepository.SaveChangesAsync(cancellationToken);

        return Result.Success();
    }
}
