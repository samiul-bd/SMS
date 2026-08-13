using Domain.Entities.Auth;
using Domain.Entities.Base;

namespace Domain.Entities.Data;

public class StudentCourse : AuditableEntity
{
    public int StudentId { get; set; }
    public User Student { get; set; } = null!;

    public int CourseId { get; set; }
    public Course Course { get; set; } = null!;
}