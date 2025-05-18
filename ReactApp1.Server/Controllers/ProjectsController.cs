using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server.Interfaces;
using ReactApp1.Server.Models;

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
        [Authorize(Roles = "Directeur,ChefProjet")]
        public async Task<ActionResult<List<Project>>> GetProjects()
        {
            var projects = await _projectService.GetAllProjectsAsync();
            return Ok(projects);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Project>> GetProject(int id)
        {
            var project = await _projectService.GetProjectByIdAsync(id);
            if (project == null) return NotFound();

            return Ok(project);
        }

        [HttpPost]
        [Authorize(Roles = "Directeur")]
        public async Task<ActionResult> CreateProject([FromBody] Project project)
        {
            // Vérifie l'unicité du nom
            if (!await _projectService.IsProjectNameUniqueAsync(project.Name))
            {
                return BadRequest(new { message = "Un projet avec ce nom existe déjà" });
            }

            await _projectService.CreateProjectAsync(project);

            // Notification au chef de projet
            await _projectService.NotifyProjectManagerAsync(project.Id, project.ProjectManagerId);

            return CreatedAtAction(nameof(GetProject), new { id = project.Id }, project);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Directeur,ChefProjet")]
        public async Task<ActionResult> UpdateProject(int id, [FromBody] Project project)
        {
            if (id != project.Id) return BadRequest();

            // Vérifie l'unicité du nom
            if (!await _projectService.IsProjectNameUniqueAsync(project.Name, project.Id))
            {
                return BadRequest(new { message = "Un projet avec ce nom existe déjà" });
            }

            var result = await _projectService.UpdateProjectAsync(project);
            if (!result) return NotFound();

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Directeur")]
        public async Task<ActionResult> DeleteProject(int id)
        {
            var result = await _projectService.DeleteProjectAsync(id);
            if (!result) return NotFound();

            return NoContent();
        }

        [HttpPost("{id}/technologies")]
        [Authorize(Roles = "ChefProjet")]
        public async Task<ActionResult> AddTechnologies(int id, [FromBody] AddTechnologiesDto dto)
        {
            var project = await _projectService.GetProjectByIdAsync(id);
            if (project == null) return NotFound();

            project.Technologies = dto.Technologies;
            project.Methodology = dto.Methodology;

            await _projectService.UpdateProjectAsync(project);

            // Récupérer les développeurs ayant les compétences requises
            var technologyIds = dto.Technologies.Select(t => t.Id).ToList();
            var developers = await _projectService.GetDevelopersByTechnologiesAsync(technologyIds);

            return Ok(new
            {
                project,
                availableDevelopers = developers
            });
        }

        [HttpPost("{id}/team")]
        [Authorize(Roles = "ChefProjet")]
        public async Task<ActionResult> AssignTeam(int id, [FromBody] AssignTeamDto dto)
        {
            await _projectService.AssignTeamToProjectAsync(id, dto.DeveloperIds);

            // Si une date de réunion est fournie, l'enregistrer
            if (dto.MeetingDate.HasValue)
            {
                await _projectService.ScheduleTeamMeetingAsync(id, dto.MeetingDate.Value);

                // Notifier les membres de l'équipe
                await _projectService.NotifyTeamMembersAsync(id);
            }

            return Ok();
        }
    }

    public class AddTechnologiesDto
    {
        public List<Technology> Technologies { get; set; }
        public string Methodology { get; set; }
    }

    public class AssignTeamDto
    {
        public List<int> DeveloperIds { get; set; }
        public DateTime? MeetingDate { get; set; }
    }
}
