namespace partcom.Infrastructure.Services;

using System.Globalization;
using ExcelDataReader;
using partcom.Application.Common;
using partcom.Application.Interfaces;
using partcom.Domain.Entities;

public class ExcelProductParser : IExcelProductParser
{
    public Result<IReadOnlyList<Product>> ParseProductsAsync(
        Stream stream,
        ExcelImportSettings settings,
        CancellationToken cancellationToken = default)
    {
        System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);

        var products = new List<Product>();

        using var reader = ExcelReaderFactory.CreateReader(stream);

        bool isHeaderSkipped = false;

        while (reader.Read())
        {
            cancellationToken.ThrowIfCancellationRequested();

            if (!isHeaderSkipped)
            {
                var actualHeaders = new List<string>();

                int fieldCount = reader.FieldCount;

                for (int i = 0; i < settings.ExpectedHeaders.Count; i++)
                {
                    string header = i < fieldCount
                        ? (reader.GetValue(i)?.ToString()?.Trim() ?? string.Empty)
                        : string.Empty;

                    actualHeaders.Add(header);
                }

                for (int i = 0; i < settings.ExpectedHeaders.Count; i++)
                {
                    if (!string.Equals(actualHeaders[i], settings.ExpectedHeaders[i], StringComparison.OrdinalIgnoreCase))
                    {
                        string foundColumn = string.IsNullOrEmpty(actualHeaders[i]) ? "[отсутствует]" : $"'{actualHeaders[i]}'";

                        return Result<IReadOnlyList<Product>>.Failure(
                            $"Неверная структура файла. Ожидалась колонка '{settings.ExpectedHeaders[i]}' на позиции {i + 1}, но обнаружена {foundColumn}.");
                    }
                }

                isHeaderSkipped = true;
                continue;
            }

            if (reader.GetValue(0) == null && reader.GetValue(1) == null)
                continue;

            string brand = reader.GetValue(0)?.ToString()?.Trim() ?? string.Empty;
            string itemNumber = reader.GetValue(1)?.ToString()?.Trim() ?? string.Empty;
            string name = reader.GetValue(2)?.ToString()?.Trim() ?? string.Empty;

            decimal price = ConvertToDecimal(reader.GetValue(3));
            int quantity = ConvertToInt(reader.GetValue(4));

            var product = new Product(
                brand: brand,
                itemNumber: itemNumber,
                displayItemNumber: itemNumber,
                name: name,
                price: price,
                quantity: quantity);
                
            products.Add(product);
        }

        return Result<IReadOnlyList<Product>>.Success(products);
    }

    private static decimal ConvertToDecimal(object? value)
    {
        if (value is null) return 0m;
        if (value is double d) return Convert.ToDecimal(d);
        if (value is decimal dec) return dec;

        var strValue = value.ToString()?.Trim();
        if (string.IsNullOrWhiteSpace(strValue)) return 0m;

        strValue = strValue.Replace(" ", "").Replace("\u00A0", "").Replace(',', '.');

        if (decimal.TryParse(strValue, NumberStyles.Any, CultureInfo.InvariantCulture, out var parsed))
            return parsed;

        return 0m;
    }

    private static int ConvertToInt(object? value)
    {
        if (value is null) return 0;
        if (value is double d) return Convert.ToInt32(d);
        if (value is int i) return i;

        if (int.TryParse(value.ToString(), out var parsed))
            return parsed;

        return 0;
    }
}
