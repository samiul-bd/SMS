using Domain.Entities.Base;
using Domain.Entities.Data;
using Domain.Enums;

namespace Domain.Entities.Auth;

public class User : AuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; }

    // Navigation Properties
    public ICollection<Assignment> Assignments { get; set; } = new List<Assignment>();
    public ICollection<Submission> Submissions { get; set; } = new List<Submission>();
    public ICollection<TeacherSubject> TeacherSubjects { get; set; } = new List<TeacherSubject>();
    public ICollection<StudentCourse> StudentCourses { get; set; } = new List<StudentCourse>();
}