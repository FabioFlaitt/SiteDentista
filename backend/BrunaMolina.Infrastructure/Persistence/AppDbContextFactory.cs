using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace BrunaMolina.Infrastructure.Persistence;

/// <summary>
/// Design-time factory enabling `dotnet ef` to create a DbContext without running Program.cs.
/// </summary>
public sealed class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var connectionString =
            Environment.GetEnvironmentVariable("ConnectionStrings__Default")
            ?? "Host=localhost;Port=5432;Database=brunamolina;Username=brunamolina;Password=brunamolina";

        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseNpgsql(connectionString, npg => npg.MigrationsAssembly(typeof(AppDbContextFactory).Assembly.FullName))
            .Options;

        return new AppDbContext(options);
    }
}
