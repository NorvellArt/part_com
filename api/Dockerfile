FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /build

COPY ["src/partcom.Api/partcom.Api.csproj", "src/partcom.Api/"]
COPY ["src/partcom.Application/partcom.Application.csproj", "src/partcom.Application/"]
COPY ["src/partcom.Domain/partcom.Domain.csproj", "src/partcom.Domain/"]
COPY ["src/partcom.Infrastructure/partcom.Infrastructure.csproj", "src/partcom.Infrastructure/"]

RUN dotnet restore "src/partcom.Api/partcom.Api.csproj"

COPY src/ src/

WORKDIR "/build/src/partcom.Api"
RUN dotnet build "partcom.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "partcom.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

EXPOSE 5286

COPY --from=publish --chown=app:app /app/publish .

USER root
RUN mkdir -p /app/wwwroot && chown -R app:app /app/wwwroot

USER app

COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "partcom.Api.dll"]
