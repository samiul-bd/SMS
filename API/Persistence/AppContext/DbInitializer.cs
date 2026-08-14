using Domain.Entities.Auth;
using Domain.Enums;
using Infrastructure.Persistence.AppContext;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Persistence.AppContext;

public static class DbInitializer
{
    public static async Task InitializeAsync(IServiceProvider serviceProvider)
    {
        using var context = new ApplicationDbContext(
            serviceProvider.GetRequiredService<DbContextOptions<ApplicationDbContext>>());

        await context.Database.MigrateAsync();

        if (context.Users.Any())
        {
            return;
        }

        var users = new User[]
        {
            new User
            {
                Name = "System Admin",
                Email = "admin@sms.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                Role = UserRole.Admin,
                IsApproved = true
            },
            new User
            {
                Name = "Default Teacher",
                Email = "teacher@sms.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Teacher@123"),
                Role = UserRole.Teacher,
                IsApproved = true
            },
            new User
            {
                Name = "Default Student",
                Email = "student@sms.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Student@123"),
                Role = UserRole.Student,
                IsApproved = true
            }
        };

        context.Users.AddRange(users);
        await context.SaveChangesAsync();
    }
}