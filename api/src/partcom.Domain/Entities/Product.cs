namespace partcom.Domain.Entities;

public class Product
{
    public Guid Id { get; set; }
    public string Brand { get; set; } = string.Empty;
    public string ItemNumber { get; set; } = string.Empty;
    public string DisplayItemNumber { get; set; } = string.Empty;
    public bool IsPublished { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public string? ImageUrl { get; private set; }

    public Guid? CategoryId { get; private set; }
    public Category? Category { get; private set; } = null!;

    private Product() { }

    public Product(
        string brand,
        string itemNumber,
        string displayItemNumber,
        string name,
        decimal price,
        int quantity,
        string? imageUrl = null)
    {
        Id = Guid.NewGuid();
        IsPublished = false;
        Update(brand, itemNumber, displayItemNumber, name, price, quantity, imageUrl);
    }

    public Product(
        Guid id,
        string brand,
        string itemNumber,
        string displayItemNumber,
        string name,
        decimal price,
        int quantity,
        bool isPublished,
        string? imageUrl = null)
    {
        Id = id;
        IsPublished = isPublished;
        Update(brand, itemNumber, displayItemNumber, name, price, quantity, imageUrl);
    }

    public void Update(
        string brand,
        string itemNumber,
        string displayItemNumber,
        string name,
        decimal price,
        int quantity,
        string? imageUrl = null)
    {
        if (string.IsNullOrWhiteSpace(brand))
            throw new ArgumentException("Бренд не может быть пустым.", nameof(brand));

        if (string.IsNullOrWhiteSpace(itemNumber))
            throw new ArgumentException("Внутренний артикул не может быть пустым.", nameof(itemNumber));

        if (string.IsNullOrWhiteSpace(displayItemNumber))
            throw new ArgumentException("Отображаемый артикул не может быть пустым.", nameof(displayItemNumber));

        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Наименование не может быть пустым.", nameof(name));

        if (price < 0)
            throw new ArgumentOutOfRangeException(nameof(price), "Цена не может быть отрицательной.");

        if (quantity < 0)
            throw new ArgumentOutOfRangeException(nameof(quantity), "Количество не может быть отрицательным.");

        Brand = brand;
        ItemNumber = itemNumber;
        DisplayItemNumber = displayItemNumber;
        Name = name;
        Price = price;
        Quantity = quantity;
    }

    public void Publish() => IsPublished = true;
    public void Unpublish() => IsPublished = false;

    public void ChangeImage(string imageUrl)
    {
        if (string.IsNullOrWhiteSpace(imageUrl))
            throw new ArgumentException("Путь к изображению не может быть пустым.", nameof(imageUrl));

        ImageUrl = imageUrl;
    }

    public void RemoveImage()
    {
        ImageUrl = null;
    }

    public void AssignCategory(Category? category)
    {
        if (category == null)
        {
            Category = null;
            CategoryId = null;
            return;
        }

        if (category.Level != 3)
        {
            throw new InvalidOperationException($"Товар можно привязать только к категории 3-го уровня. Выбранная категория '{category.Name}' имеет уровень {category.Level}.");
        }

        Category = category;
        CategoryId = category.Id;
    }
}
