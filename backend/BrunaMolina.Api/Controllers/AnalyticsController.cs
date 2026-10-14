using System.Security.Cryptography;
using System.Text;
using BrunaMolina.Application.DTOs;
using BrunaMolina.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace BrunaMolina.Api.Controllers;

[ApiController]
[Route("api/analytics")]
[AllowAnonymous]
public sealed class AnalyticsController : ControllerBase
{
    private readonly IAnalyticsService _analytics;

    public AnalyticsController(IAnalyticsService analytics)
    {
        _analytics = analytics;
    }

    /// <summary>
    /// Public endpoint used by the SPA to record page views and conversion events.
    /// Server derives geolocation and user-agent hash; it does NOT trust client-supplied IDs.
    /// </summary>
    [HttpPost("events")]
    [EnableRateLimiting("public-events")]
    public async Task<IActionResult> CreateEvent([FromBody] AnalyticsEventRequest request, CancellationToken ct)
    {
        var country = GetHeaderValue("CF-IPCountry") ?? GetHeaderValue("X-Vercel-IP-Country");
        var region = GetHeaderValue("CF-Region") ?? GetHeaderValue("X-Vercel-IP-Country-Region");
        var city = GetHeaderValue("CF-IPCity") ?? GetHeaderValue("X-Vercel-IP-City");
        var hash = HashUserAgent(Request.Headers.UserAgent.ToString());

        await _analytics.RecordEventAsync(request, country, region, city, hash, ct);
        return Accepted();
    }

    private string? GetHeaderValue(string name) =>
        Request.Headers.TryGetValue(name, out var values) ? values.ToString() : null;

    private static string? HashUserAgent(string? userAgent)
    {
        if (string.IsNullOrEmpty(userAgent))
        {
            return null;
        }
        var bytes = Encoding.UTF8.GetBytes(userAgent);
        var digest = SHA256.HashData(bytes);
        return Convert.ToHexString(digest.AsSpan(0, 16));
    }
}
