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
}