using System.Net;
using System.Net.Http.Json;
using BrunaMolina.Application.DTOs;
using FluentAssertions;

namespace BrunaMolina.Tests.Integration;

public sealed class AdminAuthorizationTests : IClassFixture<TestWebApplicationFactory>
{
    private readonly TestWebApplicationFactory _factory;

    public AdminAuthorizationTests(TestWebApplicationFactory factory) => _factory = factory;

    [Fact]
    public async Task Admin_Endpoint_Returns401_WhenNotAuthenticated()
    {
        using var client = _factory.CreateClient();

        var response = await client.GetAsync("/api/admin/analytics/traffic?from=2026-01-01&to=2026-01-31");

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Login_Returns401_ForUnknownUser()
    {
        using var client = _factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/auth/login", new LoginRequest(
            "nobody@example.com", "wrong-password-12!A"));

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Analytics_Events_Accepts_PublicPayload()
    {
        using var client = _factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/analytics/events", new AnalyticsEventRequest
        {
            Type = "page_view",
            Path = "/sobre",
            Device = "mobile",
        });

        response.StatusCode.Should().Be(HttpStatusCode.Accepted);
    }

    [Fact]
    public async Task Analytics_Events_Rejects_InvalidType()
    {
        using var client = _factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/analytics/events", new AnalyticsEventRequest
        {
            Type = "malicious_payload",
            Path = "/",
        });

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}
