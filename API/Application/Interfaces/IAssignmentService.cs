using Domain.Dtos.Assignment;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Interfaces;

public interface IAssignmentService
{
    Task<string> CreateAssignmentAsync(int teacherId, CreateAssignmentDto request);
    Task<IEnumerable<SubmissionListDto>> GetSubmissionsAsync(int teacherId, int assignmentId);
    Task<string> ReviewSubmissionAsync(int teacherId, ReviewSubmissionDto request);
    Task<string> UpdateAssignmentAsync(int teacherId, UpdateAssignmentDto request);
    Task<string> DeleteAssignmentAsync(int teacherId, int assignmentId);
    Task<IEnumerable<object>> GetSubjectsByTeacherIdAsync(int teacherId);
    Task<IEnumerable<AssignmentListDto>> GetAssignmentsByTeacherIdAsync(int teacherId);
}