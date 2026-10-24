namespace partcom.Application.Interfaces;

using partcom.Application.DTOs;
using partcom.Domain.Common;

public interface IProductService
{
    Task<ProductDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<ProductDto> CreateAsync(CreateProductDto dto, CancellationToken cancellationToken = default);
    Task<bool> UpdateAsync(Guid id, UpdateProductDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
    Task<PagedResult<ProductDto>> SearchAsync(
    string? query,
    string? categorySlug,
    int page = 1,
    int pageSize = 20,
    bool? hasCategory = null,
    CancellationToken cancellationToken = default);

    Task<(int InsertedCount, int UpdatedCount)> ImportFromExcelAsync(Stream fileStream, CancellationToken cancellationToken = default);
    Task<bool> AssignCategoryAsync(Guid productId, Guid? categoryId, CancellationToken cancellationToken = default);
    Task BulkAssignCategoryAsync(
        IEnumerable<Guid> productIds,
        Guid? categoryId,
        CancellationToken cancellationToken = default);
}