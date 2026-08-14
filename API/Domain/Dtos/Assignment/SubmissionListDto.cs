using Domain.Enums;
using System;

namespace Domain.Dtos.Assignment;

public class SubmissionListDto
{
    public int SubmissionId { get; set; }
    public int AssignmentId { get; set; }
    public string AssignmentTitle { get; set; } = string.Empty;
    public string CourseName { get; set; } = string.Empty;
    public string SubjectName { get; set; } = string.Empty;
    public string StudentName { get; set; } = string.Empty;
    public string AnswerContent { get; set; } = string.Empty;
    public DateTime SubmittedAt { get; set; }
    public int? MarksAwarded { get; set; }
    public string? Feedback { get; set; }
    public SubmissionStatus Status { get; set; }
}