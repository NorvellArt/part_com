using partcom.Application.Common;

namespace partcom.Application.Interfaces;

public interface IFileStorageService
{
    Task<Result<string>> SaveFileAsync(Stream fileStream, string fileName, string subDirectory, CancellationToken cancellationToken = default);
    Result DeleteFile(string? relativePath);
}
