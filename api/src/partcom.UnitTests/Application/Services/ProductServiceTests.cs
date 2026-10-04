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
            _excelParserMock.Object);
    }

    #region GetByIdAsync Tests

    [Fact]
    public async Task GetByIdAsync_WhenProductExists_ShouldReturnProductDto()
    {
        var productId = Guid.NewGuid();
        var product = new Product(productId, "Bosch", "0242236565", "Свеча зажигания", 450m, 10);

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
        var product = new CreateProductDto("Bosch", "0242236565", "Свеча зажигания", 450m, 10, "");

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
        var existingProduct = new Product(productId, "Bosch", "0242236565", "Старое имя", 400m, 5);
        var updateDto = new UpdateProductDto("Bosch", "0242236565", "Новое имя", 500m, 15, "");

        _productRepositoryMock
            .Setup(r => r.GetByIdAsync(productId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(existingProduct);

        var result = await _service.UpdateAsync(productId, updateDto);

        Assert.True(result);
        Assert.Equal("Новое имя", existingProduct.Name);
        Assert.Equal(500m, existingProduct.Price);

        _productRepositoryMock.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task UpdateAsync_WhenProductDoesNotExist_ShouldReturnFalse()
    {
        var productId = Guid.NewGuid();
        var updateDto = new UpdateProductDto("Bosch", "0242236565", "Новое имя", 500m, 15, "");

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
            new("Bosch", "0242236565", "Свеча 1", 450m, 10),
            new("NGK", "6629", "Свеча 2", 300m, 5)
        };

        _excelParserMock
            .Setup(p => p.ParseProductsAsync(stream, It.IsAny<CancellationToken>()))
            .ReturnsAsync(parsedProducts);

        var existingInDb = new Dictionary<string, Product>(StringComparer.OrdinalIgnoreCase)
        {
            ["0242236565"] = new Product("Bosch", "0242236565", "Старое имя", 400m, 2)
        };

        _productRepositoryMock
            .Setup(r => r.GetByItemNumbersAsync(It.IsAny<IEnumerable<string>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(existingInDb);

        var (insertedCount, updatedCount) = await _service.ImportFromExcelAsync(stream);

        Assert.Equal(1, insertedCount);
        Assert.Equal(1, updatedCount);

        _productRepositoryMock.Verify(r => r.AddRangeAsync(It.Is<IEnumerable<Product>>(list => Enumerable.Count(list) == 1), It.IsAny<CancellationToken>()), Times.Once);
        _productRepositoryMock.Verify(r => r.UpdateRangeAsync(It.Is<IEnumerable<Product>>(list => Enumerable.Count(list) == 1), It.IsAny<CancellationToken>()), Times.Once);
        _productRepositoryMock.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task ImportFromExcelAsync_WhenStreamIsNull_ShouldThrowArgumentException()
    {
        await Assert.ThrowsAsync<ArgumentException>(() => _service.ImportFromExcelAsync(null!));
    }

    #endregion

    #region DeleteAsync Tests

    [Fact]
    public async Task DeleteAsync_WhenProductExists_ShouldDeleteAndReturnTrue()
    {
        var productId = Guid.NewGuid();
        var existingProduct = new Product(productId, "Bosch", "0242236565", "Свеча зажигания", 450m, 10);

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
            new(Guid.NewGuid(), "Bosch", "0242236565", "Свеча 1", 450m, 10),
            new(Guid.NewGuid(), "Bosch", "0242236566", "Свеча 2", 500m, 5)
        };

        var pagedProducts = new PagedResult<Product>(items, 2, page, pageSize);

        _productRepositoryMock
            .Setup(r => r.SearchAsync(query, page, pageSize, It.IsAny<CancellationToken>()))
            .ReturnsAsync(pagedProducts);

        var result = await _service.SearchAsync(query, page, pageSize);

        Assert.NotNull(result);
        Assert.Equal(2, result.TotalCount);
        Assert.Equal(2, result.Items.Count);
        Assert.Equal("Bosch", result.Items[0].Brand);

        _productRepositoryMock.Verify(r => r.SearchAsync(query, page, pageSize, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task SearchAsync_WithInvalidPageNumbers_ShouldNormalizePaginationParams()
    {
        var query = "NGK";
        var invalidPage = -1;
        var invalidPageSize = 0;

        var emptyPagedResult = new PagedResult<Product>([], 0, 1, 20);

        _productRepositoryMock
            .Setup(r => r.SearchAsync(query, 1, 20, It.IsAny<CancellationToken>()))
            .ReturnsAsync(emptyPagedResult);

        var result = await _service.SearchAsync(query, invalidPage, invalidPageSize);

        Assert.NotNull(result);
        _productRepositoryMock.Verify(r => r.SearchAsync(query, 1, 20, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task SearchAsync_WhenNoProductsFound_ShouldReturnEmptyPagedResult()
    {
        var query = "NonExistentBrand";
        var emptyPagedResult = new PagedResult<Product>([], 0, 1, 20);

        _productRepositoryMock
            .Setup(r => r.SearchAsync(query, 1, 20, It.IsAny<CancellationToken>()))
            .ReturnsAsync(emptyPagedResult);

        var result = await _service.SearchAsync(query);

        Assert.NotNull(result);
        Assert.Empty(result.Items);
        Assert.Equal(0, result.TotalCount);
    }

    #endregion
}