using Domain.Dtos.Auth;

namespace Application.Interfaces;

public interface IAuthService
{
    Task<string> RegisterAsync(RegisterDto request);
    Task<string> LoginAsync(LoginDto request);
}