using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Models;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;
using ReactApp1.Server.Data;
using Microsoft.AspNetCore.Authorization;
using ReactApp1.Server.Models.Dtos;
using ReactApp1.Server.Interfaces;

namespace ReactApp1.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IAuthService _authService;

        public AuthController(ApplicationDbContext context, IConfiguration configuration, IAuthService authService)
        {
            _context = context;
            _configuration = configuration;
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<string>> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                if (string.IsNullOrEmpty(loginDto.Email) || string.IsNullOrEmpty(loginDto.Password))
                {
                    return BadRequest("Email and password are required");
                }

                // Use AuthService for consistent password verification
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

                if (user == null)
                    return Unauthorized(new { message = "Invalid email or password" });

                // Use AuthService's VerifyPassword method instead of PasswordHasher
                if (!_authService.VerifyPassword(loginDto.Password, user.PasswordHash))
                    return Unauthorized(new { message = "Invalid email or password" });

                string token = _authService.GenerateJwtToken(user);

                var response = new
                {
                    token,
                    user = new
                    {
                        id = user.Id,
                        email = user.Email,
                        firstName = user.FirstName ?? string.Empty,
                        lastName = user.LastName ?? string.Empty,
                        role = user.Role.ToString()
                    }
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                // Log the exception details
                Console.WriteLine($"Login Error: {ex}");
                return StatusCode(500, new { message = "An error occurred during login." });
            }
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register(RegisterDto registerDto)
        {
            try
            {
                // Check if email is already taken
                if (await _authService.UserExistsAsync(registerDto.Email))
                {
                    return BadRequest("Email is already taken");
                }

                // Create RegisterRequest object
                var registerRequest = new RegisterRequest
                {
                    FirstName = registerDto.FirstName,
                    LastName = registerDto.LastName,
                    Email = registerDto.Email,
                    Username = registerDto.Email.Split('@')[0],
                    Password = registerDto.Password,
                    Role = Enum.Parse<UserRole>(registerDto.Role)
                };

                var result = _authService.Register(registerRequest);
                return Ok(result);
            }
            catch (ApplicationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Registration Error: {ex}");
                return StatusCode(500, new { message = "An error occurred during registration." });
            }
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<User>> Me()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();
            return Ok(new
            {
                id = user.Id,
                email = user.Email,
                name = user.FirstName,
                role = user.Role
            });
        }
    }

    public class LoginDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}