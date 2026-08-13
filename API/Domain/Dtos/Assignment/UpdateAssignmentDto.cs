namespace Domain.Dtos.Assignment;

public class UpdateAssignmentDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime Deadline { get; set; }
    public int MaxMarks { get; set; }
    public bool IsPublished { get; set; }
    public int CourseId { get; set; }
    public int SubjectId { get; set; }
}