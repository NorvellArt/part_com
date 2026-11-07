using partcom.Application.Common;
using Moq;
using partcom.Application.DTOs;
using partcom.Application.Interfaces;
using partcom.Application.Services;
using partcom.Domain.Common;
using partcom.Domain.Entities;
using partcom.Domain.Interfaces;

namespace partcom.UnitTests.Application.Services;

public class ProductServiceTests
{
    private readonly Mock<IProductRepository> _productRepositoryMock;
    private readonly Mock<IExcelProductParser> _excelParserMock;
    private readonly ProductService _service;

    public ProductServiceTests()
    {
        _productRepositoryMock = new Mock<IProductRepository>();
        _excelParserMock = new Mock<IExcelProductParser>();

        _service = new ProductService(
            _productRepositoryMock.Object,
            Mock.Of<ICategoryRepository>(),
            _excelParserMock.Object,
            Mock.Of<IFileStorageService>());
    }

    #region GetByIdAsync Tests

    [Fact]
    public async Task GetByIdAsync_WhenProductExists_ShouldReturnProductDto()
    {
        var productId = Guid.NewGuid();
        var product = new Product(productId, "Bosch", "0242236565", "Display number", "Свеча зажигания", 450m, 10, false);

        _productRepositoryMock
            .Setup(r => r.GetByIdAsync(productId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(product);

        var result = await _service.GetByIdAsync(productId);

        Assert.NotNull(result);
        Assert.Equal(productId, result.Id);
        Assert.Equal("Bosch", result.Brand);
        Assert.Equal("0242236565", result.ItemNumber);
    }

    [Fact]
    public async Task GetByIdAsync_WhenProductDoesNotExist_ShouldReturnNull()
    {
        var productId = Guid.NewGuid();

        _productRepositoryMock
            .Setup(r => r.GetByIdAsync(productId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Product?)null);

        var result = await _service.GetByIdAsync(productId);

        Assert.Null(result);
    }

    #endregion

    #region CreateAsync Tests

    [Fact]
    public async Task CreateAsync_WithValidDto_ShouldAddProductAndSaveChanges()
    {
        var product = new CreateProductDto("Bosch", "0242236565", "Display number", "Свеча зажигания", 450m, 10, "");

        var result = await _service.CreateAsync(product);

        Assert.NotNull(result);
        Assert.Equal(product.Brand, result.Brand);
        Assert.Equal(product.ItemNumber, result.ItemNumber);

        _productRepositoryMock.Verify(r => r.AddAsync(It.IsAny<Product>(), It.IsAny<CancellationToken>()), Times.Once);
        _productRepositoryMock.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    #endregion

    #region UpdateAsync Tests

    [Fact]
    public async Task UpdateAsync_WhenProductExists_ShouldUpdateAndReturnTrue()
    {
        var productId = Guid.NewGuid();
        var existingProduct = new Product(productId, "Bosch", "0242236565", "Display number", "Старое имя", 400m, 5, false);
        var updateDto = new UpdateProductDto("Bosch", "0242236565", "Display number", "Новое имя", 500m, 15, "", true);

        _productRepositoryMock
            .Setup(r => r.GetByIdAsync(productId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(existingProduct);

        var result = await _service.UpdateAsync(productId, updateDto);

        Assert.True(result);
        Assert.Equal("Новое имя", existingProduct.Name);
        Assert.Equal(500m, existingProduct.Price);
        Assert.True(existingProduct.IsPublished);
        _productRepositoryMock.Verify(r => r.UpdateAsync(existingProduct, It.IsAny<CancellationToken>()), Times.Once);

        _productRepositoryMock.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task UpdateAsync_WhenProductDoesNotExist_ShouldReturnFalse()
    {
        var productId = Guid.NewGuid();
        var updateDto = new UpdateProductDto("Bosch", "0242236565", "Display number", "Новое имя", 500m, 15, "", true);

        _productRepositoryMock
            .Setup(r => r.GetByIdAsync(productId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Product?)null);

        var result = await _service.UpdateAsync(productId, updateDto);

        Assert.False(result);
        _productRepositoryMock.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    #endregion

    #region ImportFromExcelAsync Tests

    [Fact]
    public async Task ImportFromExcelAsync_WithNewAndExistingProducts_ShouldReturnCorrectCounts()
    {
        using var stream = new MemoryStream([1, 2, 3]);

        var parsedProducts = new List<Product>
        {
            new("Bosch", "0242236565", "Display number", "Свеча 1", 450m, 10),
            new("NGK", "6629", "Display number", "Свеча 2", 300m, 5)
        };

        _excelParserMock
            .Setup(p => p.ParseProductsAsync(stream, It.IsAny<ExcelImportSettings>(), It.IsAny<CancellationToken>()))
            .Returns(Result<IReadOnlyList<Product>>.Success(parsedProducts));

        var existingInDb = new List<Product>
        {
            new("Bosch", "0242236565", "Original display", "Старое имя", 400m, 2)
        };

        _productRepositoryMock
            .Setup(r => r.GetByCompositeKeysAsync(It.IsAny<List<ProductCompositeKey>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(existingInDb);

        var result = await _service.ImportFromExcelAsync(stream, new ExcelImportSettings());

        Assert.True(result.IsSuccess);
        var (insertedCount, updatedCount) = result.Value;
        Assert.Equal("Original display", existingInDb[0].DisplayItemNumber);
        Assert.Equal(450m, existingInDb[0].Price);

        Assert.Equal(1, insertedCount);
        Assert.Equal(1, updatedCount);

        _productRepositoryMock.Verify(r => r.AddRangeAsync(It.Is<IEnumerable<Product>>(list => Enumerable.Count(list) == 1), It.IsAny<CancellationToken>()), Times.Once);
        _productRepositoryMock.Verify(r => r.UpdateRangeAsync(It.Is<IEnumerable<Product>>(list => Enumerable.Count(list) == 1), It.IsAny<CancellationToken>()), Times.Once);
        _productRepositoryMock.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task ImportFromExcelAsync_WhenStreamIsNull_ShouldReturnFailure()
    {
        var result = await _service.ImportFromExcelAsync(null!, new ExcelImportSettings());

        Assert.False(result.IsSuccess);
        Assert.NotEmpty(result.Error!);
        _excelParserMock.VerifyNoOtherCalls();
        _productRepositoryMock.VerifyNoOtherCalls();
    }

    #endregion

    #region DeleteAsync Tests

    [Fact]
    public async Task DeleteAsync_WhenProductExists_ShouldDeleteAndReturnTrue()
    {
        var productId = Guid.NewGuid();
        var existingProduct = new Product(productId, "Bosch", "0242236565", "Display number", "Свеча зажигания", 450m, 10, false);

        _productRepositoryMock
            .Setup(r => r.GetByIdAsync(productId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(existingProduct);

        var result = await _service.DeleteAsync(productId);

        Assert.True(result);
        _productRepositoryMock.Verify(r => r.DeleteAsync(productId, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_WhenProductDoesNotExist_ShouldReturnFalse()
    {
        var productId = Guid.NewGuid();

        _productRepositoryMock
            .Setup(r => r.GetByIdAsync(productId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Product?)null);

        var result = await _service.DeleteAsync(productId);

        Assert.False(result);
        _productRepositoryMock.Verify(r => r.DeleteAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    #endregion

    #region SearchAsync Tests

    [Fact]
    public async Task SearchAsync_WithValidQuery_ShouldReturnPagedResult()
    {
        var query = "Bosch";
        var page = 1;
        var pageSize = 10;

        var items = new List<Product>
        {
            new(Guid.NewGuid(), "Bosch", "0242236565", "Display number", "Свеча 1", 450m, 10, false),
            new(Guid.NewGuid(), "Bosch", "0242236566", "Display number", "Свеча 2", 500m, 5, false)
        };

        var pagedProducts = new PagedResult<Product>(items, 2, page, pageSize);

        _productRepositoryMock
            .Setup(r => r.SearchAsync(query, null, page, pageSize, null, PublicationFilter.OnlyPublished, It.IsAny<CancellationToken>()))
            .ReturnsAsync(pagedProducts);

        var result = await _service.SearchAsync(query, null, page, pageSize);

        Assert.NotNull(result);
        Assert.Equal(2, result.TotalCount);
        Assert.Equal(2, result.Items.Count);
        Assert.Equal("Bosch", result.Items[0].Brand);

        _productRepositoryMock.Verify(r => r.SearchAsync(query, null, page, pageSize, null, PublicationFilter.OnlyPublished, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task SearchAsync_WithInvalidPageNumbers_ShouldNormalizePaginationParams()
    {
        var query = "NGK";
        var invalidPage = -1;
        var invalidPageSize = 0;

        var emptyPagedResult = new PagedResult<Product>([], 0, 1, 20);

        _productRepositoryMock
            .Setup(r => r.SearchAsync(query, null, 1, 20, null, PublicationFilter.OnlyPublished, It.IsAny<CancellationToken>()))
            .ReturnsAsync(emptyPagedResult);

        var result = await _service.SearchAsync(query, null, invalidPage, invalidPageSize);

        Assert.NotNull(result);
        _productRepositoryMock.Verify(r => r.SearchAsync(query, null, 1, 20, null, PublicationFilter.OnlyPublished, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task SearchAsync_WhenNoProductsFound_ShouldReturnEmptyPagedResult()
    {
        var query = "NonExistentBrand";
        var emptyPagedResult = new PagedResult<Product>([], 0, 1, 20);

        _productRepositoryMock
            .Setup(r => r.SearchAsync(query, null, 1, 20, null, PublicationFilter.OnlyPublished, It.IsAny<CancellationToken>()))
            .ReturnsAsync(emptyPagedResult);

        var result = await _service.SearchAsync(query, null);

        Assert.NotNull(result);
        Assert.Empty(result.Items);
        Assert.Equal(0, result.TotalCount);
    }

    #endregion

    [Fact]
    public async Task ImportFromExcelAsync_WhenParserFails_ShouldReturnErrorWithoutSaving()
    {
        using var stream = new MemoryStream([1]);
        var settings = new ExcelImportSettings();
        _excelParserMock.Setup(p => p.ParseProductsAsync(stream, settings, It.IsAny<CancellationToken>()))
            .Returns(Result<IReadOnlyList<Product>>.Failure("Некорректные заголовки"));

        var result = await _service.ImportFromExcelAsync(stream, settings);

        Assert.False(result.IsSuccess);
        Assert.Equal("Некорректные заголовки", result.Error);
        _productRepositoryMock.VerifyNoOtherCalls();
    }

    [Fact]
    public async Task ImportFromExcelAsync_WithEmptyStream_ShouldReturnFailure()
    {
        using var stream = new MemoryStream();
        var result = await _service.ImportFromExcelAsync(stream, new ExcelImportSettings());
        Assert.False(result.IsSuccess);
        _excelParserMock.VerifyNoOtherCalls();
        _productRepositoryMock.VerifyNoOtherCalls();
    }

    [Fact]
    public async Task ImportFromExcelAsync_WithDisabledColumns_ShouldPreserveExistingValues()
    {
        using var stream = new MemoryStream([1]);
        var settings = new ExcelImportSettings
        {
            DisabledColumnsForUpdate = ["НАИМЕНОВАНИЕ", "ЦЕНА", "НАЛИЧИЕ"]
        };
        var existing = new Product("Bosch", "123", "1-23", "Оригинал", 100m, 1);
        var parsed = new Product("BOSCH", "123", "123", "Замена", 200m, 2);
        _excelParserMock.Setup(p => p.ParseProductsAsync(stream, settings, It.IsAny<CancellationToken>()))
            .Returns(Result<IReadOnlyList<Product>>.Success([parsed]));
        _productRepositoryMock.Setup(r => r.GetByCompositeKeysAsync(It.IsAny<List<ProductCompositeKey>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync([existing]);

        var result = await _service.ImportFromExcelAsync(stream, settings);

        Assert.True(result.IsSuccess);
        Assert.Equal((0, 1), result.Value);
        Assert.Equal("Оригинал", existing.Name);
        Assert.Equal(100m, existing.Price);
        Assert.Equal(1, existing.Quantity);
        Assert.Equal("1-23", existing.DisplayItemNumber);
        _productRepositoryMock.Verify(r => r.AddRangeAsync(It.IsAny<IEnumerable<Product>>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task SearchAsync_ShouldCapPageSizeAndForwardFiltersAndCancellation()
    {
        using var cancellation = new CancellationTokenSource();
        var token = cancellation.Token;
        _productRepositoryMock.Setup(r => r.SearchAsync(null, "plugs", 2, 100, true, PublicationFilter.All, token))
            .ReturnsAsync(new PagedResult<Product>([], 125, 2, 100));

        var result = await _service.SearchAsync(null, "plugs", 2, 101, true, PublicationFilter.All, token);

        Assert.Equal(125, result.TotalCount);
        Assert.Equal(2, result.Page);
        Assert.Equal(100, result.PageSize);
        _productRepositoryMock.Verify(r => r.SearchAsync(null, "plugs", 2, 100, true, PublicationFilter.All, token), Times.Once);
    }
}
