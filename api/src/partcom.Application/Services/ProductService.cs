namespace partcom.Application.Services;

using partcom.Application.DTOs;
using partcom.Application.Interfaces;
using partcom.Domain.Common;
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
        await _productRepository.SaveChangesAsync();
        return MapToDto(product);
    }

    public async Task<bool> UpdateAsync(Guid id, UpdateProductDto dto, CancellationToken cancellationToken = default)
    {
        var product = await _productRepository.GetByIdAsync(id, cancellationToken);
        if (product is null)
            return false;

        product.Update(dto.Brand, dto.ItemNumber, dto.Name, dto.Price, dto.Quantity);
        await _productRepository.UpdateAsync(product, cancellationToken);
        await _productRepository.SaveChangesAsync();
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

    public async Task<PagedResult<ProductDto>> SearchAsync(
    string? query,
    int page = 1,
    int pageSize = 20,
    CancellationToken cancellationToken = default)
    {
        page = page < 1 ? 1 : page;
        pageSize = pageSize < 1 ? 20 : (pageSize > 100 ? 100 : pageSize);
        
        var pagedProducts = await _productRepository.SearchAsync(query, page, pageSize, cancellationToken);

        var dtos = pagedProducts.Items
            .Select(p => new ProductDto(
                p.Id,
                p.Brand,
                p.ItemNumber,
                p.Name,
                p.Price,
                p.Quantity,
                p.ImageUrl
            ))
            .ToList();

        return new PagedResult<ProductDto>(
            dtos,
            pagedProducts.TotalCount,
            pagedProducts.Page,
            pagedProducts.PageSize
        );
    }

    public async Task<(int InsertedCount, int UpdatedCount)> ImportFromExcelAsync(
        Stream fileStream,
        CancellationToken cancellationToken = default
        )
    {
        if (fileStream is null || fileStream.Length == 0)
            throw new ArgumentException("Файл импорта не может быть пустым.", nameof(fileStream));

        var parsedProducts = await _excelParser.ParseProductsAsync(fileStream, cancellationToken);

        var excelKeys = parsedProducts
            .Where(p => !string.IsNullOrWhiteSpace(p.ItemNumber) && !string.IsNullOrWhiteSpace(p.Brand))
            .Select(p => new ProductCompositeKey(p.ItemNumber.Trim(), p.Brand.Trim()))
            .Distinct()
            .ToList();

        var existingProductsList = await _productRepository.GetByCompositeKeysAsync(excelKeys, cancellationToken);

        var existingProducts = existingProductsList.ToDictionary(
            p => (ItemNumber: p.ItemNumber.Trim().ToLowerInvariant(), Brand: p.Brand.Trim().ToLowerInvariant())
        );

        var productsToAdd = new List<Product>();
        var productsToUpdate = new Dictionary<(string, string), Product>();

        foreach (var parsedProduct in parsedProducts)
        {
            if (string.IsNullOrWhiteSpace(parsedProduct.ItemNumber) || string.IsNullOrWhiteSpace(parsedProduct.Brand))
                continue;

            var currentKey = (
                ItemNumber: parsedProduct.ItemNumber.Trim().ToLowerInvariant(),
                Brand: parsedProduct.Brand.Trim().ToLowerInvariant()
            );

            if (existingProducts.TryGetValue(currentKey, out var existingProduct))
            {
                existingProduct.Update(
                    parsedProduct.Brand,
                    parsedProduct.ItemNumber,
                    parsedProduct.Name,
                    parsedProduct.Price,
                    parsedProduct.Quantity
                );

                productsToUpdate[currentKey] = existingProduct;
            }
            else
            {
                productsToAdd.Add(parsedProduct);
                existingProducts[currentKey] = parsedProduct;
            }
        }

        if (productsToAdd.Count > 0)
        {
            await _productRepository.AddRangeAsync(productsToAdd, cancellationToken);
        }

        if (productsToUpdate.Count > 0)
        {
            await _productRepository.UpdateRangeAsync(productsToUpdate.Values, cancellationToken);
        }

        await _productRepository.SaveChangesAsync(cancellationToken);

        return (productsToAdd.Count, productsToUpdate.Count);
    }

    private static ProductDto MapToDto(Product product) =>
        new(
            product.Id,
            product.Brand,
            product.ItemNumber,
            product.Name,
            product.Price,
            product.Quantity,
            product.ImageUrl
        );
}