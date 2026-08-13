namespace Domain.Dtos.Admin;

public class CreateSubjectDto
{
    public string Name { get; set; } = string.Empty;
    public int CourseId { get; set; }
}