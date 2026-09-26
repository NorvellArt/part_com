namespace partcom.Infrastructure.Repositories;

using System.Collections.Concurrent;
using partcom.Domain.Entities;
using partcom.Domain.Interfaces;

public class InMemoryProductRepository : IProductRepository
{
    private static readonly ConcurrentDictionary<Guid, Product> _store = new();

    static InMemoryProductRepository()
    {
        SeedInitialData();
    }

    private static void SeedInitialData()
    {
        var initialProducts = new[]
        {
            new Product("Bosch", "0 986 494 010", "Тормозные колодки передние", 3850m, 14),
            new Product("MANN-FILTER", "HU 711/51 x", "Фильтр масляный", 1120m, 32),
            new Product("NGK", "6640", "Свеча зажигания Iridium IX", 1450m, 48),
            new Product("Sachs", "313 367", "Амортизатор передний газомасляный", 8900m, 6),
            new Product("Contitech", "CT1028K1", "Комплект ремня ГРМ", 7400m, 8)
        };

        foreach (var product in initialProducts)
        {
            _store.TryAdd(product.Id, product);
        }
    }

    public Task<Product?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        _store.TryGetValue(id, out var product);
        return Task.FromResult(product);
    }

    public Task<IReadOnlyList<Product>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        IReadOnlyList<Product> list = [.. _store.Values];
        return Task.FromResult(list);
    }

    public Task AddAsync(Product product, CancellationToken cancellationToken = default)
    {
        _store[product.Id] = product;
        return Task.CompletedTask;
    }

    public Task AddRangeAsync(IEnumerable<Product> products, CancellationToken cancellationToken = default)
    {
        foreach (var product in products)
        {
            _store[product.Id] = product;
        }
        return Task.CompletedTask;
    }


    public Task UpdateAsync(Product product, CancellationToken cancellationToken = default)
    {
        _store[product.Id] = product;
        return Task.CompletedTask;
    }

    public Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        _store.TryRemove(id, out _);
        return Task.CompletedTask;
    }
}