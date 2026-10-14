using BrunaMolina.Application.Interfaces;
using BrunaMolina.Domain.Entities;
using BrunaMolina.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace BrunaMolina.Infrastructure.Repositories;

public sealed class AnalyticsRepository : IAnalyticsRepository
{
    private readonly AppDbContext _db;

    public AnalyticsRepository(AppDbContext db) => _db = db;

    public async Task AddEventAsync(AnalyticsEvent evt, CancellationToken cancellationToken)
    {
        await _db.AnalyticsEvents.AddAsync(evt, cancellationToken);
    }

    public Task<int> SaveChangesAsync(CancellationToken cancellationToken) =>
        _db.SaveChangesAsync(cancellationToken);

    public async Task<IReadOnlyList<(DateOnly Date, int Visits, int UniqueVisitors)>>
        GetTrafficSeriesAsync(DateOnly from, DateOnly to, CancellationToken cancellationToken)
    {
        var fromUtc = from.ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
        var toUtc = to.ToDateTime(TimeOnly.MaxValue, DateTimeKind.Utc);

        var rows = await _db.AnalyticsEvents
            .Where(e => e.Type == AnalyticsEventType.PageView
                        && e.OccurredAt >= fromUtc && e.OccurredAt <= toUtc)
            .GroupBy(e => new { e.OccurredAt.Date, e.UserAgentHash })
            .Select(g => new { g.Key.Date, Count = g.Count(), Visitor = g.Key.UserAgentHash })
            .ToListAsync(cancellationToken);

        return rows
            .GroupBy(r => r.Date)
            .OrderBy(g => g.Key)
            .Select(g => (
                Date: DateOnly.FromDateTime(g.Key),
                Visits: g.Sum(x => x.Count),
                UniqueVisitors: g.Select(x => x.Visitor).Distinct().Count()))
            .ToList();
    }

    public async Task<IReadOnlyList<(string City, string Region, string Country, int Visits)>>
        GetLocationBreakdownAsync(DateOnly from, DateOnly to, CancellationToken cancellationToken)
    {
        var fromUtc = from.ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
        var toUtc = to.ToDateTime(TimeOnly.MaxValue, DateTimeKind.Utc);

        var rows = await _db.AnalyticsEvents
            .Where(e => e.OccurredAt >= fromUtc && e.OccurredAt <= toUtc
                        && e.City != null && e.Region != null && e.Country != null)
            .GroupBy(e => new { City = e.City!, Region = e.Region!, Country = e.Country! })
            .Select(g => new { g.Key.City, g.Key.Region, g.Key.Country, Visits = g.Count() })
            .OrderByDescending(x => x.Visits)
            .Take(50)
            .ToListAsync(cancellationToken);

        return rows.Select(r => (r.City, r.Region, r.Country, r.Visits)).ToList();
    }

    public async Task<IReadOnlyList<AnalyticsEvent>> GetWhatsAppClicksAsync(
        DateOnly from, DateOnly to, CancellationToken cancellationToken)
    {
        var fromUtc = from.ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
        var toUtc = to.ToDateTime(TimeOnly.MaxValue, DateTimeKind.Utc);

        return await _db.AnalyticsEvents
            .Where(e => e.Type == AnalyticsEventType.WhatsAppClick
                        && e.OccurredAt >= fromUtc && e.OccurredAt <= toUtc)
            .OrderBy(e => e.OccurredAt)
            .ToListAsync(cancellationToken);
    }
}
