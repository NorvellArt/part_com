using partcom.Api.Endpoints;
using partcom.Application;
using partcom.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplication();
builder.Services.AddInfrastructure();

var app = builder.Build();

app.MapProductEndpoints();

app.Run();
