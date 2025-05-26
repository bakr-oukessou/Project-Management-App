using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server.Interfaces;
using ReactApp1.Server.Models;
using ReactApp1.Server.Models.DTO;
using System.Security.Claims;
using TaskStatus = ReactApp1.Server.Models.TaskStatus;

namespace ReactApp1.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Require authentication globally
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _taskService;

        public TasksController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        // Accessible to Director and Manager
        [HttpGet]
        [Authorize(Roles = "Director,Manager,Developer")]
        public ActionResult<IEnumerable<TaskItem>> GetAll()
        {
            var tasks = _taskService.GetAll();
            return Ok(tasks);
        }

        // Accessible to all roles
        [HttpGet("{id}")]
        public ActionResult<TaskItem> GetById(int id)
        {
            try
            {
                var task = _taskService.GetById(id);
                return Ok(task);
            }
            catch (KeyNotFoundException e)
            {
                return NotFound(e.Message);
            }
        }

        [HttpGet("my")]
        [Authorize(Roles = "Developer")]
        public ActionResult<IEnumerable<TaskItem>> GetMyTasks()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var id = int.Parse(userId); // assuming int-based user IDs
            var tasks = _taskService.GetByDeveloper(id);
            return Ok(tasks);
        }

        // Create Task (Director, Manager)
        [HttpPost]
        [Authorize(Roles = "Director,Manager")]
        public ActionResult<TaskItem> Create([FromBody] TaskItem task)
        {
            var createdTask = _taskService.Create(task);
            return CreatedAtAction(nameof(GetById), new { id = createdTask.Id }, createdTask);
        }

        // Update Task (Director, Manager)
        [HttpPut("{id}")]
        [Authorize(Roles = "Director,Manager")]
        public ActionResult<TaskItem> Update(int id, [FromBody] TaskItem task)
        {
            try
            {
                var updatedTask = _taskService.Update(id, task);
                return Ok(updatedTask);
            }
            catch (KeyNotFoundException e)
            {
                return NotFound(e.Message);
            }
        }

        [HttpPost("{taskId}/progress-sql")]
        [Authorize(Roles = "Developer")]
        public IActionResult AddProgressRawSql(int taskId, [FromBody] TaskProgressDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            try
            {
                _taskService.AddProgressSql(taskId, int.Parse(userId), dto.Description, dto.PercentageComplete);
                return Ok(new { message = "Progress added using SQL" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // Delete Task (Director only)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Director")]
        public IActionResult Delete(int id)
        {
            try
            {
                _taskService.Delete(id);
                return NoContent();
            }
            catch (KeyNotFoundException e)
            {
                return NotFound(e.Message);
            }
        }

        // Project-level view (Director, Manager)
        [HttpGet("by-project/{projectId}")]
        [Authorize(Roles = "Director,Manager,Developer")]
        public ActionResult<IEnumerable<TaskItem>> GetByProject(int projectId)
        {
            var tasks = _taskService.GetByProject(projectId);
            return Ok(tasks);
        }

        // Developer task list
        [HttpGet("by-developer/{developerId}")]
        [Authorize(Roles = "Developer")]
        public ActionResult<IEnumerable<TaskItem>> GetByDeveloper(int developerId)
        {
            var tasks = _taskService.GetByDeveloper(developerId);
            return Ok(tasks);
        }

        // Manager assigns developer
        [HttpPut("assign/{taskId}/developer/{developerId}")]
        [Authorize(Roles = "Manager")]
        public ActionResult<TaskItem> AssignTask(int taskId, int developerId)
        {
            try
            {
                var updatedTask = _taskService.AssignTask(taskId, developerId);
                return Ok(updatedTask);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        // Update task status (Developer can change their own, Manager can change all)
        [HttpPut("update-status/{taskId}/to/{statusId}")]
        [Authorize(Roles = "Developer,Manager")]
        public ActionResult<TaskItem> UpdateStatus(int taskId, int statusId)
        {
            try
            {
                var updatedTask = _taskService.UpdateStatus(taskId, statusId);
                return Ok(updatedTask);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        // All can comment
        [HttpPost("{taskId}/comments")]
        public ActionResult<TaskComment> AddComment(int taskId, [FromBody] TaskComment comment)
        {
            try
            {
                var createdComment = _taskService.AddComment(taskId, comment);
                return Ok(createdComment);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        // All can view comments
        [HttpGet("{taskId}/comments")]
        public ActionResult<IEnumerable<TaskComment>> GetCommentsByTask(int taskId)
        {
            var comments = _taskService.GetCommentsByTask(taskId);
            return Ok(comments);
        }

        // All can view progress
        [HttpGet("{taskId}/progress")]
        public ActionResult<IEnumerable<TaskProgress>> GetProgressByTask(int taskId)
        {
            var progress = _taskService.GetProgressByTask(taskId);
            return Ok(progress);
        }

        // Anyone can fetch status/priorities
        [HttpGet("statuses")]
        public ActionResult<IEnumerable<TaskStatus>> GetAllStatuses()
        {
            return Ok(_taskService.GetAllStatuses());
        }

        [HttpGet("priorities")]
        public ActionResult<IEnumerable<TaskPriority>> GetAllPriorities()
        {
            return Ok(_taskService.GetAllPriorities());
        }
    }
}
