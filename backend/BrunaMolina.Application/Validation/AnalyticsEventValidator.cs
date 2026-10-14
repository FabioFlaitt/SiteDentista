using BrunaMolina.Application.DTOs;

namespace BrunaMolina.Application.Validation;

public static class AnalyticsEventValidator
{
    private static readonly HashSet<string> AllowedTypes = new(StringComparer.Ordinal)
    {
        "page_view",
        "whatsapp_click",
        "service_inquiry",
        "maps_click",
    };

    public static (bool IsValid, string? Error) Validate(AnalyticsEventRequest request)
    {
        if (request is null)
        {
            return (false, "Payload ausente.");
        }
        if (string.IsNullOrWhiteSpace(request.Type) || !AllowedTypes.Contains(request.Type))
        {
            return (false, "Tipo de evento não suportado.");
        }
        if (string.IsNullOrWhiteSpace(request.Path) || request.Path.Length > 512)
        {
            return (false, "Path inválido.");
        }
        if (request.Referrer is { Length: > 1024 })
        {
            return (false, "Referrer excede o tamanho permitido.");
        }
        return (true, null);
    }
}
