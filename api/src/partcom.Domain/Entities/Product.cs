namespace partcom.Domain.Entities;

public class Product
{
    public Guid Id { get; set; }
    public string Brand { get; set; } = string.Empty;
    public string ItemNumber { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Quantity { get; set; }

    public Product(string brand, string itemNumber, string name, decimal price, int quantity)
    {
        Id = Guid.NewGuid();
        Update(brand, itemNumber, name, price, quantity);
    }

    public void Update(string brand, string itemNumber, string name, decimal price, int quantity)
    {
        if (string.IsNullOrWhiteSpace(brand))
            throw new ArgumentException("Бренд не может быть пустым.", nameof(brand));

        if (string.IsNullOrWhiteSpace(itemNumber))
            throw new ArgumentException("Артикул не может быть пустым.", nameof(itemNumber));

        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Наименование не может быть пустым.", nameof(name));

        if (price < 0)
            throw new ArgumentOutOfRangeException(nameof(price), "Цена не может быть отрицательной.");

        if (quantity < 0)
            throw new ArgumentOutOfRangeException(nameof(quantity), "Количество не может быть отрицательным.");

        Brand = brand;
        ItemNumber = itemNumber;
        Name = name;
        Price = price;
        Quantity = quantity;
    }
}