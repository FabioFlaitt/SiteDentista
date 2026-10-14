using FluentAssertions;

namespace BrunaMolina.Tests.Integration;

public sealed class HealthEndpointTests : IClassFixture<TestWebApplicationFactory>
{
    private readonly TestWebApplicationFactory _factory;

    public HealthEndpointTests(TestWebApplicationFactory factory) => _factory = factory;

    [Fact]
    public async Task Get_Health_ReturnsOk()
    {
        using var client = _factory.CreateClient();

        var response = await client.GetAsync("/api/health");
        var body = await response.Content.ReadAsStringAsync();

        response.IsSuccessStatusCode.Should().BeTrue();
        body.Should().Contain("\"status\":\"ok\"");
    }
}
