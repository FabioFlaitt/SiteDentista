using BrunaMolina.Domain.Entities;

namespace BrunaMolina.Application.Interfaces;

public interface IAnalyticsRepository
{
    Task AddEventAsync(AnalyticsEvent evt, CancellationToken cancellationToken);
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);

    Task<IReadOnlyList<(DateOnly Date, int Visits, int UniqueVisitors)>> GetTrafficSeriesAsync(
        DateOnly from, DateOnly to, CancellationToken cancellationToken);

    Task<IReadOnlyList<(string City, string Region, string Country, int Visits)>>
        GetLocationBreakdownAsync(DateOnly from, DateOnly to, CancellationToken cancellationToken);

    Task<IReadOnlyList<AnalyticsEvent>> GetWhatsAppClicksAsync(
        DateOnly from, DateOnly to, CancellationToken cancellationToken);
}
