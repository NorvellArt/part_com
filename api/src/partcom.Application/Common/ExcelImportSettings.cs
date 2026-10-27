namespace partcom.Application.Common;

public class ExcelImportSettings
{
    public List<string> ExpectedHeaders { get; set; } =
    [
        "БРЕНД", "НОМЕР", "НАИМЕНОВАНИЕ", "ЦЕНА", "НАЛИЧИЕ"
    ];

    public HashSet<string> DisabledColumnsForUpdate { get; set; } = new(StringComparer.OrdinalIgnoreCase);
}