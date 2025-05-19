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
        private readonly PasswordHasher<User> _passwordHasher;
        private readonly IAuthService _authService;

        public AuthController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
            _passwordHasher = new PasswordHasher<User>();
        }

        [HttpPost("login")]
        public async Task<ActionResult<string>> Login([FromBody] LoginDto loginDto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null)
                return Unauthorized("Invalid email or password");

            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, loginDto.Password);
            if (result != PasswordVerificationResult.Success)
                return Unauthorized("Invalid email or password");

            string token = CreateToken(user);
            return Ok(new {
                token,
                user = new {
                    id = user.Id,
                    email = user.Email,
                    name = user.FirstName,
                    role = user.Role
                }
            });
        }

        //[HttpPost("register")]
        //public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        //{
        //    // Check if email is already taken
        //    if (await _authService.UserExistsAsync(registerDto.Email))
        //        return BadRequest("Email is already taken");

        //    // Create user
        //    var user = new User
        //    {
        //        FirstName = registerDto.FirstName,
        //        LastName = registerDto.LastName,
        //        Email = registerDto.Email,
        //        Role = registerDto.Role.ToLower() == "director" ? UserRole.Director : UserRole.Developer,
        //    };

        //    var result = await _authService.Register(user, registerDto.Password);
        //    if (!result.Success)
        //        return BadRequest(result.Message);

        //    return Ok(result.User);
        //}

        private string CreateToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.FirstName),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:Token").Value));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: creds);

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<User>> Me()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();
            return Ok(new {
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
