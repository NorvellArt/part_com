using partcom.Domain.Entities;

namespace partcom.UnitTests.Domain.Entities;

public class ProductTests
{
    #region Constructor Tests

    [Fact]
    public void Constructor_WithoutId_ShouldGenerateNewGuidAndSetProperties()
    {
        var product = new Product("Bosch", "0242236565", "0 242 236 565", "Свеча зажигания", 450.00m, 10);

        Assert.NotEqual(Guid.Empty, product.Id);
        Assert.Equal("Bosch", product.Brand);
        Assert.Equal("0242236565", product.ItemNumber);
        Assert.Equal("Свеча зажигания", product.Name);
        Assert.Equal(450.00m, product.Price);
        Assert.Equal(10, product.Quantity);
        Assert.Equal("0 242 236 565", product.DisplayItemNumber);
        Assert.False(product.IsPublished);
    }

    [Fact]
    public void Constructor_WithExplicitId_ShouldKeepProvidedId()
    {
        var expectedId = Guid.NewGuid();

        var product = new Product(expectedId, "Bosch", "0242236565", "0 242 236 565", "Свеча зажигания", 450.00m, 10, true);

        Assert.True(product.IsPublished);
        Assert.Equal(expectedId, product.Id);
    }

    #endregion

    #region Happy Path Tests

    [Fact]
    public void Update_WithValidData_ShouldUpdateAllProperties()
    {
        var product = new Product("Bosch", "0242236565", "0 242 236 565", "Свеча зажигания", 450.00m, 10);

        product.Update("BOSCH", "0242236565-UPDATED", "UPDATED", "Свеча PLATINUM", 520.00m, 15);

        Assert.Equal("BOSCH", product.Brand);
        Assert.Equal("0242236565-UPDATED", product.ItemNumber);
        Assert.Equal("Свеча PLATINUM", product.Name);
        Assert.Equal(520.00m, product.Price);
        Assert.Equal(15, product.Quantity);
        Assert.Equal("UPDATED", product.DisplayItemNumber);
    }

    [Fact]
    public void Update_WithZeroPriceAndQuantity_ShouldSucceed()
    {
        var product = new Product("Bosch", "0242236565", "0 242 236 565", "Свеча зажигания", 450.00m, 10);

        product.Update("Bosch", "0242236565", "0 242 236 565", "Свеча зажигания", 0m, 0);

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
        var product = new Product("Bosch", "0242236565", "0 242 236 565", "Свеча зажигания", 450.00m, 10);

        var exception = Assert.Throws<ArgumentException>(() =>
            product.Update(invalidBrand!, "0242236565", "0 242 236 565", "Свеча зажигания", 450.00m, 10));

        Assert.Equal("brand", exception.ParamName);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void Update_WithInvalidItemNumber_ShouldThrowArgumentException(string? invalidItemNumber)
    {
        var product = new Product("Bosch", "0242236565", "0 242 236 565", "Свеча зажигания", 450.00m, 10);

        var exception = Assert.Throws<ArgumentException>(() =>
            product.Update("Bosch", invalidItemNumber!, "0 242 236 565", "Свеча зажигания", 450.00m, 10));

        Assert.Equal("itemNumber", exception.ParamName);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void Update_WithInvalidName_ShouldThrowArgumentException(string? invalidName)
    {
        var product = new Product("Bosch", "0242236565", "0 242 236 565", "Свеча зажигания", 450.00m, 10);

        var exception = Assert.Throws<ArgumentException>(() =>
            product.Update("Bosch", "0242236565", "0 242 236 565", invalidName!, 450.00m, 10));

        Assert.Equal("name", exception.ParamName);
    }

    [Theory]
    [InlineData(-0.01)]
    [InlineData(-100)]
    public void Update_WithNegativePrice_ShouldThrowArgumentOutOfRangeException(decimal invalidPrice)
    {
        var product = new Product("Bosch", "0242236565", "0 242 236 565", "Свеча зажигания", 450.00m, 10);

        var exception = Assert.Throws<ArgumentOutOfRangeException>(() =>
            product.Update("Bosch", "0242236565", "0 242 236 565", "Свеча зажигания", invalidPrice, 10));

        Assert.Equal("price", exception.ParamName);
    }

    [Theory]
    [InlineData(-1)]
    [InlineData(-50)]
    public void Update_WithNegativeQuantity_ShouldThrowArgumentOutOfRangeException(int invalidQuantity)
    {
        var product = new Product("Bosch", "0242236565", "0 242 236 565", "Свеча зажигания", 450.00m, 10);

        var exception = Assert.Throws<ArgumentOutOfRangeException>(() =>
            product.Update("Bosch", "0242236565", "0 242 236 565", "Свеча зажигания", 450.00m, invalidQuantity));

        Assert.Equal("quantity", exception.ParamName);
    }

    #endregion

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void Update_WithInvalidDisplayItemNumber_ShouldThrow(string? displayItemNumber)
    {
        var product = CreateProduct();

        var exception = Assert.Throws<ArgumentException>(() =>
            product.Update("Bosch", "123", displayItemNumber!, "Свеча", 100m, 1));

        Assert.Equal("displayItemNumber", exception.ParamName);
    }

    [Fact]
    public void PublishAndUnpublish_ShouldChangePublicationStatus()
    {
        var product = CreateProduct();
        product.Publish();
        Assert.True(product.IsPublished);
        product.Unpublish();
        Assert.False(product.IsPublished);
    }

    [Fact]
    public void Update_ShouldPreserveImageAndCategory()
    {
        var product = CreateProduct();
        var category = new Category("Запчасти", "parts")
            .CreateChild("Двигатель", "engine").CreateChild("Свечи", "plugs");
        product.AssignCategory(category);
        product.ChangeImage("images/products/image.jpg");

        product.Update("NGK", "456", "4-56", "Новая свеча", 200m, 2);

        Assert.Equal("images/products/image.jpg", product.ImageUrl);
        Assert.Same(category, product.Category);
        Assert.Equal(category.Id, product.CategoryId);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void ChangeImage_WithInvalidPath_ShouldThrow(string? path)
    {
        var exception = Assert.Throws<ArgumentException>(() => CreateProduct().ChangeImage(path!));
        Assert.Equal("imageUrl", exception.ParamName);
    }

    [Fact]
    public void RemoveImage_ShouldClearImage()
    {
        var product = CreateProduct();
        product.ChangeImage("images/products/image.jpg");
        product.RemoveImage();
        Assert.Null(product.ImageUrl);
    }

    [Fact]
    public void AssignCategory_WithRootCategory_ShouldThrow()
    {
        var product = CreateProduct();
        Assert.Throws<InvalidOperationException>(() => product.AssignCategory(new Category("Запчасти", "parts")));
        Assert.Null(product.CategoryId);
    }

    [Fact]
    public void AssignCategory_WithNull_ShouldClearCategory()
    {
        var product = CreateProduct();
        product.AssignCategory(new Category("Запчасти", "parts")
            .CreateChild("Двигатель", "engine").CreateChild("Свечи", "plugs"));
        product.AssignCategory(null);
        Assert.Null(product.Category);
        Assert.Null(product.CategoryId);
    }

    private static Product CreateProduct() => new("Bosch", "123", "1-23", "Свеча", 100m, 1);
}
