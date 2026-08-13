# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["SMS.sln", "./"]
COPY ["Domain/Domain.csproj", "Domain/"]
COPY ["Application/Application.csproj", "Application/"]
COPY ["Persistence/Persistence.csproj", "Persistence/"]
COPY ["Infrastructure/Infrastructure.csproj", "Infrastructure/"]
COPY ["WebAPI/WebAPI.csproj", "WebAPI/"]

RUN dotnet restore "SMS.sln"

COPY . .
WORKDIR "/src/WebAPI"
RUN dotnet publish -c Release -o /app/publish

# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "WebAPI.dll"]