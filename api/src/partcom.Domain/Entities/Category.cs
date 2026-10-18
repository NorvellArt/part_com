namespace partcom.Domain.Entities;

public class Category
{
    public Guid Id { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public string Slug { get; private set; } = string.Empty;
    public Guid? ParentId { get; private set; }
    public int Level { get; private set; }

    public Category? Parent { get; private set; }

    private readonly List<Category> _children = [];
    public IReadOnlyCollection<Category> Children => _children.AsReadOnly();

    private readonly List<Product> _products = [];
    public IReadOnlyCollection<Product> Products => _products.AsReadOnly();

    private Category() { }

    public Category(string name, string slug)
    {
        Id = Guid.NewGuid();
        Update(name, slug);
        ParentId = null;
        Level = 1;
    }

    public Category CreateChild(string name, string slug)
    {
        if (Level >= 3)
        {
            throw new InvalidOperationException($"Невозможно создать подкатегорию. Максимальный уровень вложенности (3) уже достигнут для категории '{Name}'.");
        }

        var child = new Category
        {
            Id = Guid.NewGuid(),
            Name = name.Trim(),
            Slug = slug.Trim().ToLowerInvariant(),
            ParentId = this.Id,
            Parent = this,
            Level = this.Level + 1
        };

        _children.Add(child);
        return child;
    }

    public void Update(string name, string slug)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Имя категории не может быть пустым.", nameof(name));

        if (string.IsNullOrWhiteSpace(slug))
            throw new ArgumentException("Slug категории не может быть пустым.", nameof(slug));

        Name = name.Trim();
        Slug = slug.Trim().ToLowerInvariant();
    }

    public void MoveToParent(Category? newParent)
    {
        if (newParent == null)
        {
            ParentId = null;
            Parent = null;
            UpdateLevelHierarchy(1);
            return;
        }

        if (newParent.Id == this.Id)
        {
            throw new InvalidOperationException("Категория не может быть родителем самой себя.");
        }

        int maxSubTreeDepth = GetMaxSubTreeDepth(this);
        int newLevel = newParent.Level + 1;

        if (newLevel + maxSubTreeDepth - 1 > 3)
        {
            throw new InvalidOperationException("Перемещение невозможно: превышена максимальная глубина дерева (3 уровня).");
        }

        ParentId = newParent.Id;
        Parent = newParent;
        UpdateLevelHierarchy(newLevel);
    }

    public static Category Reconstitute(Guid id, string name, string slug, Guid? parentId, int level)
    {
        return new Category
        {
            Id = id,
            Name = name,
            Slug = slug,
            ParentId = parentId,
            Level = level
        };
    }

    private void UpdateLevelHierarchy(int newLevel)
    {
        Level = newLevel;
        foreach (var child in _children)
        {
            child.UpdateLevelHierarchy(newLevel + 1);
        }
    }

    private int GetMaxSubTreeDepth(Category category)
    {
        if (category.Children.Count == 0) return 1;
        return 1 + category.Children.Max(GetMaxSubTreeDepth);
    }
}
