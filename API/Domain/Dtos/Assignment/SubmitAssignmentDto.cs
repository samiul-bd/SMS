namespace Domain.Dtos.Assignment;

public class SubmitAssignmentDto
{
    public int AssignmentId { get; set; }
    public string AnswerContent { get; set; } = string.Empty;
}