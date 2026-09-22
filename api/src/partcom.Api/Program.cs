using partcom.Domain.Entities;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/api/product", () =>
{
    var sampleParts = new List<Product>
    {
        new() { Id = Guid.NewGuid(), Name = "Масляный фильтр", Price = 850.00m },
        new() { Id = Guid.NewGuid(), Name = "Тормозные колодки", Price = 3200.00m }
    };

    return Results.Ok(sampleParts);
})
.WithName("GetCarParts");

app.Run();
