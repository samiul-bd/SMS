using Application.Interfaces;
using Domain.Dtos.Assignment;
using Domain.Entities.Data;
using Infrastructure.Persistence.AppContext;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Infrastructure.Services;

public class AssignmentService : IAssignmentService
{
    private readonly ApplicationDbContext _context;

    public AssignmentService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<string> CreateAssignmentAsync(int teacherId, CreateAssignmentDto request)
    {
        // Check if Course and Subject relation is valid
        var subjectExists = await _context.Subjects
            .AnyAsync(s => s.Id == request.SubjectId && s.CourseId == request.CourseId);

        if (!subjectExists)
            return "Error: Invalid Course or Subject.";

        // Check if the teacher is assigned to this subject
        var isTeacherAssigned = await _context.TeacherSubjects
            .AnyAsync(ts => ts.TeacherId == teacherId && ts.SubjectId == request.SubjectId);

        if (!isTeacherAssigned)
            return "Error: You are not assigned to this subject.";

        // Create the assignment
        var assignment = new Assignment
        {
            Title = request.Title,
            Description = request.Description,
            Deadline = request.Deadline.ToUniversalTime(), // PostgreSQL requires UTC datetime
            MaxMarks = request.MaxMarks,
            IsPublished = request.IsPublished,
            CourseId = request.CourseId,
            SubjectId = request.SubjectId,
            TeacherId = teacherId
        };

        _context.Assignments.Add(assignment);
        await _context.SaveChangesAsync();

        return "Assignment created successfully.";
    }
    public async Task<IEnumerable<SubmissionListDto>> GetSubmissionsAsync(int teacherId, int assignmentId)
    {
        // Teacher jeno shudhu tar nijer assignment er submission dekhte pare
        var assignmentExists = await _context.Assignments
            .AnyAsync(a => a.Id == assignmentId && a.TeacherId == teacherId);

        if (!assignmentExists)
            return new List<SubmissionListDto>(); // Assignment na thakle ba onno teacher er hole faka list

        var submissions = await _context.Submissions
            .Include(s => s.Student)
            .Where(s => s.AssignmentId == assignmentId)
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
            .ToListAsync();

        return submissions;
    }

    public async Task<string> ReviewSubmissionAsync(int teacherId, ReviewSubmissionDto request)
    {
        var submission = await _context.Submissions
            .Include(s => s.Assignment)
            .FirstOrDefaultAsync(s => s.Id == request.SubmissionId);

        if (submission == null)
            return "Error: Submission not found.";

        // Validate if the teacher who is trying to review is the creator of the assignment
        if (submission.Assignment.TeacherId != teacherId)
            return "Error: You are not authorized to review this submission.";

        if (request.MarksAwarded > submission.Assignment.MaxMarks)
            return $"Error: Marks awarded cannot exceed the maximum marks ({submission.Assignment.MaxMarks}).";

        // Update submission details
        submission.MarksAwarded = request.MarksAwarded;
        submission.Feedback = request.Feedback;
        submission.Status = request.Status;

        _context.Submissions.Update(submission);
        await _context.SaveChangesAsync();

        return "Submission reviewed successfully.";
    }
    public async Task<string> UpdateAssignmentAsync(int teacherId, UpdateAssignmentDto request)
    {
        var assignment = await _context.Assignments.FirstOrDefaultAsync(a => a.Id == request.Id);

        if (assignment == null)
            return "Error: Assignment not found.";

        if (assignment.TeacherId != teacherId)
            return "Error: You are not authorized to update this assignment.";

        // Validate Course and Subject relation
        var subjectExists = await _context.Subjects
            .AnyAsync(s => s.Id == request.SubjectId && s.CourseId == request.CourseId);

        if (!subjectExists)
            return "Error: Invalid Course or Subject.";

        // Validate if teacher is still assigned to this subject
        var isTeacherAssigned = await _context.TeacherSubjects
            .AnyAsync(ts => ts.TeacherId == teacherId && ts.SubjectId == request.SubjectId);

        if (!isTeacherAssigned)
            return "Error: You are not assigned to this subject.";

        assignment.Title = request.Title;
        assignment.Description = request.Description;
        assignment.Deadline = request.Deadline.ToUniversalTime();
        assignment.MaxMarks = request.MaxMarks;
        assignment.IsPublished = request.IsPublished;
        assignment.CourseId = request.CourseId;
        assignment.SubjectId = request.SubjectId;

        _context.Assignments.Update(assignment);
        await _context.SaveChangesAsync();

        return "Assignment updated successfully.";
    }

    public async Task<string> DeleteAssignmentAsync(int teacherId, int assignmentId)
    {
        var assignment = await _context.Assignments.FirstOrDefaultAsync(a => a.Id == assignmentId);

        if (assignment == null)
            return "Error: Assignment not found.";

        if (assignment.TeacherId != teacherId)
            return "Error: You are not authorized to delete this assignment.";

        _context.Assignments.Remove(assignment);
        await _context.SaveChangesAsync();

        return "Assignment deleted successfully.";
    }

}