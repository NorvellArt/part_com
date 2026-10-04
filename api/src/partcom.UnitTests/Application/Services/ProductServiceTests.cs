using Moq;
using partcom.Application.Interfaces;
using partcom.Application.Services;
using partcom.Domain.Interfaces;
using Xunit;

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
}