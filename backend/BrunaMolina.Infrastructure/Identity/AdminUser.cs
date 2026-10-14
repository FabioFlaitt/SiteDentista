using Microsoft.AspNetCore.Identity;

namespace BrunaMolina.Infrastructure.Identity;

public sealed class AdminUser : IdentityUser<Guid>
{
    public string DisplayName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastLoginAt { get; set; }
}
