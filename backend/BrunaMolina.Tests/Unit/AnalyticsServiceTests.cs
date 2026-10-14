using BrunaMolina.Application.DTOs;
using BrunaMolina.Application.Interfaces;
using BrunaMolina.Application.Services;
using BrunaMolina.Domain.Entities;
using FluentAssertions;

namespace BrunaMolina.Tests.Unit;

public sealed class AnalyticsServiceTests
{
    [Fact]
    public async Task RecordEvent_RejectsUnknownType()
    {
        var repo = new FakeRepository();
        var service = new AnalyticsService(repo);
        var request = new AnalyticsEventRequest
        {
            Type = "totally_made_up",
            Path = "/",
        };

        var act = async () => await service.RecordEventAsync(request, null, null, null, null, CancellationToken.None);
        await act.Should().ThrowAsync<ArgumentException>();
        repo.SavedCount.Should().Be(0);
    }

    [Fact]
    public async Task RecordEvent_PersistsValidPayload()
    {
        var repo = new FakeRepository();
        var service = new AnalyticsService(repo);
        var request = new AnalyticsEventRequest
        {
            Type = "whatsapp_click",
            Path = "/contato",
            Device = "mobile",
        };

        await service.RecordEventAsync(request, "BR", "SP", "Araraquara", "hashhash", CancellationToken.None);

        repo.Added.Should().HaveCount(1);
        repo.Added[0].Type.Should().Be(AnalyticsEventType.WhatsAppClick);
        repo.Added[0].City.Should().Be("Araraquara");
        repo.SavedCount.Should().Be(1);
    }

    private sealed class FakeRepository : IAnalyticsRepository
    {
        public List<AnalyticsEvent> Added { get; } = new();
        public int SavedCount { get; private set; }

        public Task AddEventAsync(AnalyticsEvent evt, CancellationToken cancellationToken)
        {
            Added.Add(evt);
            return Task.CompletedTask;
        }

        public Task<int> SaveChangesAsync(CancellationToken cancellationToken)
        {
            SavedCount++;
            return Task.FromResult(Added.Count);
        }

        public Task<IReadOnlyList<(DateOnly Date, int Visits, int UniqueVisitors)>>
            GetTrafficSeriesAsync(DateOnly from, DateOnly to, CancellationToken cancellationToken)
            => Task.FromResult<IReadOnlyList<(DateOnly, int, int)>>(Array.Empty<(DateOnly, int, int)>());

        public Task<IReadOnlyList<(string City, string Region, string Country, int Visits)>>
            GetLocationBreakdownAsync(DateOnly from, DateOnly to, CancellationToken cancellationToken)
            => Task.FromResult<IReadOnlyList<(string, string, string, int)>>(Array.Empty<(string, string, string, int)>());

        public Task<IReadOnlyList<AnalyticsEvent>> GetWhatsAppClicksAsync(
            DateOnly from, DateOnly to, CancellationToken cancellationToken)
            => Task.FromResult<IReadOnlyList<AnalyticsEvent>>(Array.Empty<AnalyticsEvent>());
    }
}
