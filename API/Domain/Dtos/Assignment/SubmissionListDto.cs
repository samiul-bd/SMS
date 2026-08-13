using Domain.Enums;
using System;

namespace Domain.Dtos.Assignment;

public class SubmissionListDto
{
    public int SubmissionId { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public string AnswerContent { get; set; } = string.Empty;
    public DateTime SubmittedAt { get; set; }
    public int? MarksAwarded { get; set; }
    public string? Feedback { get; set; }
    public SubmissionStatus Status { get; set; }
}