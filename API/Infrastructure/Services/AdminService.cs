using Application.Interfaces;
using Domain.Dtos.Admin;
using Domain.Dtos.Assignment;
using Domain.Entities.Data;
using Domain.Enums;
using Infrastructure.Persistence.AppContext;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
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
                .Include(s => s.Assignment)
                    .ThenInclude(a => a.Course)
                .Include(s => s.Assignment)
                    .ThenInclude(a => a.Subject)
                .Select(s => new SubmissionListDto
                {
                    SubmissionId = s.Id,
                    AssignmentId = s.AssignmentId,
                    AssignmentTitle = s.Assignment != null ? s.Assignment.Title : "",
                    CourseName = s.Assignment != null && s.Assignment.Course != null ? s.Assignment.Course.Name : "",
                    SubjectName = s.Assignment != null && s.Assignment.Subject != null ? s.Assignment.Subject.Name : "",
                    StudentName = s.Student != null ? s.Student.Name : "",
                    AnswerContent = s.AnswerContent,
                    SubmittedAt = s.SubmittedAt,
                    MarksAwarded = s.MarksAwarded,
                    Feedback = s.Feedback,
                    Status = s.Status
                })
                .ToListAsync();

            return submissions;
        }

        public async Task<IEnumerable<object>> GetAllUsersAsync()
        {
            var users = await _context.Users.ToListAsync();

            var teacherSubjects = await _context.TeacherSubjects
                .Include(ts => ts.Subject)
                .ToListAsync();

            var studentCourses = await _context.StudentCourses
                .Include(sc => sc.Course)
                .ToListAsync();

            var result = users.Select(u => new
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                Role = u.Role.ToString(),
                IsApproved = u.IsApproved,
                Subjects = u.Role == UserRole.Teacher
                    ? teacherSubjects
                        .Where(ts => ts.TeacherId == u.Id)
                        .Select(ts => new { Name = ts.Subject != null ? ts.Subject.Name : "" })
                        .ToList()
                    : null,
                Courses = u.Role == UserRole.Student
                    ? studentCourses
                        .Where(sc => sc.StudentId == u.Id)
                        .Select(sc => new { Name = sc.Course != null ? sc.Course.Name : "" })
                        .ToList()
                    : null
            });

            return result;
        }

        public async Task<string> DeleteUserAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return "Error: User not found.";

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return "User deleted successfully.";
        }

        public async Task<IEnumerable<object>> GetAllCoursesAsync()
        {
            var courses = await _context.Courses
                .Select(c => new
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description
                })
                .ToListAsync();

            return courses;
        }

        public async Task<IEnumerable<object>> GetSystemReportsAsync()
        {
            var reports = await _context.Assignments
                .Select(a => new
                {
                    Title = a.Title,
                    CourseName = a.Subject != null && a.Subject.Course != null ? a.Subject.Course.Name : "N/A",
                    SubmissionCount = a.Submissions != null ? a.Submissions.Count : 0,
                    Status = a.IsPublished ? "Published" : "Draft"
                })
                .ToListAsync();

            return reports;
        }

        public async Task<IEnumerable<object>> GetAllSubjectsAsync()
        {
            var subjects = await _context.Subjects
                .Select(s => new
                {
                    Id = s.Id,
                    Name = s.Name
                })
                .ToListAsync();

            return subjects;
        }
        public async Task<string> UpdateUserAsync(UpdateUserDto request)
        {
            try
            {
                var user = await _context.Users.FindAsync(request.Id);
                if (user == null) return "Error: User not found.";

                // শুধু Name আপডেট করা হচ্ছে (যদি ফাঁকা না থাকে)
                if (!string.IsNullOrEmpty(request.Name))
                {
                    user.Name = request.Name;
                }

                // Role স্ট্রিং থেকে Enum এ কনভার্ট করা হচ্ছে
                if (Enum.TryParse<UserRole>(request.Role, true, out var roleEnum))
                {
                    user.Role = roleEnum;
                }
                else
                {
                    return "Error: Invalid Role provided.";
                }

                // ⚠️ _context.Users.Update(user); লাইনটি বাদ দেওয়া হয়েছে। 
                // কারণ FindAsync দিয়ে আনলে EF Core নিজে থেকেই ট্র্যাকিং করে, আলাদা করে Update কল করলে কনফ্লিক্ট হয়।

                await _context.SaveChangesAsync();

                return "User updated successfully.";
            }
            catch (Exception ex)
            {
                // যদি ডাটাবেসের কোনো এরর হয়, তবে আসল কারণটি রিটার্ন করবে
                var exactError = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return $"Error: {exactError}";
            }

        }

        public async Task<string> UpdateCourseAsync(int id, CreateCourseDto request)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null) return "Error: Course not found.";

            course.Name = request.Name;
            course.Description = request.Description;

            await _context.SaveChangesAsync();
            return "Course updated successfully.";
        }

        public async Task<string> UpdateSubjectAsync(int id, CreateSubjectDto request)
        {
            var subject = await _context.Subjects.FindAsync(id);
            if (subject == null) return "Error: Subject not found.";

            subject.Name = request.Name;
            subject.CourseId = request.CourseId;

            await _context.SaveChangesAsync();
            return "Subject updated successfully.";
        }

        public async Task<IEnumerable<object>> GetPendingUsersAsync()
        {
            var pendingUsers = await _context.Users
                .Where(u => !u.IsApproved)
                .Select(u => new
                {
                    Id = u.Id,
                    Name = u.Name,
                    Email = u.Email,
                    RequestedRole = u.Role.ToString(),
                    IsApproved = u.IsApproved
                })
                .ToListAsync();

            return pendingUsers;
        }

        public async Task<string> ApproveUserAsync(ApproveUserDto request)
        {
            var user = await _context.Users.FindAsync(request.UserId);
            if (user == null) return "Error: User not found.";

            user.Role = request.AssignedRole;
            user.IsApproved = request.IsApproved;

            await _context.SaveChangesAsync();
            return $"User '{user.Email}' approved successfully as {user.Role}.";
        }
    }
}