using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server.Models;

namespace ReactApp1.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _taskService;

        public TasksController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        [HttpGet("project/{projectId}")]
        public async Task<ActionResult<List<ProjectTask>>> GetTasksByProject(int projectId)
        {
            var tasks = await _taskService.GetTasksByProjectIdAsync(projectId);
            return Ok(tasks);
        }

        [HttpGet("developer/{developerId}")]
        public async Task<ActionResult<List<ProjectTask>>> GetTasksByDeveloper(int developerId)
        {
            var tasks = await _taskService.GetTasksByDeveloperIdAsync(developerId);
            return Ok(tasks);
        }

        [HttpPost]
        [Authorize(Roles = "ChefProjet")]
        public async Task<ActionResult> CreateTask([FromBody] ProjectTask task)
        {
            await _taskService.CreateTaskAsync(task);
            return CreatedAtAction(nameof(GetTasksByProject), new { projectId = task.ProjectId }, task);
        }

        [HttpPost("{taskId}/progress")]
        [Authorize(Roles = "Développeur")]
        public async Task<ActionResult> UpdateProgress(int taskId, [FromBody] TaskProgress progress)
        {
            progress.TaskId = taskId;
            progress.Date = DateTime.Now;

            await _taskService.UpdateTaskProgressAsync(taskId, progress);
            return Ok();
        }
    }
}
