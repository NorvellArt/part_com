namespace partcom.Application.DTOs;

public record ProductDto(
    Guid Id,
    string Brand,
    string ItemNumber,
    string Name,
    decimal Price,
    int Quantity
);

public record CreateProductDto(
    string Brand,
    string ItemNumber,
    string Name,
    decimal Price,
    int Quantity
);

public record UpdateProductDto(
    string Brand,
    string ItemNumber,
    string Name,
    decimal Price,
    int Quantity
);