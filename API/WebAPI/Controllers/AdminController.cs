using Application.Interfaces;
using Domain.Dtos.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace WebAPI.Controllers
{
    [Authorize(Roles = "Admin")] // Shudhumatro Admin access pabe
    public class AdminController : AuthBaseController<AdminController>
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService, ILogger<AdminController> logger) : base(logger)
        {
            _adminService = adminService;
        }

        [HttpPost("course")]
        public async Task<IActionResult> CreateCourse([FromBody] CreateCourseDto request)
        {
            var result = await _adminService.CreateCourseAsync(request);
            if (result.StartsWith("Error")) return BadRequest(new { Message = result });
            return Ok(new { Message = result });
        }

        [HttpPost("subject")]
        public async Task<IActionResult> CreateSubject([FromBody] CreateSubjectDto request)
        {
            var result = await _adminService.CreateSubjectAsync(request);
            if (result.StartsWith("Error")) return BadRequest(new { Message = result });
            return Ok(new { Message = result });
        }

        [HttpPost("assign-teacher")]
        public async Task<IActionResult> AssignTeacher([FromBody] AssignTeacherDto request)
        {
            var result = await _adminService.AssignTeacherToSubjectAsync(request);
            if (result.StartsWith("Error")) return BadRequest(new { Message = result });
            return Ok(new { Message = result });
        }
        [HttpPost("enroll-student")]
        public async Task<IActionResult> EnrollStudent([FromBody] EnrollStudentDto request)
        {
            var result = await _adminService.EnrollStudentToCourseAsync(request);
            if (result.StartsWith("Error")) return BadRequest(new { Message = result });
            return Ok(new { Message = result });
        }
        [HttpGet("assignments")]
        public async Task<IActionResult> GetAllAssignments()
        {
            var assignments = await _adminService.GetAllAssignmentsAsync();
            return Ok(assignments);
        }

        [HttpGet("submissions")]
        public async Task<IActionResult> GetAllSubmissions()
        {
            var submissions = await _adminService.GetAllSubmissionsAsync();
            return Ok(submissions);
        }
    }
}