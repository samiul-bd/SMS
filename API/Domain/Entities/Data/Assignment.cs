using Domain.Entities.Base;
using Domain.Entities.Auth;


namespace Domain.Entities.Data;

public class Assignment : AuditableEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime Deadline { get; set; }
    public int MaxMarks { get; set; }
    public bool IsPublished { get; set; }
    public string CourseOrClass { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;

    
    public int TeacherId { get; set; }
    public User Teacher { get; set; } = null!;

    public ICollection<Submission> Submissions { get; set; } = new List<Submission>();
}