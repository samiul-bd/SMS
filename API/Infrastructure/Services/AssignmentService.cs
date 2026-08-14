using Application.Interfaces;
using Domain.Dtos.Assignment;
using Domain.Entities.Data;
using Infrastructure.Persistence.AppContext;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Services;

public class AssignmentService : IAssignmentService
{
    private readonly ApplicationDbContext _context;

    public AssignmentService(ApplicationDbContext context)
    {
        _context = context;
    }

    // নতুন মেথড ইমপ্লিমেন্টেশন
    public async Task<IEnumerable<object>> GetSubjectsByTeacherIdAsync(int teacherId)
    {
        // TeacherSubjects টেবিলের সাথে Subjects টেবিল Join করে শুধুমাত্র এই টিচারের সাবজেক্টগুলো বের করা হচ্ছে
        var subjects = await _context.TeacherSubjects
            .Where(ts => ts.TeacherId == teacherId)
            .Join(_context.Subjects,
                  ts => ts.SubjectId,
                  s => s.Id,
                  (ts, s) => s)
            .ToListAsync();

        return subjects;
    }

    public async Task<string> CreateAssignmentAsync(int teacherId, CreateAssignmentDto request)
    {
        var subjectExists = await _context.Subjects
            .AnyAsync(s => s.Id == request.SubjectId && s.CourseId == request.CourseId);

        if (!subjectExists)
            return "Error: Invalid Course or Subject.";

        var isTeacherAssigned = await _context.TeacherSubjects
            .AnyAsync(ts => ts.TeacherId == teacherId && ts.SubjectId == request.SubjectId);

        if (!isTeacherAssigned)
            return "Error: You are not assigned to this subject.";

        var assignment = new Assignment
        {
            Title = request.Title,
            Description = request.Description,
            Deadline = request.Deadline.ToUniversalTime(),
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
        var assignmentExists = await _context.Assignments
            .AnyAsync(a => a.Id == assignmentId && a.TeacherId == teacherId);

        if (!assignmentExists)
            return new List<SubmissionListDto>();

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

        if (submission.Assignment.TeacherId != teacherId)
            return "Error: You are not authorized to review this submission.";

        if (request.MarksAwarded > submission.Assignment.MaxMarks)
            return $"Error: Marks awarded cannot exceed the maximum marks ({submission.Assignment.MaxMarks}).";

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

        var subjectExists = await _context.Subjects
            .AnyAsync(s => s.Id == request.SubjectId && s.CourseId == request.CourseId);

        if (!subjectExists)
            return "Error: Invalid Course or Subject.";

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