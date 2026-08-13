using Application.Interfaces;
using Domain.Dtos.Assignment;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace WebAPI.Controllers
{
    [Authorize(Roles = "Student")] // Shudhumatro Student access pabe
    public class StudentController : AuthBaseController<StudentController>
    {
        private readonly IStudentService _studentService;

        public StudentController(IStudentService studentService, ILogger<StudentController> logger) : base(logger)
        {
            _studentService = studentService;
        }

        [HttpGet("my-assignments")]
        public async Task<IActionResult> GetMyAssignments()
        {
            // Extract Student ID from the JWT token
            var studentIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(studentIdClaim) || !int.TryParse(studentIdClaim, out int studentId))
                return Unauthorized(new { Message = "User authentication failed. Invalid token." });

            var assignments = await _studentService.GetMyAssignmentsAsync(studentId);
            return Ok(assignments);
        }
        [HttpPost("submit")]
        public async Task<IActionResult> SubmitAssignment([FromBody] SubmitAssignmentDto request)
        {
            var studentIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(studentIdClaim) || !int.TryParse(studentIdClaim, out int studentId))
                return Unauthorized(new { Message = "User authentication failed. Invalid token." });

            var result = await _studentService.SubmitAssignmentAsync(studentId, request);

            if (result.StartsWith("Error")) return BadRequest(new { Message = result });

            return Ok(new { Message = result });
        }
        [HttpGet("assignment/{assignmentId}/my-submission")]
        public async Task<IActionResult> GetMySubmission(int assignmentId)
        {
            var studentIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(studentIdClaim) || !int.TryParse(studentIdClaim, out int studentId))
                return Unauthorized(new { Message = "User authentication failed. Invalid token." });

            var submission = await _studentService.GetMySubmissionAsync(studentId, assignmentId);

            if (submission == null)
                return NotFound(new { Message = "No submission found for this assignment." });

            return Ok(submission);
        }
    }
}