using BrunaMolina.Application.DTOs;
using BrunaMolina.Application.Interfaces;
using BrunaMolina.Application.Validation;
using BrunaMolina.Domain.Entities;

namespace BrunaMolina.Application.Services;

public sealed class AnalyticsService : IAnalyticsService
{
    private readonly IAnalyticsRepository _repository;

    public AnalyticsService(IAnalyticsRepository repository)
    {
        _repository = repository;
    }

    public async Task RecordEventAsync(
        AnalyticsEventRequest request,
        string? country,
        string? region,
        string? city,
        string? userAgentHash,
        CancellationToken cancellationToken)
    {
        var (valid, error) = AnalyticsEventValidator.Validate(request);
        if (!valid)
        {
            throw new ArgumentException(error ?? "Payload inválido.", nameof(request));
        }

        if (!request.TryMapType(out var mapped))
        {
            throw new ArgumentException("Tipo de evento desconhecido.", nameof(request));
        }

        var evt = AnalyticsEvent.Create(
            mapped,
            request.Path,
            request.Referrer,
            request.MapDevice(),
            country,
            region,
            city,
            userAgentHash);

        await _repository.AddEventAsync(evt, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);
    }

    public async Task<TrafficSummaryDto> GetTrafficSummaryAsync(
        PeriodQuery query,
        CancellationToken cancellationToken)
    {
        var series = await _repository.GetTrafficSeriesAsync(query.From, query.To, cancellationToken);
        var totalVisits = series.Sum(p => p.Visits);
        var totalUnique = series.Sum(p => p.UniqueVisitors);
        var points = series
            .Select(p => new TrafficPointDto(p.Date, p.Visits, p.UniqueVisitors))
            .ToList();

        return new TrafficSummaryDto(
            query.From,
            query.To,
            totalVisits,
            totalUnique,
            ComparisonAvailable: false,
            PreviousPeriodVisits: null,
            points,
            IsMock: false);
    }

    public async Task<LocationSummaryDto> GetLocationSummaryAsync(
        PeriodQuery query,
        CancellationToken cancellationToken)
    {
        var entries = await _repository.GetLocationBreakdownAsync(query.From, query.To, cancellationToken);
        var mapped = entries
            .Select(e => new LocationBreakdownDto(e.City, e.Region, e.Country, e.Visits))
            .ToList();
        return new LocationSummaryDto(mapped, IsMock: false);
    }

    public async Task<WhatsAppClicksSummaryDto> GetWhatsAppClicksAsync(
        PeriodQuery query,
        CancellationToken cancellationToken)
    {
        var raw = await _repository.GetWhatsAppClicksAsync(query.From, query.To, cancellationToken);

        var grouped = raw
            .GroupBy(e => new { Date = DateOnly.FromDateTime(e.OccurredAt), e.Path, e.Device })
            .Select(g => new WhatsAppClickEntryDto(
                new DateTime(g.Key.Date.Year, g.Key.Date.Month, g.Key.Date.Day, 0, 0, 0, DateTimeKind.Utc),
                g.Key.Path,
                g.Key.Device.ToString().ToLowerInvariant(),
                g.Count()))
            .OrderBy(e => e.Timestamp)
            .ToList();

        return new WhatsAppClicksSummaryDto(
            query.From,
            query.To,
            raw.Count,
            grouped,
            IsMock: false);
    }
}
