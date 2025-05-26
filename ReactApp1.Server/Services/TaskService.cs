using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
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
                .Select(t => new TaskItem
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    PriorityId = t.PriorityId,
                    Priority = t.Priority,
                    StatusId = t.StatusId,
                    Status = t.Status,
                    DueDate = t.DueDate,
                    EndDate = t.EndDate,
                    AssignedToId = t.AssignedToId,
                    AssignedTo = t.AssignedTo,
                    ProjectId = t.ProjectId,
                    Project = t.Project,
                    EstimatedHours = t.EstimatedHours,
                    ActualHours = t.ActualHours,
                    CreatedAt = t.CreatedAt,
                    UpdatedAt = t.UpdatedAt
                })
                .AsNoTracking()
                .ToList();
        }


        public TaskItem GetById(int id)
        {
            var task = _context.Tasks
                .Where(t => t.Id == id)
                .Select(t => new TaskItem
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    PriorityId = t.PriorityId,
                    Priority = t.Priority,
                    StatusId = t.StatusId,
                    Status = t.Status,
                    DueDate = t.DueDate,
                    EndDate = t.EndDate,
                    AssignedToId = t.AssignedToId,
                    AssignedTo = t.AssignedTo,
                    ProjectId = t.ProjectId,
                    Project = t.Project,
                    EstimatedHours = t.EstimatedHours,
                    ActualHours = t.ActualHours,
                    CreatedAt = t.CreatedAt,
                    UpdatedAt = t.UpdatedAt,
                    Comments = t.Comments.Select(c => new TaskComment
                    {
                        Id = c.Id,
                        Content = c.Content,
                        CreatedAt = c.CreatedAt,
                        TaskId = c.TaskId,
                        UserId = c.UserId,
                        User = c.User
                    }).ToList(),
                    ProgressUpdates = t.ProgressUpdates.Select(p => new TaskProgress
                    {
                        Id = p.Id,
                        Description = p.Description,
                        PercentageComplete = p.PercentageComplete,
                        UpdatedAt = p.UpdatedAt,
                        TaskId = p.TaskId,
                        UserId = p.UserId,
                    }).ToList()
                })
                .AsNoTracking()
                .FirstOrDefault();

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
            task.PriorityId = updatedTask.PriorityId;
            task.StatusId = updatedTask.StatusId;
            task.DueDate = updatedTask.DueDate;
            task.EstimatedHours = updatedTask.EstimatedHours;
            task.ActualHours = updatedTask.ActualHours;
            task.UpdatedAt = DateTime.UtcNow;

            // Load the status to check if task is completed
            var completedStatus = _context.TaskStatuses.FirstOrDefault(s => s.Name == "Completed");
            if (completedStatus != null)
            {
                // If task is completed, set completion date
                if (task.StatusId == completedStatus.Id && !task.EndDate.HasValue)
                    task.EndDate = DateTime.UtcNow;

                // If task is not completed, clear completion date
                if (task.StatusId != completedStatus.Id)
                    task.EndDate = null;
            }

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
                .Select(t => new TaskItem
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    PriorityId = t.PriorityId,
                    Priority = t.Priority,
                    StatusId = t.StatusId,
                    Status = t.Status,
                    DueDate = t.DueDate,
                    EndDate = t.EndDate,
                    AssignedToId = t.AssignedToId,
                    AssignedTo = t.AssignedTo,
                    ProjectId = t.ProjectId,
                    Project = t.Project,
                    EstimatedHours = t.EstimatedHours,
                    ActualHours = t.ActualHours,
                    CreatedAt = t.CreatedAt,
                    UpdatedAt = t.UpdatedAt
                })
                .AsNoTracking()
                .ToList();
        }


        public IEnumerable<TaskItem> GetByDeveloper(int developerId)
        {
            return _context.Tasks
                .Where(t => t.AssignedToId == developerId)
                .Select(t => new TaskItem
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    PriorityId = t.PriorityId,
                    Priority = t.Priority,
                    StatusId = t.StatusId,
                    Status = t.Status,
                    DueDate = t.DueDate,
                    EndDate = t.EndDate,
                    AssignedToId = t.AssignedToId,
                    AssignedTo = t.AssignedTo,
                    ProjectId = t.ProjectId,
                    Project = t.Project,
                    EstimatedHours = t.EstimatedHours,
                    ActualHours = t.ActualHours,
                    CreatedAt = t.CreatedAt,
                    UpdatedAt = t.UpdatedAt
                })
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
            task.UpdatedAt = DateTime.UtcNow;
            _context.Tasks.Update(task);
            _context.SaveChanges();

            return GetById(taskId);
        }

        public TaskItem UpdateStatus(int taskId, int statusId)
        {
            var task = _context.Tasks.Find(taskId);
            if (task == null)
                throw new KeyNotFoundException("Task not found");

            var status = _context.TaskStatuses.Find(statusId);
            if (status == null)
                throw new KeyNotFoundException("Task status not found");

            task.StatusId = statusId;
            task.UpdatedAt = DateTime.UtcNow;

            // If task is completed, set completion date
            if (status.Name == "Completed" && !task.EndDate.HasValue)
                task.EndDate = DateTime.UtcNow;

            // If task is not completed, clear completion date
            if (status.Name != "Completed")
                task.EndDate = null;

            _context.Tasks.Update(task);
            _context.SaveChanges();

            return GetById(taskId);
        }

        public bool AddProgressSql(int taskId, int userId, string description, int percentageComplete)
        {
            var connection = _context.Database.GetDbConnection();
            connection.Open();

            using var transaction = connection.BeginTransaction();

            try
            {
                // 1. Vérifie que la tâche existe
                var checkCmd = connection.CreateCommand();
                checkCmd.Transaction = transaction;
                checkCmd.CommandText = "SELECT COUNT(*) FROM Tasks WHERE Id = @TaskId";
                checkCmd.Parameters.Add(new SqlParameter("@TaskId", taskId));
                var exists = (int)checkCmd.ExecuteScalar() > 0;

                if (!exists)
                    throw new KeyNotFoundException("Task not found");

                // 2. Insère dans TaskProgresses
                var insertCmd = connection.CreateCommand();
                insertCmd.Transaction = transaction;
                insertCmd.CommandText = @"
            INSERT INTO TaskProgresses (Description, PercentageComplete, UpdatedAt, TaskId, UserId)
            VALUES (@Description, @PercentageComplete, SYSDATETIME(), @TaskId, @UserId)";
                insertCmd.Parameters.Add(new SqlParameter("@Description", description));
                insertCmd.Parameters.Add(new SqlParameter("@PercentageComplete", percentageComplete));
                insertCmd.Parameters.Add(new SqlParameter("@TaskId", taskId));
                insertCmd.Parameters.Add(new SqlParameter("@UserId", userId));
                insertCmd.ExecuteNonQuery();

                // 3. Récupère les IDs de statuts
                int? completedId = null, inProgressId = null, todoId = null;

                var statusCmd = connection.CreateCommand();
                statusCmd.Transaction = transaction;
                statusCmd.CommandText = "SELECT Id, Name FROM TaskStatuses";
                using (var reader = statusCmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        var name = reader.GetString(1);
                        var id = reader.GetInt32(0);
                        if (name == "Completed") completedId = id;
                        else if (name == "InProgress") inProgressId = id;
                        else if (name == "ToDo") todoId = id;
                    }
                }

                // 4. Récupère le statut actuel de la tâche
                int? currentStatusId = null;
                var currentStatusCmd = connection.CreateCommand();
                currentStatusCmd.Transaction = transaction;
                currentStatusCmd.CommandText = "SELECT StatusId FROM Tasks WHERE Id = @TaskId";
                currentStatusCmd.Parameters.Add(new SqlParameter("@TaskId", taskId));
                currentStatusId = (int?)currentStatusCmd.ExecuteScalar();

                // 5. Logique de mise à jour de statut
                if (percentageComplete == 100 && completedId.HasValue && currentStatusId != completedId)
                {
                    var updateCmd = connection.CreateCommand();
                    updateCmd.Transaction = transaction;
                    updateCmd.CommandText = @"
                UPDATE Tasks 
                SET StatusId = @CompletedId, EndDate = SYSDATETIME(), UpdatedAt = SYSDATETIME()
                WHERE Id = @TaskId";
                    updateCmd.Parameters.Add(new SqlParameter("@CompletedId", completedId));
                    updateCmd.Parameters.Add(new SqlParameter("@TaskId", taskId));
                    updateCmd.ExecuteNonQuery();
                }
                else if (percentageComplete > 0 && percentageComplete < 100 &&
                         todoId.HasValue && inProgressId.HasValue && currentStatusId == todoId)
                {
                    var updateCmd = connection.CreateCommand();
                    updateCmd.Transaction = transaction;
                    updateCmd.CommandText = @"
                UPDATE Tasks 
                SET StatusId = @InProgressId, UpdatedAt = SYSDATETIME()
                WHERE Id = @TaskId";
                    updateCmd.Parameters.Add(new SqlParameter("@InProgressId", inProgressId));
                    updateCmd.Parameters.Add(new SqlParameter("@TaskId", taskId));
                    updateCmd.ExecuteNonQuery();
                }

                transaction.Commit();
                return true;
            }
            catch
            {
                transaction.Rollback();
                throw;
            }
            finally
            {
                connection.Close();
            }
        }
        public TaskItem UpdateProgress(int taskId, TaskProgress progress)
        {
            // Vérifie que la tâche existe
            var taskExists = _context.Tasks.Any(t => t.Id == taskId);
            if (!taskExists)
                throw new KeyNotFoundException("Task not found");

            // Ajoute la mise à jour de progrès
            progress.TaskId = taskId;
            _context.TaskProgresses.Add(progress);
            _context.SaveChanges();

            // Statuts de référence
            var completedStatus = _context.TaskStatuses.FirstOrDefault(s => s.Name == "Completed");
            var inProgressStatus = _context.TaskStatuses.FirstOrDefault(s => s.Name == "InProgress");
            var todoStatus = _context.TaskStatuses.FirstOrDefault(s => s.Name == "ToDo");

            var task = _context.Tasks.FirstOrDefault(t => t.Id == taskId);
            if (task == null) throw new KeyNotFoundException("Task not found");

            // Mise à jour automatique du statut
            if (progress.PercentageComplete == 100 && completedStatus != null && task.StatusId != completedStatus.Id)
            {
                task.StatusId = completedStatus.Id;
                task.EndDate = DateTime.UtcNow;
                task.UpdatedAt = DateTime.UtcNow;
                _context.Tasks.Update(task);
                _context.SaveChanges();
            }
            else if (progress.PercentageComplete > 0 && progress.PercentageComplete < 100 &&
                     todoStatus != null && inProgressStatus != null && task.StatusId == todoStatus.Id)
            {
                task.StatusId = inProgressStatus.Id;
                task.UpdatedAt = DateTime.UtcNow;
                _context.Tasks.Update(task);
                _context.SaveChanges();
            }

            // Projection explicite sans UserId
            return _context.Tasks
                .Where(t => t.Id == taskId)
                .Select(t => new TaskItem
                {
                    Id = t.Id,
                    Title = t.Title,
                    Description = t.Description,
                    PriorityId = t.PriorityId,
                    Priority = t.Priority,
                    StatusId = t.StatusId,
                    Status = t.Status,
                    DueDate = t.DueDate,
                    EndDate = t.EndDate,
                    AssignedToId = t.AssignedToId,
                    AssignedTo = t.AssignedTo,
                    ProjectId = t.ProjectId,
                    Project = t.Project,
                    EstimatedHours = t.EstimatedHours,
                    ActualHours = t.ActualHours,
                    CreatedAt = t.CreatedAt,
                    UpdatedAt = t.UpdatedAt,
                    Comments = t.Comments.Select(c => new TaskComment
                    {
                        Id = c.Id,
                        Content = c.Content,
                        CreatedAt = c.CreatedAt,
                        TaskId = c.TaskId,
                        UserId = c.UserId,
                        User = c.User
                    }).ToList(),
                    ProgressUpdates = t.ProgressUpdates.Select(p => new TaskProgress
                    {
                        Id = p.Id,
                        Description = p.Description,
                        PercentageComplete = p.PercentageComplete,
                        UpdatedAt = p.UpdatedAt,
                        TaskId = p.TaskId,
                        UserId = p.UserId,
                        User = p.User
                    }).ToList()
                })
                .AsNoTracking()
                .FirstOrDefault()!;
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
            return _context.TaskProgresses
                .Where(p => p.TaskId == taskId)
                .Include(p => p.User)
                .OrderByDescending(p => p.UpdatedAt)
                .AsNoTracking()
                .ToList();
        }

        // Helper methods for getting status and priority IDs by name
        public int GetStatusIdByName(string statusName)
        {
            var status = _context.TaskStatuses.FirstOrDefault(s => s.Name == statusName);
            return status?.Id ?? 1; // Default to first status if not found
        }

        public int GetPriorityIdByName(string priorityName)
        {
            var priority = _context.TaskPriorities.FirstOrDefault(p => p.Name == priorityName);
            return priority?.Id ?? 2; // Default to Medium priority if not found
        }

        // Helper method to get all available statuses
        public IEnumerable<TaskStatus> GetAllStatuses()
        {
            return _context.TaskStatuses.AsNoTracking().ToList();
        }

        // Helper method to get all available priorities
        public IEnumerable<TaskPriority> GetAllPriorities()
        {
            return _context.TaskPriorities.AsNoTracking().ToList();
        }
    }
}