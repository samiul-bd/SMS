namespace Domain.Dtos.Admin;

public class CreateCourseDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}