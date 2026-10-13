using partcom.Domain.Entities;
using partcom.Domain.Interfaces;
using partcom.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using partcom.Domain.Common;
using System.Linq.Expressions;
using System.Reflection;

namespace partcom.Infrastructure.Repositories;

public class PostgresProductRepository(AppDbContext context) : IProductRepository
{
    private readonly AppDbContext _context = context;

    public async Task<Product?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        var entity = await _context.Products
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id, ct);

        return entity is null ? null : MapToDomain(entity);
    }

    public async Task<List<Product>> GetByCompositeKeysAsync(
    List<ProductCompositeKey> keys,
    CancellationToken cancellationToken = default)
    {
        if (keys == null || keys.Count == 0)
        {
            return [];
        }

        var query = _context.Set<ProductEntity>().AsQueryable();
        var parameter = Expression.Parameter(typeof(ProductEntity), "p");
        Expression? combinedExpression = null;

        MethodInfo toLowerMethod = typeof(string).GetMethod("ToLower", Type.EmptyTypes)!;

        foreach (var key in keys)
        {
            var dbItemNumberLower = Expression.Call(
                Expression.Property(parameter, nameof(ProductEntity.ItemNumber)),
                toLowerMethod
            );
            var itemNumberEqual = Expression.Equal(
                dbItemNumberLower,
                Expression.Constant(key.ItemNumber.Trim().ToLowerInvariant())
            );

            var dbBrandLower = Expression.Call(
                Expression.Property(parameter, nameof(ProductEntity.Brand)),
                toLowerMethod
            );
            var brandEqual = Expression.Equal(
                dbBrandLower,
                Expression.Constant(key.Brand.Trim().ToLowerInvariant())
            );

            var currentKeyExpression = Expression.AndAlso(itemNumberEqual, brandEqual);

            combinedExpression = combinedExpression == null
                ? currentKeyExpression
                : Expression.OrElse(combinedExpression, currentKeyExpression);
        }

        var lambda = Expression.Lambda<Func<ProductEntity, bool>>(combinedExpression!, parameter);

        var dbEntities = await query.Where(lambda).ToListAsync(cancellationToken);

        return [.. dbEntities.Select(MapToDomain)];
    }

    public async Task<PagedResult<Product>> SearchAsync(string? query,
        int page = 1,
        int pageSize = 20,
        CancellationToken ct = default)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var dbQuery = _context.Products.AsNoTracking();

        if (string.IsNullOrWhiteSpace(query))
        {
            var totalCount = await dbQuery.CountAsync(ct);
            var defaultEntities = await dbQuery
                .OrderBy(p => p.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync(ct);

            return new PagedResult<Product>(
                [.. defaultEntities.Select(MapToDomain)],
                totalCount,
                page,
                pageSize
            );
        }

        var cleanQuery = query.Trim();
        var lowerQuery = cleanQuery.ToLower();

        var scoredQuery = dbQuery
            .Select(p => new
            {
                Entity = p,
                NameScore = EF.Functions.TrigramsWordSimilarity(cleanQuery, p.Name),
                ArticleScore = EF.Functions.TrigramsWordSimilarity(cleanQuery, p.ItemNumber),
                IsExactArticle = EF.Functions.ILike(p.ItemNumber, cleanQuery)
            })
            .Where(x => x.IsExactArticle ||
                        EF.Functions.ILike(x.Entity.ItemNumber, $"%{cleanQuery}%") ||
                        EF.Functions.ILike(x.Entity.Name, $"%{cleanQuery}%") ||
                        x.NameScore > 0.2f ||
                        x.ArticleScore > 0.2f);


        var searchTotalCount = await scoredQuery.CountAsync(ct);

        var entities = await scoredQuery
            .OrderByDescending(x => x.IsExactArticle)
            .ThenByDescending(x => Math.Max(x.NameScore, x.ArticleScore))
            .ThenBy(x => x.Entity.Id)
            .Select(x => x.Entity)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return new PagedResult<Product>(
            [.. entities.Select(MapToDomain)],
            searchTotalCount,
            page,
            pageSize
        );
    }

    public async Task AddAsync(Product product, CancellationToken ct = default)
    {
        var entity = MapToEntity(product);
        await _context.Products.AddAsync(entity, ct);
    }

    public async Task AddRangeAsync(IEnumerable<Product> products, CancellationToken ct = default)
    {
        var entities = products.Select(MapToEntity).ToList();
        await _context.Products.AddRangeAsync(entities, ct);
    }

    public async Task UpdateAsync(Product product, CancellationToken ct = default)
    {
        var entity = await _context.Products.FirstOrDefaultAsync(p => p.Id == product.Id, ct);
        if (entity is null) return;

        UpdateEntityFromDomain(entity, product);
    }

    public async Task UpdateRangeAsync(IEnumerable<Product> products, CancellationToken cancellationToken = default)
    {
        if (products == null || !products.Any()) return;

        foreach (var product in products)
        {
            var trackedEntity = _context.Products.Local.FirstOrDefault(p => p.Id == product.Id);

            trackedEntity ??= await _context.Products.FirstOrDefaultAsync(p => p.Id == product.Id, cancellationToken);

            if (trackedEntity != null)
            {
                trackedEntity.Brand = product.Brand;
                trackedEntity.ItemNumber = product.ItemNumber;
                trackedEntity.Name = product.Name;
                trackedEntity.Price = product.Price;
                trackedEntity.Quantity = product.Quantity;
                trackedEntity.ImageUrl = product.ImageUrl;
            }
            else
            {
                var newEntity = MapToEntity(product);
                _context.Products.Update(newEntity);
            }
        }
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var entity = await _context.Products.FirstOrDefaultAsync(p => p.Id == id, ct);
        if (entity is not null)
        {
            _context.Products.Remove(entity);
            await _context.SaveChangesAsync(ct);
        }
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }

    private static Product MapToDomain(ProductEntity entity)
    {
        return new Product(
            id: entity.Id,
            brand: entity.Brand,
            itemNumber: entity.ItemNumber,
            name: entity.Name,
            price: entity.Price,
            quantity: entity.Quantity,
            imageUrl: entity.ImageUrl
        );
    }

    private static ProductEntity MapToEntity(Product product)
    {
        return new ProductEntity
        {
            Id = product.Id,
            Brand = product.Brand,
            ItemNumber = product.ItemNumber,
            Name = product.Name,
            Price = product.Price,
            Quantity = product.Quantity,
            ImageUrl = product.ImageUrl
        };
    }

    private static void UpdateEntityFromDomain(ProductEntity entity, Product product)
    {
        entity.Brand = product.Brand;
        entity.ItemNumber = product.ItemNumber;
        entity.Name = product.Name;
        entity.Price = product.Price;
        entity.Quantity = product.Quantity;
        entity.ImageUrl = product.ImageUrl;
    }
}