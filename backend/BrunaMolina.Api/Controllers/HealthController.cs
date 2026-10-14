using Microsoft.AspNetCore.Mvc;

namespace BrunaMolina.Api.Controllers;

[ApiController]
[Route("api/health")]
public sealed class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok(new
    {
        status = "ok",
        service = "BrunaMolina.Api",
        timestamp = DateTime.UtcNow,
    });
}
