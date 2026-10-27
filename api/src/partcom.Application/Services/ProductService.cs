namespace partcom.Application.Services;

using partcom.Application.Common;
using partcom.Application.DTOs;
using partcom.Application.Interfaces;
using partcom.Domain.Common;
using partcom.Domain.Entities;
using partcom.Domain.Interfaces;

public class ProductService(
    IProductRepository productRepository,
    ICategoryRepository categoryRepository,
    IExcelProductParser excelParser
    ) : IProductService
{
    private readonly IProductRepository _productRepository = productRepository;
    private readonly ICategoryRepository _categoryRepository = categoryRepository;
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
    string? categorySlug,
    int page = 1,
    int pageSize = 20,
    bool? hasCategory = null,
    CancellationToken cancellationToken = default)
    {
        page = page < 1 ? 1 : page;
        pageSize = pageSize < 1 ? 20 : (pageSize > 100 ? 100 : pageSize);

        var pagedProducts = await _productRepository.SearchAsync(query, categorySlug, page, pageSize, hasCategory, cancellationToken);

        var dtos = pagedProducts.Items
            .Select(MapToDto)
            .ToList();

        return new PagedResult<ProductDto>(
            dtos,
            pagedProducts.TotalCount,
            pagedProducts.Page,
            pagedProducts.PageSize
        );
    }

    public async Task<Result<(int InsertedCount, int UpdatedCount)>> ImportFromExcelAsync(
        Stream fileStream,
        ExcelImportSettings settings,
        CancellationToken cancellationToken = default
        )
    {
        if (fileStream is null || fileStream.Length == 0)
            return Result<(int, int)>.Failure("Файл импорта не может быть пустым.");

        var parseResult = _excelParser.ParseProductsAsync(fileStream, settings, cancellationToken);
        if (parseResult.Error != null)
        {
            return Result<(int, int)>.Failure(parseResult.Error);
        }

        var parsedProducts = parseResult.Value ?? [];

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

            (string ItemNumber, string Brand) currentKey = (
                ItemNumber: parsedProduct.ItemNumber.Trim().ToLowerInvariant(),
                Brand: parsedProduct.Brand.Trim().ToLowerInvariant()
            );

            if (existingProducts.TryGetValue(currentKey, out var existingProduct))
            {
                var brand = parsedProduct.Brand;
                var itemNumber = parsedProduct.ItemNumber;
                var name = settings.DisabledColumnsForUpdate.Contains("НАИМЕНОВАНИЕ") ? existingProduct.Name : parsedProduct.Name;
                var price = settings.DisabledColumnsForUpdate.Contains("ЦЕНА") ? existingProduct.Price : parsedProduct.Price;
                var quantity = settings.DisabledColumnsForUpdate.Contains("НАЛИЧИЕ") ? existingProduct.Quantity : parsedProduct.Quantity;

                existingProduct.Update(brand, itemNumber, name, price, quantity);

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

        return Result<(int, int)>.Success((productsToAdd.Count, productsToUpdate.Count));
    }

    public async Task<bool> AssignCategoryAsync(Guid productId, Guid? categoryId, CancellationToken cancellationToken = default)
    {
        var product = await _productRepository.GetByIdAsync(productId, cancellationToken);
        if (product is null) return false;

        if (categoryId == null)
        {
            product.AssignCategory(null);
        }
        else
        {
            var category = await _categoryRepository.GetByIdAsync(categoryId.Value, cancellationToken)
                ?? throw new ArgumentException("Категория не найдена");
            product.AssignCategory(category);
        }

        await _productRepository.UpdateAsync(product, cancellationToken);
        await _productRepository.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task BulkAssignCategoryAsync(
        IEnumerable<Guid> productIds,
        Guid? categoryId,
        CancellationToken cancellationToken)
    {
        if (productIds == null || !productIds.Any())
        {
            return;
        }

        var products = await _productRepository.GetByIdsAsync(productIds, cancellationToken);
        Category? category = null;
        if (categoryId.HasValue)
        {
            category = await _categoryRepository.GetByIdAsync(categoryId.Value, cancellationToken)
                    ?? throw new ArgumentException("Категория не найдена");
        }

        foreach (var product in products)
        {
            product.AssignCategory(category);
        }

        await _productRepository.UpdateRangeAsync(products, cancellationToken);
        await _productRepository.SaveChangesAsync(cancellationToken);
    }

    private static ProductDto MapToDto(Product product) =>
    new(
        product.Id,
        product.Brand,
        product.ItemNumber,
        product.Name,
        product.Price,
        product.Quantity,
        product.ImageUrl,
        product.CategoryId,
        product.Category?.Name
    );
}