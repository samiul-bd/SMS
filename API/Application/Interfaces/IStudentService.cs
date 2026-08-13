using Domain.Dtos.Assignment;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces;

public interface IStudentService
{
    Task<IEnumerable<AssignmentListDto>> GetMyAssignmentsAsync(int studentId);
    Task<string> SubmitAssignmentAsync(int studentId, SubmitAssignmentDto request);
    Task<SubmissionListDto?> GetMySubmissionAsync(int studentId, int assignmentId);
}