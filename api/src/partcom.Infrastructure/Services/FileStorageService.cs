using Microsoft.AspNetCore.Hosting;
using partcom.Application.Common;
using partcom.Application.Interfaces;

namespace partcom.Infrastructure.Services;

public class FileStorageService(IWebHostEnvironment env) : IFileStorageService
{
    private readonly IWebHostEnvironment _env = env;
    private readonly string[] _allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

    public async Task<Result<string>> SaveFileAsync(Stream fileStream, string fileName, string subDirectory, CancellationToken cancellationToken = default)
    {
        if (fileStream == null || fileStream.Length == 0)
            return Result<string>.Failure("Файл пуст или отсутствует.");

        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        if (!_allowedExtensions.Contains(extension))
            return Result<string>.Failure($"Недопустимый формат файла. Разрешены только: {string.Join(", ", _allowedExtensions)}");

        try
        {
            var targetFolder = Path.Combine(_env.WebRootPath, subDirectory);
            if (!Directory.Exists(targetFolder))
            {
                Directory.CreateDirectory(targetFolder);
            }

            var uniqueFileName = $"{Guid.NewGuid()}{extension}";
            var fullPath = Path.Combine(targetFolder, uniqueFileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await fileStream.CopyToAsync(stream, cancellationToken);
            }

            var relativePath = $"/{subDirectory.Replace('\\', '/')}/{uniqueFileName}";

            return Result<string>.Success(relativePath);
        }
        catch (Exception ex)
        {
            return Result<string>.Failure($"Ошибка при сохранении файла на диск: {ex.Message}");
        }
    }

    public Result DeleteFile(string? relativePath)
    {
        if (string.IsNullOrWhiteSpace(relativePath))
            return Result.Success();

        try
        {
            var cleanPath = relativePath.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
            var fullPath = Path.Combine(_env.WebRootPath, cleanPath);

            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
            }

            return Result.Success();
        }
        catch (Exception ex)
        {
            return Result.Failure($"Ошибка при удалении файла с диска: {ex.Message}");
        }
    }
}
