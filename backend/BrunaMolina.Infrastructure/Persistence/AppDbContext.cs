using BrunaMolina.Domain.Entities;
using BrunaMolina.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BrunaMolina.Infrastructure.Persistence;

public sealed class AppDbContext : IdentityDbContext<AdminUser, IdentityRole<Guid>, Guid>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<AnalyticsEvent> AnalyticsEvents => Set<AnalyticsEvent>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<AnalyticsEvent>(e =>
        {
            e.ToTable("analytics_events");
            e.HasKey(x => x.Id);
            e.Property(x => x.Type).HasConversion<int>().IsRequired();
            e.Property(x => x.Device).HasConversion<int>().IsRequired();
            e.Property(x => x.Path).HasMaxLength(512).IsRequired();
            e.Property(x => x.Referrer).HasMaxLength(1024);
            e.Property(x => x.Country).HasMaxLength(2);
            e.Property(x => x.Region).HasMaxLength(64);
            e.Property(x => x.City).HasMaxLength(128);
            e.Property(x => x.UserAgentHash).HasMaxLength(64);
            e.Property(x => x.OccurredAt).IsRequired();
            e.HasIndex(x => x.OccurredAt);
            e.HasIndex(x => new { x.Type, x.OccurredAt });
        });

        builder.Entity<AdminUser>(e =>
        {
            e.Property(u => u.DisplayName).HasMaxLength(120).IsRequired();
            e.Property(u => u.CreatedAt).IsRequired();
        });
    }
}
