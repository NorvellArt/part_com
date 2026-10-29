namespace partcom.Application.DTOs;

public record ProductDto(
    Guid Id,
    string Brand,
    string ItemNumber,
    string DisplayItemNumber,
    string Name,
    decimal Price,
    int Quantity,
    string? ImageUrl,
    Guid? CategoryId,
    string? CategoryName,
    bool IsPublished
);

public record CreateProductDto(
    string Brand,
    string ItemNumber,
    string DisplayItemNumber,
    string Name,
    decimal Price,
    int Quantity,
    string? ImageUrl
);

public record UpdateProductDto(
    string Brand,
    string ItemNumber,
    string DisplayItemNumber,
    string Name,
    decimal Price,
    int Quantity,
    string? ImageUrl,
    bool IsPublished
);