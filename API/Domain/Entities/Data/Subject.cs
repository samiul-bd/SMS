using Domain.Entities.Base;

namespace Domain.Entities.Data;

public class Subject : AuditableEntity
{
    public string Name { get; set; } = string.Empty;

    public int CourseId { get; set; }
    public Course Course { get; set; } = null!;

    public ICollection<TeacherSubject> TeacherSubjects { get; set; } = new List<TeacherSubject>();
    public ICollection<Assignment> Assignments { get; set; } = new List<Assignment>();
}