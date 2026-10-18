namespace partcom.Infrastructure.Persistence;

public class ProductEntity
{
    public Guid Id { get; set; }
    public string Brand { get; set; } = string.Empty;
    public string ItemNumber { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public string? ImageUrl { get; set; }

    public Guid? CategoryId { get; set; }
    public CategoryEntity? Category { get; set; } = null!;
}