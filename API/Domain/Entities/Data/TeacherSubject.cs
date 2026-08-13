using Domain.Entities.Auth;
using Domain.Entities.Base;

namespace Domain.Entities.Data;

public class TeacherSubject : AuditableEntity
{
    public int TeacherId { get; set; }
    public User Teacher { get; set; } = null!;

    public int SubjectId { get; set; }
    public Subject Subject { get; set; } = null!;
}