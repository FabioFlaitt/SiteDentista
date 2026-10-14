using BrunaMolina.Application.DTOs;
using BrunaMolina.Domain.Entities;

namespace BrunaMolina.Application.Interfaces;

public interface IAnalyticsService
{
    Task RecordEventAsync(
        AnalyticsEventRequest request,
        string? country,
        string? region,
        string? city,
        string? userAgentHash,
        CancellationToken cancellationToken);

    Task<TrafficSummaryDto> GetTrafficSummaryAsync(PeriodQuery query, CancellationToken cancellationToken);
    Task<LocationSummaryDto> GetLocationSummaryAsync(PeriodQuery query, CancellationToken cancellationToken);
    Task<WhatsAppClicksSummaryDto> GetWhatsAppClicksAsync(PeriodQuery query, CancellationToken cancellationToken);
}
