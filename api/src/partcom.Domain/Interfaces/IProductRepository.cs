namespace partcom.Domain.Interfaces;

using partcom.Domain.Common;
using partcom.Domain.Entities;

public interface IProductRepository
{
    Task<Product?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<List<Product>> GetByCompositeKeysAsync(
        List<ProductCompositeKey> keys,
        CancellationToken cancellationToken = default);
    Task<PagedResult<Product>> SearchAsync(
        string? query,
        string? categorySlug,
        int page = 1,
        int pageSize = 20,
        CancellationToken ct = default
    );
    Task AddAsync(Product product, CancellationToken cancellationToken = default);
    Task AddRangeAsync(IEnumerable<Product> products, CancellationToken cancellationToken = default);
    Task UpdateAsync(Product product, CancellationToken cancellationToken = default);
    Task UpdateRangeAsync(IEnumerable<Product> products, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}