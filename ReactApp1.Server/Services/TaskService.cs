using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore; // Add this using directive

// Rest of the file remains unchanged
using ReactApp1.Server.Data;
using ReactApp1.Server.Interfaces;
using ReactApp1.Server.Models;
using System.Data;
using TaskStatus = ReactApp1.Server.Models.TaskStatus;

namespace ReactApp1.Server.Services
{
    public class TaskService : ITaskService
    {
        private readonly ApplicationDbContext _context;

        public TaskService(ApplicationDbContext context)
        {
            _context = context;
        }

        public IEnumerable<TaskItem> GetAll()
        {
            return _context.Tasks
                .Include(t => t.AssignedTo)
                .Include(t => t.Project)
                .AsNoTracking()
                .ToList();
        }

        public TaskItem GetById(int id)
        {
            var task = _context.Tasks
                .Include(t => t.AssignedTo)
                .Include(t => t.Project)
                .Include(t => t.Comments)
                    .ThenInclude(c => c.User)
                .Include(t => t.ProgressUpdates)
                    .ThenInclude(p => p.User)
                .FirstOrDefault(t => t.Id == id);

            if (task == null)
                throw new KeyNotFoundException("Task not found");

            return task;
        }

        public TaskItem Create(TaskItem task)
        {
            _context.Tasks.Add(task);
            _context.SaveChanges();
            return GetById(task.Id);
        }

        public TaskItem Update(int id, TaskItem updatedTask)
        {
            var task = _context.Tasks.Find(id);
            if (task == null)
                throw new KeyNotFoundException("Task not found");

            // Update task properties
            task.Title = updatedTask.Title;
            task.Description = updatedTask.Description;
            task.Priority = updatedTask.Priority;
            task.Status = updatedTask.Status;
            task.DueDate = updatedTask.DueDate;
            task.EstimatedHours = updatedTask.EstimatedHours;
            task.ActualHours = updatedTask.ActualHours;

            // If task is completed, set completion date
            if (task.Status == TaskStatus.Completed && !task.CompletionDate.HasValue)
                task.CompletionDate = DateTime.UtcNow;

            // If task is not completed, clear completion date
            if (task.Status != TaskStatus.Completed)
                task.CompletionDate = null;

            _context.Tasks.Update(task);
            _context.SaveChanges();

            return GetById(id);
        }

        public void Delete(int id)
        {
            var task = _context.Tasks.Find(id);
            if (task == null)
                throw new KeyNotFoundException("Task not found");

            _context.Tasks.Remove(task);
            _context.SaveChanges();
        }

        public IEnumerable<TaskItem> GetByProject(int projectId)
        {
            return _context.Tasks
                .Where(t => t.ProjectId == projectId)
                .Include(t => t.AssignedTo)
                .AsNoTracking()
                .ToList();
        }

        public IEnumerable<TaskItem> GetByDeveloper(int developerId)
        {
            return _context.Tasks
                .Where(t => t.AssignedToId == developerId)
                .Include(t => t.Project)
                .AsNoTracking()
                .ToList();
        }

        public TaskItem AssignTask(int taskId, int developerId)
        {
            var task = _context.Tasks.Find(taskId);
            if (task == null)
                throw new KeyNotFoundException("Task not found");

            var developer = _context.Users.FirstOrDefault(u => u.Id == developerId && u.Role == UserRole.Developer);
            if (developer == null)
                throw new KeyNotFoundException("Developer not found");

            // Check if developer is assigned to the project
            var isAssignedToProject = _context.ProjectDevelopers
                .Any(pd => pd.ProjectId == task.ProjectId && pd.DeveloperId == developerId);

            if (!isAssignedToProject)
                throw new ApplicationException("Developer is not assigned to this project");

            task.AssignedToId = developerId;
            _context.Tasks.Update(task);
            _context.SaveChanges();

            return GetById(taskId);
        }

        public TaskItem UpdateStatus(int taskId, TaskStatus status)
        {
            var task = _context.Tasks.Find(taskId);
            if (task == null)
                throw new KeyNotFoundException("Task not found");

            task.Status = status;

            // If task is completed, set completion date
            if (status == TaskStatus.Completed && !task.CompletionDate.HasValue)
                task.CompletionDate = DateTime.UtcNow;

            // If task is not completed, clear completion date
            if (status != TaskStatus.Completed)
                task.CompletionDate = null;

            _context.Tasks.Update(task);
            _context.SaveChanges();

            return GetById(taskId);
        }

        public TaskItem UpdateProgress(int taskId, TaskProgress progress)
        {
            var task = _context.Tasks.Find(taskId);
            if (task == null)
                throw new KeyNotFoundException("Task not found");

            // Add progress update
            progress.TaskId = taskId;
            _context.TaskProgress.Add(progress);
            _context.SaveChanges();

            // Update task status based on progress
            if (progress.PercentageComplete == 100 && task.Status != TaskStatus.Completed)
            {
                task.Status = TaskStatus.Completed;
                task.CompletionDate = DateTime.UtcNow;
                _context.Tasks.Update(task);
                _context.SaveChanges();
            }
            else if (progress.PercentageComplete > 0 && progress.PercentageComplete < 100 && task.Status == TaskStatus.ToDo)
            {
                task.Status = TaskStatus.InProgress;
                _context.Tasks.Update(task);
                _context.SaveChanges();
            }

            return GetById(taskId);
        }

        public TaskComment AddComment(int taskId, TaskComment comment)
        {
            var task = _context.Tasks.Find(taskId);
            if (task == null)
                throw new KeyNotFoundException("Task not found");

            comment.TaskId = taskId;
            _context.TaskComments.Add(comment);
            _context.SaveChanges();

            return comment;
        }

        public IEnumerable<TaskComment> GetCommentsByTask(int taskId)
        {
            return _context.TaskComments
                .Where(c => c.TaskId == taskId)
                .Include(c => c.User)
                .OrderByDescending(c => c.CreatedAt)
                .AsNoTracking()
                .ToList();
        }

        public IEnumerable<TaskProgress> GetProgressByTask(int taskId)
        {
            return _context.TaskProgress
                .Where(p => p.TaskId == taskId)
                .Include(p => p.User)
                .OrderByDescending(p => p.UpdatedAt)
                .AsNoTracking()
                .ToList();
        }
    }
}
