namespace Domain.Dtos.Assignment;

public class AssignmentListDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime Deadline { get; set; }
    public int MaxMarks { get; set; }
    public string CourseName { get; set; } = string.Empty;
    public string SubjectName { get; set; } = string.Empty;
    public string TeacherName { get; set; } = string.Empty;
}