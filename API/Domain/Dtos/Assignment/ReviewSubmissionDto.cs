using Domain.Enums;

namespace Domain.Dtos.Assignment;

public class ReviewSubmissionDto
{
    public int SubmissionId { get; set; }
    public int MarksAwarded { get; set; }
    public string Feedback { get; set; } = string.Empty;
    public SubmissionStatus Status { get; set; }
}