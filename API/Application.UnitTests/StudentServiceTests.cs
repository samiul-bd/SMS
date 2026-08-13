using Domain.Dtos.Assignment;
using Domain.Entities.Data;
using Domain.Enums;
using Infrastructure.Persistence.AppContext;
using Infrastructure.Services;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Xunit;

public class StudentServiceTests
{
    private ApplicationDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new ApplicationDbContext(options);
    }

    [Fact]
    public async Task SubmitAssignment_ShouldFail_WhenDeadlinePassed()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var service = new StudentService(context);

        int studentId = 1;
        int courseId = 1;

        // Student ebong Course enroll banano
        context.StudentCourses.Add(new StudentCourse { StudentId = studentId, CourseId = courseId });

        // Ekta assignment jar deadline gata kaaler (Past)
        var assignment = new Assignment
        {
            Id = 1,
            Title = "Math Assignment",
            Description = "Algebra",
            Deadline = DateTime.UtcNow.AddDays(-1), // Deadline gata hoye geche
            MaxMarks = 100,
            IsPublished = true,
            CourseId = courseId,
            SubjectId = 1,
            TeacherId = 1
        };
        context.Assignments.Add(assignment);
        await context.SaveChangesAsync();

        var request = new SubmitAssignmentDto
        {
            AssignmentId = 1,
            AnswerContent = "Here is my answer."
        };

        // Act
        var result = await service.SubmitAssignmentAsync(studentId, request);

        // Assert
        result.Should().StartWith("Error: The deadline for this assignment has passed.");
    }
}