namespace BrunaMolina.Application.DTOs;

public sealed record LoginRequest(string Email, string Password);

public sealed record AdminUserResponse(Guid Id, string Email, string DisplayName);

public sealed record LoginResponse(AdminUserResponse User);

public sealed record PeriodQuery(DateOnly From, DateOnly To);

public sealed record TrafficPointDto(DateOnly Date, int Visits, int UniqueVisitors);

public sealed record TrafficSummaryDto(
    DateOnly RangeStart,
    DateOnly RangeEnd,
    int TotalVisits,
    int TotalUniqueVisitors,
    bool ComparisonAvailable,
    int? PreviousPeriodVisits,
    IReadOnlyList<TrafficPointDto> Series,
    bool IsMock);

public sealed record LocationBreakdownDto(string City, string Region, string Country, int Visits);

public sealed record LocationSummaryDto(IReadOnlyList<LocationBreakdownDto> Entries, bool IsMock);

public sealed record WhatsAppClickEntryDto(
    DateTime Timestamp,
    string Path,
    string Device,
    int Count);

public sealed record WhatsAppClicksSummaryDto(
    DateOnly RangeStart,
    DateOnly RangeEnd,
    int Total,
    IReadOnlyList<WhatsAppClickEntryDto> Entries,
    bool IsMock);
