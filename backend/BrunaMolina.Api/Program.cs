using BrunaMolina.Api.Middleware;
using BrunaMolina.Infrastructure;
using BrunaMolina.Infrastructure.Identity;
using BrunaMolina.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// --- Services ---------------------------------------------------------------

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(opts =>
{
    opts.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Bruna Molina API",
        Version = "v1",
        Description = "API do site e painel administrativo da Dra. Bruna Molina.",
    });
});

builder.Services.AddInfrastructure(builder.Configuration);

var allowedOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();

builder.Services.AddCors(opts =>
{
    opts.AddDefaultPolicy(policy =>
    {
        if (allowedOrigins.Length == 0)
        {
            // Fallback intencional: nenhuma origem; força configuração explícita.
            return;
        }
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddAuthentication(options =>
    {
        options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = CookieAuthenticationDefaults.AuthenticationScheme;
        options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    })
    .AddCookie(options =>
    {
        options.Cookie.Name = builder.Configuration["Cookie:Name"] ?? ".BrunaMolina.Auth";
        options.Cookie.HttpOnly = true;
        options.Cookie.SameSite = SameSiteMode.Lax;
        options.Cookie.SecurePolicy = builder.Environment.IsDevelopment()
            ? CookieSecurePolicy.SameAsRequest
            : CookieSecurePolicy.Always;
        options.ExpireTimeSpan = TimeSpan.FromHours(
            builder.Configuration.GetValue("Cookie:SlidingExpirationHours", 2.0));
        options.SlidingExpiration = true;
        options.Events.OnRedirectToLogin = ctx =>
        {
            ctx.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return Task.CompletedTask;
        };
        options.Events.OnRedirectToAccessDenied = ctx =>
        {
            ctx.Response.StatusCode = StatusCodes.Status403Forbidden;
            return Task.CompletedTask;
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Admin", p => p.RequireAuthenticatedUser());
});

builder.Services.AddRateLimiter(opts =>
{
    opts.AddFixedWindowLimiter("public-events", o =>
    {
        o.PermitLimit = 60;
        o.Window = TimeSpan.FromMinutes(1);
        o.QueueLimit = 0;
    });
    opts.AddFixedWindowLimiter("auth", o =>
    {
        o.PermitLimit = 10;
        o.Window = TimeSpan.FromMinutes(1);
        o.QueueLimit = 0;
    });
    opts.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
});

builder.Services.AddProblemDetails();

var app = builder.Build();

// --- Pipeline ---------------------------------------------------------------

app.UseMiddleware<GlobalExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseCors();
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// --- Startup tasks ----------------------------------------------------------

await using (var scope = app.Services.CreateAsyncScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        await db.Database.MigrateAsync();
    }
    catch (Exception ex)
    {
        app.Logger.LogWarning(ex, "Database migration skipped at startup.");
    }

    if (app.Configuration.GetValue("AdminSeed:Enabled", false))
    {
        await SeedAdminAsync(scope.ServiceProvider, app.Configuration);
    }
}

app.Run();

static async Task SeedAdminAsync(IServiceProvider sp, IConfiguration config)
{
    var userManager = sp.GetRequiredService<UserManager<AdminUser>>();
    var email = config["AdminSeed:Email"];
    var password = config["AdminSeed:Password"];
    var displayName = config["AdminSeed:DisplayName"] ?? "Administrador";

    if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
    {
        return;
    }

    var existing = await userManager.FindByEmailAsync(email);
    if (existing is not null)
    {
        return;
    }

    var user = new AdminUser
    {
        Email = email,
        UserName = email,
        DisplayName = displayName,
        EmailConfirmed = true,
    };
    var result = await userManager.CreateAsync(user, password);
    if (!result.Succeeded)
    {
        var errors = string.Join("; ", result.Errors.Select(e => e.Description));
        throw new InvalidOperationException($"Admin seed failed: {errors}");
    }
}

public partial class Program;
