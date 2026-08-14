using Domain.Dtos.Assignment;
using Domain.Entities.Data;
using Domain.Entities.Auth;
using Domain.Enums;
using Infrastructure.Persistence.AppContext;
using Infrastructure.Services;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Xunit;
using System;
using System.Threading.Tasks;
using System.Linq;

namespace Application.UnitTests;

public class TeacherAssignmentServiceTests
{
    private ApplicationDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new ApplicationDbContext(options);
    }

    [Fact]
    public async Task GetAssignmentsByTeacherId_ShouldReturnOnlyTeacherAssignments()
    {
        var context = GetInMemoryDbContext();
        var service = new AssignmentService(context);

        var course = new Course { Id = 1, Name = "Computer Science" };
        var subject = new Subject { Id = 1, Name = "Data Structures", CourseId = 1 };
        var teacher1 = new User { Id = 10, Name = "Teacher One", Email = "t1@sms.com", Role = UserRole.Teacher };
        var teacher2 = new User { Id = 20, Name = "Teacher Two", Email = "t2@sms.com", Role = UserRole.Teacher };

        context.Courses.Add(course);
        context.Subjects.Add(subject);
        context.Users.AddRange(teacher1, teacher2);

        context.Assignments.Add(new Assignment
        {
            Id = 1,
            Title = "Teacher 1 Assignment",
            Description = "Desc 1",
            Deadline = DateTime.UtcNow.AddDays(2),
            MaxMarks = 100,
            IsPublished = true,
            CourseId = 1,
            SubjectId = 1,
            TeacherId = 10
        });

        context.Assignments.Add(new Assignment
        {
            Id = 2,
            Title = "Teacher 2 Assignment",
            Description = "Desc 2",
            Deadline = DateTime.UtcNow.AddDays(3),
            MaxMarks = 100,
            IsPublished = true,
            CourseId = 1,
            SubjectId = 1,
            TeacherId = 20
        });

        await context.SaveChangesAsync();

        var result = await service.GetAssignmentsByTeacherIdAsync(10);

        result.Should().HaveCount(1);
        result.First().Title.Should().Be("Teacher 1 Assignment");
    }

    [Fact]
    public async Task ReviewSubmission_ShouldFail_WhenMarksExceedMaxMarks()
    {
        var context = GetInMemoryDbContext();
        var service = new AssignmentService(context);

        int teacherId = 1;
        var assignment = new Assignment
        {
            Id = 10,
            Title = "Quiz 1",
            Description = "Math",
            Deadline = DateTime.UtcNow.AddDays(1),
            MaxMarks = 50,
            TeacherId = teacherId
        };
        context.Assignments.Add(assignment);

        var submission = new Submission
        {
            Id = 100,
            AssignmentId = 10,
            StudentId = 5,
            AnswerContent = "Answer",
            SubmittedAt = DateTime.UtcNow,
            Status = SubmissionStatus.Submitted
        };
        context.Submissions.Add(submission);
        await context.SaveChangesAsync();

        var request = new ReviewSubmissionDto
        {
            SubmissionId = 100,
            MarksAwarded = 60,
            Feedback = "Over-scored",
            Status = SubmissionStatus.Evaluated
        };

        var result = await service.ReviewSubmissionAsync(teacherId, request);

        result.Should().StartWith("Error: Marks awarded cannot exceed the maximum marks");
    }
}
