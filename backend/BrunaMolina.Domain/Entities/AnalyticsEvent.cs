namespace BrunaMolina.Domain.Entities;

public sealed class AnalyticsEvent
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public AnalyticsEventType Type { get; private set; }
    public string Path { get; private set; } = "/";
    public string? Referrer { get; private set; }
    public DeviceType Device { get; private set; } = DeviceType.Unknown;
    public string? Country { get; private set; }
    public string? Region { get; private set; }
    public string? City { get; private set; }
    public string? UserAgentHash { get; private set; }
    public DateTime OccurredAt { get; private set; } = DateTime.UtcNow;

    private AnalyticsEvent() { }

    public static AnalyticsEvent Create(
        AnalyticsEventType type,
        string path,
        string? referrer,
        DeviceType device,
        string? country,
        string? region,
        string? city,
        string? userAgentHash)
    {
        if (string.IsNullOrWhiteSpace(path))
        {
            path = "/";
        }

        return new AnalyticsEvent
        {
            Type = type,
            Path = path.Length > 256 ? path[..256] : path,
            Referrer = referrer is { Length: > 256 } ? referrer[..256] : referrer,
            Device = device,
            Country = country,
            Region = region,
            City = city,
            UserAgentHash = userAgentHash,
            OccurredAt = DateTime.UtcNow,
        };
    }
}
