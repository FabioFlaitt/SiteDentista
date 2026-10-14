using BrunaMolina.Domain.Entities;

namespace BrunaMolina.Application.DTOs;

/// <summary>
/// Payload sent by the public SPA when a tracked event happens.
/// </summary>
public sealed record AnalyticsEventRequest
{
    public required string Type { get; init; }
    public required string Path { get; init; }
    public string? Referrer { get; init; }
    public string? Device { get; init; }

    public bool TryMapType(out AnalyticsEventType mapped)
    {
        mapped = AnalyticsEventType.PageView;
        return Type switch
        {
            "whatsapp_click" => Set(ref mapped, AnalyticsEventType.WhatsAppClick),
            "page_view" => Set(ref mapped, AnalyticsEventType.PageView),
            "service_inquiry" => Set(ref mapped, AnalyticsEventType.ServiceInquiry),
            "maps_click" => Set(ref mapped, AnalyticsEventType.MapsClick),
            _ => false,
        };

        static bool Set(ref AnalyticsEventType target, AnalyticsEventType value)
        {
            target = value;
            return true;
        }
    }

    public DeviceType MapDevice() => Device switch
    {
        "mobile" => DeviceType.Mobile,
        "tablet" => DeviceType.Tablet,
        "desktop" => DeviceType.Desktop,
        _ => DeviceType.Unknown,
    };
}
