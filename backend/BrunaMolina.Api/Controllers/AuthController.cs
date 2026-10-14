using System.Security.Claims;
using BrunaMolina.Application.DTOs;
using BrunaMolina.Infrastructure.Identity;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace BrunaMolina.Api.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController : ControllerBase
{
    private readonly UserManager<AdminUser> _userManager;
    private readonly SignInManager<AdminUser> _signInManager;

    public AuthController(UserManager<AdminUser> userManager, SignInManager<AdminUser> signInManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
    }

    [HttpPost("login")]
    [EnableRateLimiting("auth")]
    [AllowAnonymous]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { message = "E-mail e senha são obrigatórios." });
        }

        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user is null)
        {
            // Delay para evitar user enumeration simples.
            await Task.Delay(300, HttpContext.RequestAborted);
            return Unauthorized(new { message = "Credenciais inválidas." });
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: true);
        if (!result.Succeeded)
        {
            return Unauthorized(new { message = "Credenciais inválidas." });
        }

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email ?? string.Empty),
            new(ClaimTypes.Name, user.DisplayName),
        };
        var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        var principal = new ClaimsPrincipal(identity);

        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);

        user.LastLoginAt = DateTime.UtcNow;
        await _userManager.UpdateAsync(user);

        return Ok(new LoginResponse(new AdminUserResponse(user.Id, user.Email!, user.DisplayName)));
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return NoContent();
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<AdminUserResponse>> Me()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userId, out var id))
        {
            return Unauthorized();
        }
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user is null)
        {
            return Unauthorized();
        }
        return Ok(new AdminUserResponse(user.Id, user.Email!, user.DisplayName));
    }
}
