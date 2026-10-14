using BrunaMolina.Application.DTOs;
using BrunaMolina.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BrunaMolina.Api.Controllers;

[ApiController]
[Route("api/admin/analytics")]
[Authorize(Policy = "Admin")]
public sealed class AdminAnalyticsController : ControllerBase
{
    private readonly IAnalyticsService _analytics;

    public AdminAnalyticsController(IAnalyticsService analytics)
    {
        _analytics = analytics;
    }

    [HttpGet("summary")]
    public async Task<ActionResult<object>> Summary(
        [FromQuery] DateOnly from,
        [FromQuery] DateOnly to,
        CancellationToken ct)
    {
        var period = new PeriodQuery(from, to);
        var traffic = await _analytics.GetTrafficSummaryAsync(period, ct);
        var whatsapp = await _analytics.GetWhatsAppClicksAsync(period, ct);
        var locations = await _analytics.GetLocationSummaryAsync(period, ct);
        return Ok(new { traffic, whatsapp, locations });
    }

    [HttpGet("traffic")]
    public async Task<ActionResult<TrafficSummaryDto>> Traffic(
        [FromQuery] DateOnly from,
        [FromQuery] DateOnly to,
        CancellationToken ct) =>
        Ok(await _analytics.GetTrafficSummaryAsync(new PeriodQuery(from, to), ct));

    [HttpGet("locations")]
    public async Task<ActionResult<LocationSummaryDto>> Locations(
        [FromQuery] DateOnly from,
        [FromQuery] DateOnly to,
        CancellationToken ct) =>
        Ok(await _analytics.GetLocationSummaryAsync(new PeriodQuery(from, to), ct));

    [HttpGet("whatsapp-clicks")]
    public async Task<ActionResult<WhatsAppClicksSummaryDto>> WhatsAppClicks(
        [FromQuery] DateOnly from,
        [FromQuery] DateOnly to,
        CancellationToken ct) =>
        Ok(await _analytics.GetWhatsAppClicksAsync(new PeriodQuery(from, to), ct));
}
