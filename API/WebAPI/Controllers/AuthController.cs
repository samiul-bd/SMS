using Application.Interfaces;
using Domain.Dtos.Auth;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    public class AuthController : BaseController<AuthController>
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService, ILogger<AuthController> logger) : base(logger)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto request)
        {
            var result = await _authService.RegisterAsync(request);

            if (result.StartsWith("Error"))
                return BadRequest(new { Message = result });

            return Ok(new { Message = result });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto request)
        {
            var result = await _authService.LoginAsync(request);

            if (result.StartsWith("Error"))
                return Unauthorized(new { Message = result });

            return Ok(new { Token = result });
        }
    }
}