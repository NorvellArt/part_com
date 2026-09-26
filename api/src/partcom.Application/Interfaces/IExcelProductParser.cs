namespace partcom.Application.Interfaces;

using partcom.Domain.Entities;

public interface IExcelProductParser
{
    Task<IReadOnlyList<Product>> ParseProductsAsync(Stream stream, CancellationToken cancellationToken = default);
}