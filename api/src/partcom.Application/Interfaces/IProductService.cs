namespace partcom.Application.Interfaces;

using partcom.Application.DTOs;
using partcom.Domain.Common;

public interface IProductService
{
    Task<ProductDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<ProductDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<ProductDto> CreateAsync(CreateProductDto dto, CancellationToken cancellationToken = default);
    Task<bool> UpdateAsync(Guid id, UpdateProductDto dto, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
    Task<PagedResult<ProductDto>> SearchAsync(
    string? query,
    int page = 1,
    int pageSize = 20,
    CancellationToken cancellationToken = default);

    Task<int> ImportFromExcelAsync(Stream fileStream, CancellationToken cancellationToken = default);
}