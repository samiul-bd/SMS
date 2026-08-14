using Domain.Enums;

namespace Domain.Dtos.Admin;

public class ApproveUserDto
{
    public int UserId { get; set; }
    public UserRole AssignedRole { get; set; } = UserRole.Student;
    public bool IsApproved { get; set; } = true;
}
