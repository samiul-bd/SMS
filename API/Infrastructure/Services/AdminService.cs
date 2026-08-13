using Application.Interfaces;
using Domain.Dtos.Admin;
using Domain.Dtos.Assignment;
using Domain.Entities.Data;
using Domain.Enums;
using Infrastructure.Persistence.AppContext;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace Infrastructure.Services;

public class AdminService : IAdminService
{
    private readonly ApplicationDbContext _context;

    public AdminService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<string> CreateCourseAsync(CreateCourseDto request)
    {
        var course = new Course
        {
            Name = request.Name,
            Description = request.Description
        };

        _context.Courses.Add(course);
        await _context.SaveChangesAsync();

        return "Course created successfully.";
    }

    public async Task<string> CreateSubjectAsync(CreateSubjectDto request)
    {
        var courseExists = await _context.Courses.AnyAsync(c => c.Id == request.CourseId);
        if (!courseExists)
            return "Error: Course does not exist.";

        var subject = new Subject
        {
            Name = request.Name,
            CourseId = request.CourseId
        };

        _context.Subjects.Add(subject);
        await _context.SaveChangesAsync();

        return "Subject created successfully.";
    }

    public async Task<string> AssignTeacherToSubjectAsync(AssignTeacherDto request)
    {
        var teacherExists = await _context.Users.AnyAsync(u => u.Id == request.TeacherId);
        if (!teacherExists)
            return "Error: Teacher does not exist.";

        var subjectExists = await _context.Subjects.AnyAsync(s => s.Id == request.SubjectId);
        if (!subjectExists)
            return "Error: Subject does not exist.";

        var alreadyAssigned = await _context.TeacherSubjects
            .AnyAsync(ts => ts.TeacherId == request.TeacherId && ts.SubjectId == request.SubjectId);
        if (alreadyAssigned)
            return "Error: Teacher is already assigned to this subject.";

        var teacherSubject = new TeacherSubject
        {
            TeacherId = request.TeacherId,
            SubjectId = request.SubjectId
        };

        _context.TeacherSubjects.Add(teacherSubject);
        await _context.SaveChangesAsync();

        return "Teacher assigned to subject successfully.";
    }

    public async Task<string> EnrollStudentToCourseAsync(EnrollStudentDto request)
    {
        // Fixed the Role checking here
        var studentExists = await _context.Users.AnyAsync(u => u.Id == request.StudentId && u.Role == UserRole.Student);
        if (!studentExists)
            return "Error: Student does not exist or user is not a student.";

        var courseExists = await _context.Courses.AnyAsync(c => c.Id == request.CourseId);
        if (!courseExists)
            return "Error: Course does not exist.";

        var alreadyEnrolled = await _context.StudentCourses
            .AnyAsync(sc => sc.StudentId == request.StudentId && sc.CourseId == request.CourseId);
        if (alreadyEnrolled)
            return "Error: Student is already enrolled in this course.";

        var studentCourse = new StudentCourse
        {
            StudentId = request.StudentId,
            CourseId = request.CourseId
        };

        _context.StudentCourses.Add(studentCourse);
        await _context.SaveChangesAsync();

        return "Student enrolled to course successfully.";
    }
    public async Task<IEnumerable<AssignmentListDto>> GetAllAssignmentsAsync()
    {
        var assignments = await _context.Assignments
            .Include(a => a.Course)
            .Include(a => a.Subject)
            .Include(a => a.Teacher)
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

    public async Task<IEnumerable<SubmissionListDto>> GetAllSubmissionsAsync()
    {
        var submissions = await _context.Submissions
            .Include(s => s.Student)
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
}