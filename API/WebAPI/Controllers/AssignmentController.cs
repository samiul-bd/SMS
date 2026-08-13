using Application.Interfaces;
using Domain.Dtos.Assignment;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace WebAPI.Controllers
{
    public class AssignmentController : AuthBaseController<AssignmentController>
    {
        private readonly IAssignmentService _assignmentService;

        public AssignmentController(IAssignmentService assignmentService, ILogger<AssignmentController> logger) : base(logger)
        {
            _assignmentService = assignmentService;
        }

        [HttpPost("create")]
        [Authorize(Roles = "Teacher")] // Shudhumatro Teacher-rai eta hit korte parbe
        public async Task<IActionResult> CreateAssignment([FromBody] CreateAssignmentDto request)
        {
            // JWT Token theke logged-in user (Teacher)-er ID ber kora
            var teacherIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(teacherIdClaim) || !int.TryParse(teacherIdClaim, out int teacherId))
                return Unauthorized(new { Message = "User authentication failed. Invalid token." });

            var result = await _assignmentService.CreateAssignmentAsync(teacherId, request);

            if (result.StartsWith("Error"))
                return BadRequest(new { Message = result });

            return Ok(new { Message = result });
        }
        [HttpGet("{assignmentId}/submissions")]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> GetSubmissions(int assignmentId)
        {
            var teacherIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(teacherIdClaim) || !int.TryParse(teacherIdClaim, out int teacherId))
                return Unauthorized(new { Message = "User authentication failed. Invalid token." });

            var submissions = await _assignmentService.GetSubmissionsAsync(teacherId, assignmentId);
            return Ok(submissions);
        }

        [HttpPost("review-submission")]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> ReviewSubmission([FromBody] ReviewSubmissionDto request)
        {
            var teacherIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(teacherIdClaim) || !int.TryParse(teacherIdClaim, out int teacherId))
                return Unauthorized(new { Message = "User authentication failed. Invalid token." });

            var result = await _assignmentService.ReviewSubmissionAsync(teacherId, request);

            if (result.StartsWith("Error")) return BadRequest(new { Message = result });

            return Ok(new { Message = result });
        }
        [HttpPut("update")]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> UpdateAssignment([FromBody] UpdateAssignmentDto request)
        {
            var teacherIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(teacherIdClaim) || !int.TryParse(teacherIdClaim, out int teacherId))
                return Unauthorized(new { Message = "User authentication failed. Invalid token." });

            var result = await _assignmentService.UpdateAssignmentAsync(teacherId, request);

            if (result.StartsWith("Error")) return BadRequest(new { Message = result });

            return Ok(new { Message = result });
        }

        [HttpDelete("delete/{id}")]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> DeleteAssignment(int id)
        {
            var teacherIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(teacherIdClaim) || !int.TryParse(teacherIdClaim, out int teacherId))
                return Unauthorized(new { Message = "User authentication failed. Invalid token." });

            var result = await _assignmentService.DeleteAssignmentAsync(teacherId, id);

            if (result.StartsWith("Error")) return BadRequest(new { Message = result });

            return Ok(new { Message = result });
        }
    }
}