using System.Text.Json;

namespace BrunaMolina.Api.Middleware;

public sealed class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ArgumentException ex)
        {
            _logger.LogInformation(ex, "Validation error on {Path}", context.Request.Path);
            await WriteProblem(context, StatusCodes.Status400BadRequest, "Dados inválidos", ex.Message);
        }
        catch (UnauthorizedAccessException)
        {
            await WriteProblem(context, StatusCodes.Status401Unauthorized, "Não autenticado", null);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception on {Path}", context.Request.Path);
            await WriteProblem(context, StatusCodes.Status500InternalServerError,
                "Erro interno", "Ocorreu um erro inesperado.");
        }
    }

    private static async Task WriteProblem(HttpContext context, int status, string title, string? detail)
    {
        if (context.Response.HasStarted)
        {
            return;
        }

        context.Response.StatusCode = status;
        context.Response.ContentType = "application/problem+json";
        var problem = new
        {
            type = $"https://httpstatuses.com/{status}",
            title,
            status,
            detail,
        };
        await context.Response.WriteAsync(JsonSerializer.Serialize(problem));
    }
}
