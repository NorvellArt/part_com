using Microsoft.EntityFrameworkCore;
using partcom.Domain.Entities;
using partcom.Domain.Interfaces;
using partcom.Infrastructure.Persistence;

namespace partcom.Infrastructure.Repositories;

public class PostgresCategoryRepository(AppDbContext context) : ICategoryRepository
{
    private readonly AppDbContext _context = context;

    public async Task<Category?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _context.Categories
            .Include(c => c.Children)
            .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);

        return entity is null ? null : MapToDomain(entity);
    }

    public async Task<Category?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
    {
        var entity = await _context.Categories
            .FirstOrDefaultAsync(c => c.Slug == slug.ToLowerInvariant(), cancellationToken);

        return entity is null ? null : MapToDomain(entity);
    }

    public async Task<List<Category>> GetAllFlatAsync(CancellationToken cancellationToken = default)
    {
        var entities = await _context.Categories
            .AsNoTracking()
            .OrderBy(c => c.SortOrder)
            .ToListAsync(cancellationToken);

        return [.. entities.Select(MapToDomain)];
    }

    public async Task AddAsync(Category category, CancellationToken cancellationToken = default)
    {
        var entity = MapToEntity(category);
        await _context.Categories.AddAsync(entity, cancellationToken);
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _context.Categories.FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
        if (entity != null)
        {
            _context.Categories.Remove(entity);
        }
    }

    public async Task UpdateAsync(Category category, CancellationToken cancellationToken = default)
    {
        var entity = await _context.Categories.FindAsync([category.Id], cancellationToken)
            ?? throw new InvalidOperationException($"Сущность CategoryEntity с Id {category.Id} не найдена для обновления.");

        entity.Name = category.Name;
        entity.Slug = category.Slug;
        entity.ParentId = category.ParentId;
        entity.Level = category.Level;
        entity.SortOrder = category.SortOrder;

        UpdateChildEntitiesProperties(entity, category);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> HasSubCategoriesAsync(Guid categoryId, CancellationToken cancellationToken = default)
    {
        return await _context.Categories
            .AnyAsync(c => c.ParentId == categoryId, cancellationToken);
    }

    public async Task<List<Category>> GetChildrenByParentIdAsync(Guid? parentId, CancellationToken cancellationToken = default)
    {
        var entities = await _context.Categories
            .Where(c => c.ParentId == parentId)
            .OrderBy(c => c.SortOrder)
            .ToListAsync(cancellationToken);

        return [.. entities.Select(MapToDomain)];
    }

    public async Task<Category?> GetByIdWithSubTreeAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _context.Categories
            .Include(c => c.Children)
                .ThenInclude(ch => ch.Children)
            .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);

        return entity is null ? null : MapToDomainWithChildren(entity);
    }

    private static Category MapToDomain(CategoryEntity entity)
    {
        return Category.Reconstitute(
            entity.Id,
            entity.Name,
            entity.Slug,
            entity.ParentId,
            entity.Level,
            entity.SortOrder
        );
    }

    private static CategoryEntity MapToEntity(Category domain)
    {
        return new CategoryEntity
        {
            Id = domain.Id,
            Name = domain.Name,
            Slug = domain.Slug,
            ParentId = domain.ParentId,
            Level = domain.Level,
            SortOrder = domain.SortOrder
        };
    }

    private static Category MapToDomainWithChildren(CategoryEntity entity)
    {
        var domainCategory = MapToDomain(entity);

        foreach (var childEntity in entity.Children)
        {
            var domainChild = MapToDomainWithChildren(childEntity);
            domainChild.MoveToParent(domainCategory, domainChild.SortOrder);
        }

        return domainCategory;
    }

    private void UpdateChildEntitiesProperties(CategoryEntity entity, Category domain)
    {
        foreach (var domainChild in domain.Children)
        {
            var childEntity = _context.Categories.Local.FirstOrDefault(c => c.Id == domainChild.Id)
                              ?? entity.Children.FirstOrDefault(c => c.Id == domainChild.Id);

            if (childEntity != null)
            {
                childEntity.Level = domainChild.Level;
                childEntity.SortOrder = domainChild.SortOrder;
                childEntity.ParentId = domainChild.ParentId;

                UpdateChildEntitiesProperties(childEntity, domainChild);
            }
        }
    }
}
