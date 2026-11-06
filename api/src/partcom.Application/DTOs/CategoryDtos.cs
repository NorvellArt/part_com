namespace partcom.Application.DTOs;

public record CategoryDto(
    Guid Id,
    string Name,
    string Slug,
    Guid? ParentId,
    int Level,
    int SortOrder
);

public record CategoryNodeDto(
    Guid Id,
    string Name,
    string Slug,
    int Level,
    int SortOrder,
    List<CategoryNodeDto> Children
);

public record CreateCategoryDto(string Name, string Slug, Guid? ParentId);
public record UpdateCategoryDto(string Name, string Slug);
public record MoveCategoryDto(Guid? NewParentId, int NewSortOrder);