namespace partcom.Infrastructure.Persistence;

public class CategoryEntity
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public Guid? ParentId { get; set; }
    public int Level { get; set; }

    public CategoryEntity? Parent { get; set; }
    public ICollection<CategoryEntity> Children { get; set; } = [];
    public ICollection<ProductEntity> Products { get; set; } = [];
}