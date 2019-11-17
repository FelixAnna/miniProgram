FROM mcr.microsoft.com/dotnet/core/aspnet:3.0-buster-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/core/sdk:3.0-buster AS build
WORKDIR /src
COPY ["BookingOffline.Web/BookingOffline.Web.csproj", "BookingOffline.Web/"]
RUN dotnet restore "BookingOffline.Web/BookingOffline.Web.csproj"
COPY . .
WORKDIR "/src/BookingOffline.Web"
RUN dotnet build "BookingOffline.Web.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "BookingOffline.Web.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "BookingOffline.Web.dll"]