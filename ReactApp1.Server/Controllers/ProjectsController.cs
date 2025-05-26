using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Interfaces;
using ReactApp1.Server.Models;
using ReactApp1.Server.Models.Dtos;

namespace ReactApp1.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProjectsController : ControllerBase
    {
        private readonly IProjectService _projectService;

        public ProjectsController(IProjectService projectService)
        {
            _projectService = projectService;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var projects = _projectService.GetAll();
            return Ok(projects);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            try
            {
                var project = _projectService.GetById(id);
                return Ok(project);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpPost]
        [Authorize(Roles = "Director")]
        public IActionResult Create([FromBody] Project project)
        {
            if (project == null)
                return BadRequest();

            // Set the director ID to the current user
            var directorId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value);
            project.DirectorId = directorId;

            var createdProject = _projectService.Create(project);
            return CreatedAtAction(nameof(GetById), new { id = createdProject.Id }, createdProject);
        }

        [HttpPost]
        [Authorize(Roles = "Director")]
        public async Task<ActionResult<ProjectDto>> CreateProject([FromBody] CreateProjectDto createProjectDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var project = new Project
            {
                Name = createProjectDto.Name,
                Description = createProjectDto.Description,
                StartDate = createProjectDto.StartDate,
                DeadlineDate = createProjectDto.DeadlineDate,
                ClientName = createProjectDto.ClientName,
                DirectorId = User.GetUserId(),
                StatusId = _context.ProjectStatuses.FirstOrDefault(s => s.Name == "Planning")?.Id ?? 1,
                CreatedAt = DateTime.UtcNow
            };

            _context.Projects.Add(project);
            await _context.SaveChangesAsync();

            return Ok(_mapper.Map<ProjectDto>(project));
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Director,Manager")]
        public IActionResult Update(int id, [FromBody] Project project)
        {
            if (project == null)
                return BadRequest();

            try
            {
                var updatedProject = _projectService.Update(id, project);
                return Ok(updatedProject);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Director")]
        public IActionResult Delete(int id)
        {
            try
            {
                _projectService.Delete(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpGet("director/{directorId}")]
        [Authorize(Roles = "Director")]
        public IActionResult GetByDirector(int directorId)
        {
            var projects = _projectService.GetByDirector(directorId);
            return Ok(projects);
        }

        [HttpGet("manager/{managerId}")]
        [Authorize(Roles = "Manager")]
        public IActionResult GetByManager(int managerId)
        {
            var projects = _projectService.GetByManager(managerId);
            return Ok(projects);
        }

        [HttpGet("developer/{developerId}")]
        [Authorize(Roles = "Developer")]
        public IActionResult GetByDeveloper(int developerId)
        {
            var projects = _projectService.GetByDeveloper(developerId);
            return Ok(projects);
        }

        [HttpPost("{projectId}/assign-manager/{managerId}")]
        [Authorize(Roles = "Director")]
        public IActionResult AssignManager(int projectId, int managerId)
        {
            try
            {
                var project = _projectService.AssignManager(projectId, managerId);
                return Ok(project);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpPost("{projectId}/add-developer/{developerId}")]
        [Authorize(Roles = "Manager")]
        public IActionResult AddDeveloper(int projectId, int developerId)
        {
            try
            {
                var project = _projectService.AddDeveloper(projectId, developerId);
                return Ok(project);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpPost("{projectId}/remove-developer/{developerId}")]
        [Authorize(Roles = "Manager")]
        public IActionResult RemoveDeveloper(int projectId, int developerId)
        {
            try
            {
                var project = _projectService.RemoveDeveloper(projectId, developerId);
                return Ok(project);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpPost("{projectId}/add-technology/{technologyId}")]
        [Authorize(Roles = "Manager")]
        public IActionResult AddTechnology(int projectId, int technologyId)
        {
            try
            {
                var project = _projectService.AddTechnology(projectId, technologyId);
                return Ok(project);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpPost("{projectId}/remove-technology/{technologyId}")]
        [Authorize(Roles = "Manager")]
        public IActionResult RemoveTechnology(int projectId, int technologyId)
        {
            try
            {
                var project = _projectService.RemoveTechnology(projectId, technologyId);
                return Ok(project);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpPost("{projectId}/update-status")]
        [Authorize(Roles = "Manager,Director")]
        public IActionResult UpdateStatus(int projectId, [FromBody] ProjectStatus status)
        {
            try
            {
                var project = _projectService.UpdateStatus(projectId, status);
                return Ok(project);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }
}
