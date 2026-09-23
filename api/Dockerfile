FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["src/partcom.Api/partcom.Api.csproj", "partcom.Api/"]
COPY ["src/partcom.Application/partcom.Application.csproj", "partcom.Application/"]
COPY ["src/partcom.Domain/partcom.Domain.csproj", "partcom.Domain/"]
COPY ["src/partcom.Infrastructure/partcom.Infrastructure.csproj", "partcom.Infrastructure/"]

RUN dotnet restore "partcom.Api/partcom.Api.csproj"

COPY src/ .
WORKDIR "/src/partcom.Api"
RUN dotnet build "partcom.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "partcom.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 5288

USER app

COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "partcom.Api.dll"]