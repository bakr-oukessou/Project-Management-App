using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server.Interfaces;
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
        public ActionResult<List<TaskItem>> GetTasksByProject(int projectId)
        {
            var tasks = _taskService.GetByProject(projectId);
            return Ok(tasks);
        }

        [HttpGet("developer/{developerId}")]
        public ActionResult<List<TaskItem>> GetTasksByDeveloper(int developerId)
        {
            var tasks = _taskService.GetByDeveloper(developerId);
            return Ok(tasks);
        }

        [HttpPost]
        [Authorize(Roles = "ChefProjet")]
        public ActionResult CreateTask([FromBody] TaskItem task)
        {
            var createdTask = _taskService.Create(task);
            return CreatedAtAction(nameof(GetTasksByProject), new { projectId = task.ProjectId }, createdTask);
        }

        [HttpPost("{taskId}/progress")]
        [Authorize(Roles = "Développeur")]
        public ActionResult UpdateProgress(int taskId, [FromBody] TaskProgress progress)
        {
            progress.TaskId = taskId;
            progress.UpdatedAt = DateTime.Now;

            _taskService.UpdateProgress(taskId, progress);
            return Ok();
        }
    }
}
