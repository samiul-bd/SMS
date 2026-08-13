using Domain.Entities.Base;

namespace Domain.Entities.Data;

public class Course : AuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }

    public ICollection<Subject> Subjects { get; set; } = new List<Subject>();
    public ICollection<Assignment> Assignments { get; set; } = new List<Assignment>();
    public ICollection<StudentCourse> StudentCourses { get; set; } = new List<StudentCourse>();
}