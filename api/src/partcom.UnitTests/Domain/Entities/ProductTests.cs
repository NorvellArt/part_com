using partcom.Domain.Entities;

namespace partcom.UnitTests.Domain.Entities;

public class ProductTests
{
    #region Constructor Tests

    [Fact]
    public void Constructor_WithoutId_ShouldGenerateNewGuidAndSetProperties()
    {
        var product = new Product("Bosch", "0242236565", "Свеча зажигания", 450.00m, 10, "https://example.com/img.jpg");

        Assert.NotEqual(Guid.Empty, product.Id);
        Assert.Equal("Bosch", product.Brand);
        Assert.Equal("0242236565", product.ItemNumber);
        Assert.Equal("Свеча зажигания", product.Name);
        Assert.Equal(450.00m, product.Price);
        Assert.Equal(10, product.Quantity);
        Assert.Equal("https://example.com/img.jpg", product.ImageUrl);
    }

    [Fact]
    public void Constructor_WithExplicitId_ShouldKeepProvidedId()
    {
        var expectedId = Guid.NewGuid();

        var product = new Product(expectedId, "Bosch", "0242236565", "Свеча зажигания", 450.00m, 10);

        Assert.Equal(expectedId, product.Id);
    }

    #endregion

    #region Happy Path Tests

    [Fact]
    public void Update_WithValidData_ShouldUpdateAllProperties()
    {
        var product = new Product("Bosch", "0242236565", "Свеча зажигания", 450.00m, 10);

        product.Update("BOSCH", "0242236565-UPDATED", "Свеча PLATINUM", 520.00m, 15, "https://example.com/new.jpg");

        Assert.Equal("BOSCH", product.Brand);
        Assert.Equal("0242236565-UPDATED", product.ItemNumber);
        Assert.Equal("Свеча PLATINUM", product.Name);
        Assert.Equal(520.00m, product.Price);
        Assert.Equal(15, product.Quantity);
        Assert.Equal("https://example.com/new.jpg", product.ImageUrl);
    }

    [Fact]
    public void Update_WithZeroPriceAndQuantity_ShouldSucceed()
    {
        var product = new Product("Bosch", "0242236565", "Свеча зажигания", 450.00m, 10);

        product.Update("Bosch", "0242236565", "Свеча зажигания", 0m, 0);

        Assert.Equal(0m, product.Price);
        Assert.Equal(0, product.Quantity);
    }

    #endregion

    #region Validation Failure Tests

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void Update_WithInvalidBrand_ShouldThrowArgumentException(string? invalidBrand)
    {
        var product = new Product("Bosch", "0242236565", "Свеча зажигания", 450.00m, 10);

        var exception = Assert.Throws<ArgumentException>(() =>
            product.Update(invalidBrand!, "0242236565", "Свеча зажигания", 450.00m, 10));

        Assert.Equal("brand", exception.ParamName);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void Update_WithInvalidItemNumber_ShouldThrowArgumentException(string? invalidItemNumber)
    {
        var product = new Product("Bosch", "0242236565", "Свеча зажигания", 450.00m, 10);

        var exception = Assert.Throws<ArgumentException>(() =>
            product.Update("Bosch", invalidItemNumber!, "Свеча зажигания", 450.00m, 10));

        Assert.Equal("itemNumber", exception.ParamName);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void Update_WithInvalidName_ShouldThrowArgumentException(string? invalidName)
    {
        var product = new Product("Bosch", "0242236565", "Свеча зажигания", 450.00m, 10);

        var exception = Assert.Throws<ArgumentException>(() =>
            product.Update("Bosch", "0242236565", invalidName!, 450.00m, 10));

        Assert.Equal("name", exception.ParamName);
    }

    [Theory]
    [InlineData(-0.01)]
    [InlineData(-100)]
    public void Update_WithNegativePrice_ShouldThrowArgumentOutOfRangeException(decimal invalidPrice)
    {
        var product = new Product("Bosch", "0242236565", "Свеча зажигания", 450.00m, 10);

        var exception = Assert.Throws<ArgumentOutOfRangeException>(() =>
            product.Update("Bosch", "0242236565", "Свеча зажигания", invalidPrice, 10));

        Assert.Equal("price", exception.ParamName);
    }

    [Theory]
    [InlineData(-1)]
    [InlineData(-50)]
    public void Update_WithNegativeQuantity_ShouldThrowArgumentOutOfRangeException(int invalidQuantity)
    {
        var product = new Product("Bosch", "0242236565", "Свеча зажигания", 450.00m, 10);

        var exception = Assert.Throws<ArgumentOutOfRangeException>(() =>
            product.Update("Bosch", "0242236565", "Свеча зажигания", 450.00m, invalidQuantity));

        Assert.Equal("quantity", exception.ParamName);
    }

    #endregion
}