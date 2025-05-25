using ReactApp1.Server.Models;

namespace ReactApp1.Server.Interfaces
{
    public interface IAuthService
    {
        AuthResponse Authenticate(LoginRequest model);
        AuthResponse Register(RegisterRequest model);
        string HashPassword(string password);
        bool VerifyPassword(string password, string hash);
        string GenerateJwtToken(User user);
        Task<bool> UserExistsAsync(string email);
    }
}
