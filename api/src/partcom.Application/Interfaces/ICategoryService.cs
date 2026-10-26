namespace partcom.Application.Interfaces;

using partcom.Application.Common;
using partcom.Application.DTOs;

public interface ICategoryService
{
    Task<List<CategoryNodeDto>> GetTreeAsync(CancellationToken cancellationToken = default);
    Task<CategoryDto> CreateAsync(CreateCategoryDto dto, CancellationToken cancellationToken = default);
    Task<bool> UpdateAsync(Guid id, UpdateCategoryDto dto, CancellationToken cancellationToken = default);
    Task<bool> MoveAsync(Guid id, Guid? newParentId, CancellationToken cancellationToken = default);
    Task<Result> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
