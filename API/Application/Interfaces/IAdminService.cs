using Domain.Dtos.Admin;
using Domain.Dtos.Assignment;
using System.Threading.Tasks;

namespace Application.Interfaces;

public interface IAdminService
{
    Task<string> CreateCourseAsync(CreateCourseDto request);
    Task<string> CreateSubjectAsync(CreateSubjectDto request);
    Task<string> AssignTeacherToSubjectAsync(AssignTeacherDto request);
    Task<string> EnrollStudentToCourseAsync(EnrollStudentDto request);
    Task<IEnumerable<AssignmentListDto>> GetAllAssignmentsAsync();
    Task<IEnumerable<SubmissionListDto>> GetAllSubmissionsAsync();
    Task<IEnumerable<object>> GetAllUsersAsync();
    Task<string> DeleteUserAsync(int id);
    Task<IEnumerable<object>> GetAllCoursesAsync();
    Task<IEnumerable<object>> GetSystemReportsAsync();
    Task<IEnumerable<object>> GetAllSubjectsAsync();
    Task<string> UpdateUserAsync(UpdateUserDto request);
    Task<string> UpdateCourseAsync(int id, CreateCourseDto request);
    Task<string> UpdateSubjectAsync(int id, CreateSubjectDto request);
    Task<IEnumerable<object>> GetPendingUsersAsync();
    Task<string> ApproveUserAsync(ApproveUserDto request);
}