using Domain.Dtos.Admin;
using Domain.Dtos.Auth;
using Domain.Entities.Auth;
using Domain.Enums;
using Infrastructure.Persistence.AppContext;
using Infrastructure.Security;
using Infrastructure.Services;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Xunit;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace Application.UnitTests;

public class UserApprovalServiceTests
{
    private ApplicationDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new ApplicationDbContext(options);
    }

    private IConfiguration GetMockConfiguration()
    {
        var myConfiguration = new Dictionary<string, string?>
        {
            {"JwtSettings:Key", "ThisIsASecretKeyForAssignmentManagementSystem2026!@#"},
            {"JwtSettings:Issuer", "issuer"},
            {"JwtSettings:Audience", "audiance"},
            {"JwtSettings:DurationInMinutes", "60"}
        };

        return new ConfigurationBuilder()
            .AddInMemoryCollection(myConfiguration)
            .Build();
    }

    [Fact]
    public async Task LoginAsync_ShouldReturnError_WhenUserIsNotApproved()
    {
        var context = GetInMemoryDbContext();
        var config = GetMockConfiguration();
        var authService = new AuthService(context, config);

        var unapprovedUser = new User
        {
            Id = 1,
            Name = "Pending Student",
            Email = "pending@sms.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password@123"),
            Role = UserRole.Student,
            IsApproved = false
        };

        context.Users.Add(unapprovedUser);
        await context.SaveChangesAsync();

        var loginDto = new LoginDto
        {
            Email = "pending@sms.com",
            Password = "Password@123"
        };

        var result = await authService.LoginAsync(loginDto);

        result.Should().Be("Error: Your account is pending approval by an Admin.");
    }

    [Fact]
    public async Task ApproveUserAsync_ShouldApproveAndChangeUserRole()
    {
        var context = GetInMemoryDbContext();
        var adminService = new AdminService(context);

        var unapprovedUser = new User
        {
            Id = 5,
            Name = "Applicant",
            Email = "applicant@sms.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Pass@123"),
            Role = UserRole.Student,
            IsApproved = false
        };

        context.Users.Add(unapprovedUser);
        await context.SaveChangesAsync();

        var approveDto = new ApproveUserDto
        {
            UserId = 5,
            AssignedRole = UserRole.Teacher,
            IsApproved = true
        };

        var result = await adminService.ApproveUserAsync(approveDto);

        result.Should().Contain("approved successfully");

        var dbUser = await context.Users.FindAsync(5);
        dbUser.Should().NotBeNull();
        dbUser!.IsApproved.Should().BeTrue();
        dbUser.Role.Should().Be(UserRole.Teacher);
    }
}
