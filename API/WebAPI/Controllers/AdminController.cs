using Application.Interfaces;
using Domain.Dtos.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace WebAPI.Controllers
{
    [Authorize]
    public class AdminController : AuthBaseController<AdminController>
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService, ILogger<AdminController> logger) : base(logger)
        {
            _adminService = adminService;
        }

        [HttpPost("course")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateCourse([FromBody] CreateCourseDto request)
        {
            var result = await _adminService.CreateCourseAsync(request);
            if (result.StartsWith("Error")) return BadRequest(new { Message = result });
            return Ok(new { Message = result });
        }

        [HttpPost("subject")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateSubject([FromBody] CreateSubjectDto request)
        {
            var result = await _adminService.CreateSubjectAsync(request);
            if (result.StartsWith("Error")) return BadRequest(new { Message = result });
            return Ok(new { Message = result });
        }

        [HttpPost("assign-teacher")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AssignTeacher([FromBody] AssignTeacherDto request)
        {
            var result = await _adminService.AssignTeacherToSubjectAsync(request);
            if (result.StartsWith("Error")) return BadRequest(new { Message = result });
            return Ok(new { Message = result });
        }

        [HttpPost("enroll-student")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> EnrollStudent([FromBody] EnrollStudentDto request)
        {
            var result = await _adminService.EnrollStudentToCourseAsync(request);
            if (result.StartsWith("Error")) return BadRequest(new { Message = result });
            return Ok(new { Message = result });
        }

        [HttpGet("assignments")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllAssignments()
        {
            var assignments = await _adminService.GetAllAssignmentsAsync();
            return Ok(assignments);
        }

        [HttpGet("submissions")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllSubmissions()
        {
            var submissions = await _adminService.GetAllSubmissionsAsync();
            return Ok(submissions);
        }

        [HttpGet("users")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _adminService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpDelete("users/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var result = await _adminService.DeleteUserAsync(id);
            if (result.StartsWith("Error")) return BadRequest(new { Message = result });
            return Ok(new { Message = result });
        }
        [HttpGet("courses")]
        [Authorize(Roles = "Admin,Teacher")] // Teacher-কেও কোর্স লোড করার পারমিশন দেওয়া হলো
        public async Task<IActionResult> GetAllCourses()
        {
            var courses = await _adminService.GetAllCoursesAsync();
            return Ok(courses);
        }

        [HttpGet("reports")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetSystemReports()
        {
            var reports = await _adminService.GetSystemReportsAsync();
            return Ok(reports);
        }

        [HttpGet("subjects")]
        [Authorize(Roles = "Admin,Teacher")]
        public async Task<IActionResult> GetAllSubjects()
        {
            var subjects = await _adminService.GetAllSubjectsAsync();
            return Ok(subjects);
        }
        [HttpPut("update-user")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateUser([FromBody] UpdateUserDto request)
        {
            var result = await _adminService.UpdateUserAsync(request);

            if (result.StartsWith("Error"))
                return BadRequest(new { Message = result });

            return Ok(new { Message = result });
        }
        [HttpPut("courses/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateCourse(int id, [FromBody] CreateCourseDto request)
        {
            var result = await _adminService.UpdateCourseAsync(id, request);
            if (result.StartsWith("Error")) return BadRequest(new { Message = result });
            return Ok(new { Message = result });
        }

        [HttpPut("subjects/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateSubject(int id, [FromBody] CreateSubjectDto request)
        {
            var result = await _adminService.UpdateSubjectAsync(id, request);
            if (result.StartsWith("Error")) return BadRequest(new { Message = result });
            return Ok(new { Message = result });
        }

    }
}