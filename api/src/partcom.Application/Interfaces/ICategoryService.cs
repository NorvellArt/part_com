namespace partcom.Application.Interfaces;

using partcom.Application.Common;
using partcom.Application.DTOs;

public interface ICategoryService
{
    Task<List<CategoryNodeDto>> GetTreeAsync(CancellationToken cancellationToken = default);
    Task<CategoryDto> CreateAsync(CreateCategoryDto dto, CancellationToken cancellationToken = default);
    Task<Result> UpdateAsync(Guid id, UpdateCategoryDto dto, CancellationToken cancellationToken = default);
    Task<Result> MoveAsync(Guid id, Guid? newParentId, int newSortOrder, CancellationToken cancellationToken = default);
    Task<Result> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
