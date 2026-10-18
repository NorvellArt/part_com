namespace partcom.Application.Services;

using partcom.Application.DTOs;
using partcom.Application.Interfaces;
using partcom.Domain.Entities;
using partcom.Domain.Interfaces;

public class CategoryService(ICategoryRepository categoryRepository) : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository = categoryRepository;

    public async Task<List<CategoryNodeDto>> GetTreeAsync(CancellationToken cancellationToken = default)
    {
        var allCategories = await _categoryRepository.GetAllFlatAsync(cancellationToken);

        var nodes = allCategories.Select(c => new CategoryNodeDto(
            c.Id, c.Name, c.Slug, c.Level, []
        )).ToDictionary(n => n.Id);

        var rootNodes = new List<CategoryNodeDto>();

        foreach (var cat in allCategories)
        {
            var currentNode = nodes[cat.Id];
            if (cat.ParentId == null || cat.Level == 1)
            {
                rootNodes.Add(currentNode);
            }
            else if (nodes.TryGetValue(cat.ParentId.Value, out var parentNode))
            {
                parentNode.Children.Add(currentNode);
            }
        }

        return [.. rootNodes.OrderBy(n => n.Name)];
    }

    public async Task<CategoryDto> CreateAsync(CreateCategoryDto dto, CancellationToken cancellationToken = default)
    {
        Category category;

        if (dto.ParentId == null)
        {
            category = new Category(dto.Name, dto.Slug);
        }
        else
        {
            var parent = await _categoryRepository.GetByIdAsync(dto.ParentId.Value, cancellationToken)
                ?? throw new ArgumentException("Родительская категория не найдена.");

            category = parent.CreateChild(dto.Name, dto.Slug);
        }

        await _categoryRepository.AddAsync(category, cancellationToken);
        await _categoryRepository.SaveChangesAsync(cancellationToken);

        return new CategoryDto(category.Id, category.Name, category.Slug, category.ParentId, category.Level);
    }

    public async Task<bool> UpdateAsync(Guid id, UpdateCategoryDto dto, CancellationToken cancellationToken = default)
    {
        var category = await _categoryRepository.GetByIdAsync(id, cancellationToken);
        if (category == null) return false;

        category.Update(dto.Name, dto.Slug);

        await _categoryRepository.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<bool> MoveAsync(Guid id, Guid? newParentId, CancellationToken cancellationToken = default)
    {
        var category = await _categoryRepository.GetByIdAsync(id, cancellationToken);
        if (category == null) return false;

        Category? newParent = null;
        if (newParentId.HasValue)
        {
            newParent = await _categoryRepository.GetByIdAsync(newParentId.Value, cancellationToken)
                ?? throw new ArgumentException("Новая родительская категория не найдена.");
        }

        category.MoveToParent(newParent);

        await _categoryRepository.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var category = await _categoryRepository.GetByIdAsync(id, cancellationToken);
        if (category == null) return false;

        await _categoryRepository.DeleteAsync(id, cancellationToken);
        await _categoryRepository.SaveChangesAsync(cancellationToken);
        return true;
    }
}
