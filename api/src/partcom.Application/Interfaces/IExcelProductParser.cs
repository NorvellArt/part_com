namespace partcom.Application.Interfaces;

using partcom.Application.Common;
using partcom.Domain.Entities;

public interface IExcelProductParser
{
    Result<IReadOnlyList<Product>> ParseProductsAsync(
        Stream stream,
        ExcelImportSettings settings,
        CancellationToken cancellationToken = default);
}