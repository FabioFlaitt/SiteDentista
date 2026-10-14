using BrunaMolina.Application.DTOs;
using BrunaMolina.Application.Validation;
using FluentAssertions;

namespace BrunaMolina.Tests.Unit;

public sealed class AnalyticsEventValidatorTests
{
    [Theory]
    [InlineData("page_view")]
    [InlineData("whatsapp_click")]
    [InlineData("service_inquiry")]
    [InlineData("maps_click")]
    public void Accepts_KnownTypes(string type)
    {
        var request = new AnalyticsEventRequest { Type = type, Path = "/" };
        AnalyticsEventValidator.Validate(request).IsValid.Should().BeTrue();
    }

    [Fact]
    public void Rejects_UnknownType()
    {
        var request = new AnalyticsEventRequest { Type = "injection_attempt", Path = "/" };
        AnalyticsEventValidator.Validate(request).IsValid.Should().BeFalse();
    }

    [Fact]
    public void Rejects_EmptyPath()
    {
        var request = new AnalyticsEventRequest { Type = "page_view", Path = "   " };
        AnalyticsEventValidator.Validate(request).IsValid.Should().BeFalse();
    }

    [Fact]
    public void Rejects_OversizedReferrer()
    {
        var request = new AnalyticsEventRequest
        {
            Type = "page_view",
            Path = "/",
            Referrer = new string('x', 2000),
        };
        AnalyticsEventValidator.Validate(request).IsValid.Should().BeFalse();
    }
}
