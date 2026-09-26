namespace partcom.Application.Services;

using partcom.Application.DTOs;
using partcom.Application.Interfaces;
using partcom.Domain.Entities;
using partcom.Domain.Interfaces;

public class ProductService(
    IProductRepository productRepository,
    IExcelProductParser excelParser
    ) : IProductService
{
    private readonly IProductRepository _productRepository = productRepository;
    private readonly IExcelProductParser _excelParser = excelParser;

    public async Task<ProductDto?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var product = await _productRepository.GetByIdAsync(id, cancellationToken);
        return product is null ? null : MapToDto(product);
    }

    public async Task<IReadOnlyList<ProductDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        var products = await _productRepository.GetAllAsync(cancellationToken);
        return [.. products.Select(MapToDto)];
    }

    public async Task<ProductDto> CreateAsync(CreateProductDto dto, CancellationToken cancellationToken = default)
    {
        var product = new Product(
            dto.Brand,
            dto.ItemNumber,
            dto.Name,
            dto.Price,
            dto.Quantity
        );

        await _productRepository.AddAsync(product, cancellationToken);
        return MapToDto(product);
    }

    public async Task<bool> UpdateAsync(Guid id, UpdateProductDto dto, CancellationToken cancellationToken = default)
    {
        var product = await _productRepository.GetByIdAsync(id, cancellationToken);
        if (product is null)
            return false;

        product.Update(dto.Brand, dto.ItemNumber, dto.Name, dto.Price, dto.Quantity);
        await _productRepository.UpdateAsync(product, cancellationToken);
        return true;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var product = await _productRepository.GetByIdAsync(id, cancellationToken);
        if (product is null)
            return false;

        await _productRepository.DeleteAsync(id, cancellationToken);
        return true;
    }

    public async Task<int> ImportFromExcelAsync(Stream fileStream, CancellationToken cancellationToken = default)
    {
        if (fileStream is null || fileStream.Length == 0)
            throw new ArgumentException("Файл импорта не может быть пустым.", nameof(fileStream));

        var products = await _excelParser.ParseProductsAsync(fileStream, cancellationToken);

        if (products.Count == 0)
            return 0;

        await _productRepository.AddRangeAsync(products, cancellationToken);

        return products.Count;
    }

    private static ProductDto MapToDto(Product product) =>
        new(product.Id, product.Brand, product.ItemNumber, product.Name, product.Price, product.Quantity);
}