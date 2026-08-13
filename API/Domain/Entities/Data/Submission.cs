using Domain.Entities.Base;
using Domain.Entities.Auth;
using Domain.Enums;

namespace Domain.Entities.Data;

public class Submission : AuditableEntity
{
    public string AnswerContent { get; set; } = string.Empty;
    public DateTime SubmittedAt { get; set; }
    public int? MarksAwarded { get; set; }
    public string? Feedback { get; set; }
    public SubmissionStatus Status { get; set; } = SubmissionStatus.Pending;

    
    public int AssignmentId { get; set; }
    public Assignment Assignment { get; set; } = null!;

    public int StudentId { get; set; }
    public User Student { get; set; } = null!;
}