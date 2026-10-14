using BrunaMolina.Application.Interfaces;
using BrunaMolina.Application.Services;
using BrunaMolina.Infrastructure.Identity;
using BrunaMolina.Infrastructure.Persistence;
using BrunaMolina.Infrastructure.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace BrunaMolina.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("Default")
            ?? throw new InvalidOperationException("ConnectionStrings:Default is not set.");

        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(connectionString, npg =>
                npg.MigrationsAssembly(typeof(AppDbContext).Assembly.FullName)));

        services
            .AddIdentityCore<AdminUser>(opts =>
            {
                opts.Password.RequiredLength = 10;
                opts.Password.RequireDigit = true;
                opts.Password.RequireUppercase = true;
                opts.Password.RequireLowercase = true;
                opts.Password.RequireNonAlphanumeric = true;
                opts.Lockout.AllowedForNewUsers = true;
                opts.Lockout.MaxFailedAccessAttempts = 5;
                opts.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
                opts.User.RequireUniqueEmail = true;
            })
            .AddRoles<IdentityRole<Guid>>()
            .AddEntityFrameworkStores<AppDbContext>()
            .AddSignInManager()
            .AddDefaultTokenProviders();

        services.AddScoped<IAnalyticsRepository, AnalyticsRepository>();
        services.AddScoped<IAnalyticsService, AnalyticsService>();

        return services;
    }
}
