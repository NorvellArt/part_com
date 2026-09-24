namespace partcom.Infrastructure.Repositories;

using System.Collections.Concurrent;
using partcom.Domain.Entities;
using partcom.Domain.Interfaces;

public class InMemoryProductRepository : IProductRepository
{
    private static readonly ConcurrentDictionary<Guid, Product> _store = new();

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