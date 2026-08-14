using Application.Interfaces;
using Domain.Dtos.Assignment;
using Domain.Entities.Data;
using Domain.Enums;
using Infrastructure.Persistence.AppContext;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Services;

public class StudentService : IStudentService
{
    private readonly ApplicationDbContext _context;

    public StudentService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<AssignmentListDto>> GetMyAssignmentsAsync(int studentId)
    {
        var enrolledCourseIds = await _context.StudentCourses
            .Where(sc => sc.StudentId == studentId)
            .Select(sc => sc.CourseId)
            .ToListAsync();

        var assignments = await _context.Assignments
            .Include(a => a.Course)
            .Include(a => a.Subject)
            .Include(a => a.Teacher)
            .Where(a => enrolledCourseIds.Contains(a.CourseId) && a.IsPublished)
            .Select(a => new AssignmentListDto
            {
                Id = a.Id,
                Title = a.Title,
                Description = a.Description,
                Deadline = a.Deadline,
                MaxMarks = a.MaxMarks,
                CourseName = a.Course.Name,
                SubjectName = a.Subject.Name,
                TeacherName = a.Teacher.Name
            })
            .ToListAsync();

        return assignments;
    }

    public async Task<string> SubmitAssignmentAsync(int studentId, SubmitAssignmentDto request)
    {
        var assignment = await _context.Assignments.FirstOrDefaultAsync(a => a.Id == request.AssignmentId);

        if (assignment == null)
            return "Error: Assignment not found.";

        if (!assignment.IsPublished)
            return "Error: You cannot submit to an unpublished assignment.";

        var isEnrolled = await _context.StudentCourses
            .AnyAsync(sc => sc.StudentId == studentId && sc.CourseId == assignment.CourseId);
        if (!isEnrolled)
            return "Error: You are not enrolled in the course for this assignment.";

        if (DateTime.UtcNow > assignment.Deadline)
            return "Error: The deadline for this assignment has passed.";

        var existingSubmission = await _context.Submissions
            .FirstOrDefaultAsync(s => s.StudentId == studentId && s.AssignmentId == request.AssignmentId);

        if (existingSubmission != null)
        {
            existingSubmission.AnswerContent = request.AnswerContent;
            existingSubmission.SubmittedAt = DateTime.UtcNow;
            existingSubmission.Status = SubmissionStatus.Pending;
            existingSubmission.MarksAwarded = null;
            existingSubmission.Feedback = null;

            _context.Submissions.Update(existingSubmission);
            await _context.SaveChangesAsync();

            return "Submission updated successfully.";
        }

        var newSubmission = new Submission
        {
            AssignmentId = request.AssignmentId,
            StudentId = studentId,
            AnswerContent = request.AnswerContent,
            SubmittedAt = DateTime.UtcNow,
            Status = SubmissionStatus.Pending
        };

        _context.Submissions.Add(newSubmission);
        await _context.SaveChangesAsync();

        return "Assignment submitted successfully.";
    }
    public async Task<SubmissionListDto?> GetMySubmissionAsync(int studentId, int assignmentId)
    {
        var submission = await _context.Submissions
            .Include(s => s.Student)
            .Where(s => s.StudentId == studentId && s.AssignmentId == assignmentId)
            .Select(s => new SubmissionListDto
            {
                SubmissionId = s.Id,
                StudentName = s.Student.Name,
                AnswerContent = s.AnswerContent,
                SubmittedAt = s.SubmittedAt,
                MarksAwarded = s.MarksAwarded,
                Feedback = s.Feedback,
                Status = s.Status
            })
            .FirstOrDefaultAsync();

        return submission;
    }
}