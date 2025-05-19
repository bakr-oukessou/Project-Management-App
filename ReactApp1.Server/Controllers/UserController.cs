using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server.Interfaces;
using ReactApp1.Server.Models;

namespace ReactApp1.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var users = _userService.GetAll();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            try
            {
                var user = _userService.GetById(id);
                return Ok(user);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpPut("{id}")]
        public IActionResult UpdateProfile(int id, [FromBody] UpdateProfileRequest model)
        {
            // Check if the current user is updating their own profile
            var currentUserId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value);
            if (id != currentUserId && !User.IsInRole(UserRole.Director.ToString()))
            {
                return Forbid();
            }

            try
            {
                var user = _userService.UpdateProfile(id, model);
                return Ok(user);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("role/{role}")]
        public IActionResult GetByRole(UserRole role)
        {
            var users = _userService.GetByRole(role);
            return Ok(users);
        }

        [HttpGet("project/{projectId}/developers")]
        public IActionResult GetDevelopersByProject(int projectId)
        {
            var developers = _userService.GetDevelopersByProject(projectId);
            return Ok(developers);
        }

        [HttpGet("project/{projectId}/available-developers")]
        public IActionResult GetAvailableDevelopers(int projectId)
        {
            var developers = _userService.GetAvailableDevelopers(projectId);
            return Ok(developers);
        }
    }
}
