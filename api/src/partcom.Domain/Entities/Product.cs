namespace partcom.Domain.Entities;

public class Product
{
    public Guid Id { get; set; }
    public string ItemNumber { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
}