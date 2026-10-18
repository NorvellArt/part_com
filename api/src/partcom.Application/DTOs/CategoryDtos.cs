namespace partcom.Application.DTOs;

public record CategoryDto(
    Guid Id,
    string Name,
    string Slug,
    Guid? ParentId,
    int Level
);

public record CategoryNodeDto(
    Guid Id,
    string Name,
    string Slug,
    int Level,
    List<CategoryNodeDto> Children
);

public record CreateCategoryDto(string Name, string Slug, Guid? ParentId);
public record UpdateCategoryDto(string Name, string Slug);