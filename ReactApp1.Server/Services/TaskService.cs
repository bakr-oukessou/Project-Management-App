using Microsoft.Data.SqlClient;
using ReactApp1.Server.Interfaces;
using ReactApp1.Server.Models;
using System.Data;

namespace ReactApp1.Server.Services
{
    public class TaskService : ITaskService
    {
        private readonly ILogger<TaskService> _logger;
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;
        private readonly INotificationService _notificationService;

        public TaskService(
            ILogger<TaskService> logger,
            IConfiguration configuration,
            INotificationService notificationService)
        {
            _logger = logger;
            _configuration = configuration;
            _connectionString = _configuration.GetConnectionString("DefaultConnection");
            _notificationService = notificationService;
        }

        public async Task<List<ProjectTask>> GetTasksByProjectIdAsync(int projectId)
        {
            var tasks = new List<ProjectTask>();

            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    const string query = @"
                        SELECT pt.*, d.UserName as DeveloperName, d.Email as DeveloperEmail
                        FROM ProjectTasks pt
                        LEFT JOIN Users d ON pt.DeveloperId = d.Id
                        WHERE pt.ProjectId = @ProjectId";

                    using (var command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@ProjectId", projectId);

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                tasks.Add(MapTaskFromReader(reader));
                            }
                        }
                    }

                    // Load progress for each task
                    foreach (var task in tasks)
                    {
                        task.Progresses = await GetTaskProgressesAsync(task.Id);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving tasks for project {ProjectId}", projectId);
                throw;
            }

            return tasks;
        }

        public async Task<List<ProjectTask>> GetTasksByDeveloperIdAsync(int developerId)
        {
            var tasks = new List<ProjectTask>();

            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    const string query = @"
                        SELECT pt.*, p.Name as ProjectName, p.Client as ProjectClient,
                               d.UserName as DeveloperName, d.Email as DeveloperEmail
                        FROM ProjectTasks pt
                        LEFT JOIN Projects p ON pt.ProjectId = p.Id
                        LEFT JOIN Users d ON pt.DeveloperId = d.Id
                        WHERE pt.DeveloperId = @DeveloperId";

                    using (var command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@DeveloperId", developerId);

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                tasks.Add(MapTaskFromReader(reader));
                            }
                        }
                    }

                    // Load progress for each task
                    foreach (var task in tasks)
                    {
                        task.Progresses = await GetTaskProgressesAsync(task.Id);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving tasks for developer {DeveloperId}", developerId);
                throw;
            }

            return tasks;
        }

        public async Task<bool> CreateTaskAsync(ProjectTask task)
        {
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    using (var transaction = connection.BeginTransaction())

                        try
                        {
                            // Insert the task
                            const string insertQuery = @"
                            INSERT INTO ProjectTasks (Description, DurationInDays, ProjectId, DeveloperId) 
                            VALUES (@Description, @DurationInDays, @ProjectId, @DeveloperId);
                            SELECT SCOPE_IDENTITY();";

                            using (var command = new SqlCommand(insertQuery, connection, transaction))
                            {
                                command.Parameters.AddWithValue("@Description", task.Description);
                                command.Parameters.AddWithValue("@DurationInDays", task.DurationInDays);
                                command.Parameters.AddWithValue("@ProjectId", task.ProjectId);
                                command.Parameters.AddWithValue("@DeveloperId", task.DeveloperId);

                                var taskId = Convert.ToInt32(await command.ExecuteScalarAsync());
                                task.Id = taskId;
                            }

                            // Create initial progress entry
                            const string progressQuery = @"
                            INSERT INTO TaskProgresses (Date, Description, PercentageComplete, TaskId)
                            VALUES (@Date, @Description, @PercentageComplete, @TaskId)";

                            using (var progressCommand = new SqlCommand(progressQuery, connection, transaction))
                            {
                                progressCommand.Parameters.AddWithValue("@Date", DateTime.UtcNow);
                                progressCommand.Parameters.AddWithValue("@Description", "Task created");
                                progressCommand.Parameters.AddWithValue("@PercentageComplete", 0);
                                progressCommand.Parameters.AddWithValue("@TaskId", task.Id);

                                await progressCommand.ExecuteNonQueryAsync();
                            }

                            transaction.Commit();

                            // Create notification for task assignment
                            await CreateTaskAssignmentNotification(task);

                            return true;
                        }
                        catch
                        {
                            transaction.Rollback();
                            throw;
                        }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating task for project {ProjectId}", task.ProjectId);
                return false;
            }
        }

        public async Task<bool> UpdateTaskAsync(ProjectTask task)
        {
            try
            {
                int? previousDeveloperId = null;

                // Get the current assigned developer before updating
                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    using (var command = new SqlCommand("SELECT DeveloperId FROM ProjectTasks WHERE Id = @Id", connection))
                    {
                        command.Parameters.AddWithValue("@Id", task.Id);
                        var result = await command.ExecuteScalarAsync();
                        if (result != null && result != DBNull.Value)
                        {
                            previousDeveloperId = Convert.ToInt32(result);
                        }
                    }
                }

                // Update the task
                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    const string updateQuery = @"
                        UPDATE ProjectTasks 
                        SET Description = @Description, 
                            DurationInDays = @DurationInDays, 
                            DeveloperId = @DeveloperId
                        WHERE Id = @Id";

                    using (var command = new SqlCommand(updateQuery, connection))
                    {
                        command.Parameters.AddWithValue("@Description", task.Description);
                        command.Parameters.AddWithValue("@DurationInDays", task.DurationInDays);
                        command.Parameters.AddWithValue("@DeveloperId", task.DeveloperId);
                        command.Parameters.AddWithValue("@Id", task.Id);

                        await command.ExecuteNonQueryAsync();
                    }
                }

                // If developer changed, create a notification
                if (task.DeveloperId != previousDeveloperId)
                {
                    await CreateTaskAssignmentNotification(task);
                }

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating task {TaskId}", task.Id);
                return false;
            }
        }

        public async Task<bool> DeleteTaskAsync(int id)
        {
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    using (var transaction = connection.BeginTransaction())

                        try
                        {
                            // First delete all progress entries
                            using (var progressCommand = new SqlCommand("DELETE FROM TaskProgresses WHERE TaskId = @TaskId", connection, transaction))
                            {
                                progressCommand.Parameters.AddWithValue("@TaskId", id);
                                await progressCommand.ExecuteNonQueryAsync();
                            }

                            // Then delete the task
                            using (var taskCommand = new SqlCommand("DELETE FROM ProjectTasks WHERE Id = @Id", connection, transaction))
                            {
                                taskCommand.Parameters.AddWithValue("@Id", id);
                                await taskCommand.ExecuteNonQueryAsync();
                            }

                            transaction.Commit();
                            return true;
                        }
                        catch
                        {
                            transaction.Rollback();
                            throw;
                        }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting task {TaskId}", id);
                return false;
            }
        }

        public async Task<bool> UpdateTaskProgressAsync(int taskId, TaskProgress progress)
        {
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    // Insert the new progress entry
                    const string insertProgressQuery = @"
                        INSERT INTO TaskProgresses (Date, Description, PercentageComplete, TaskId)
                        VALUES (@Date, @Description, @PercentageComplete, @TaskId)";

                    using (var command = new SqlCommand(insertProgressQuery, connection))
                    {
                        command.Parameters.AddWithValue("@Date", progress.Date);
                        command.Parameters.AddWithValue("@Description", progress.Description);
                        command.Parameters.AddWithValue("@PercentageComplete", progress.PercentageComplete);
                        command.Parameters.AddWithValue("@TaskId", taskId);

                        await command.ExecuteNonQueryAsync();
                    }

                    // Get task and project information for notification
                    ProjectTask task = await GetTaskByIdAsync(taskId);
                    if (task != null)
                    {
                        await CreateTaskProgressNotification(task, progress);
                    }

                    return true;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating progress for task {TaskId}", taskId);
                return false;
            }
        }

        private async Task<ProjectTask> GetTaskByIdAsync(int taskId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                const string query = @"
                    SELECT pt.*, p.Name as ProjectName, p.ProjectManagerId
                    FROM ProjectTasks pt
                    LEFT JOIN Projects p ON pt.ProjectId = p.Id
                    WHERE pt.Id = @TaskId";

                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@TaskId", taskId);

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            var task = MapTaskFromReader(reader);
                            if (!reader.IsDBNull("ProjectName"))
                            {
                                task.Project = new Project
                                {
                                    Id = task.ProjectId,
                                    Name = reader["ProjectName"].ToString(),
                                    ProjectManagerId = Convert.ToInt32(reader["ProjectManagerId"])
                                };
                            }
                            return task;
                        }
                    }
                }
            }
            return null;
        }

        private async Task<List<TaskProgress>> GetTaskProgressesAsync(int taskId)
        {
            var progresses = new List<TaskProgress>();

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                const string query = @"
                    SELECT * FROM TaskProgresses 
                    WHERE TaskId = @TaskId 
                    ORDER BY Date DESC";

                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@TaskId", taskId);

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            progresses.Add(new TaskProgress
                            {
                                Id = Convert.ToInt32(reader["Id"]),
                                Date = Convert.ToDateTime(reader["Date"]),
                                Description = reader["Description"].ToString(),
                                PercentageComplete = Convert.ToInt32(reader["PercentageComplete"]),
                                TaskId = Convert.ToInt32(reader["TaskId"])
                            });
                        }
                    }
                }
            }

            return progresses;
        }

        private async Task CreateTaskAssignmentNotification(ProjectTask task)
        {
            // Get project details for the notification
            Project project = null;
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                using (var command = new SqlCommand("SELECT Name FROM Projects WHERE Id = @ProjectId", connection))
                {
                    command.Parameters.AddWithValue("@ProjectId", task.ProjectId);
                    var projectName = await command.ExecuteScalarAsync() as string;

                    if (!string.IsNullOrEmpty(projectName))
                    {
                        project = new Project { Id = task.ProjectId, Name = projectName };
                    }
                }
            }

            if (project != null)
            {
                var notification = new Notification
                {
                    UserId = task.DeveloperId,
                    Message = $"You have been assigned to a new task in project '{project.Name}'",
                    Date = DateTime.UtcNow,
                    IsRead = false,
                    ProjectId = task.ProjectId
                };

                await _notificationService.CreateNotificationAsync(notification);
            }
        }

        private async Task CreateTaskProgressNotification(ProjectTask task, TaskProgress progress)
        {
            if (task?.Project != null)
            {
                var notification = new Notification
                {
                    UserId = task.Project.ProjectManagerId,
                    Message = $"Task in project '{task.Project.Name}' is now {progress.PercentageComplete}% complete",
                    Date = DateTime.UtcNow,
                    IsRead = false,
                    ProjectId = task.ProjectId
                };

                await _notificationService.CreateNotificationAsync(notification);
            }
        }

        private ProjectTask MapTaskFromReader(SqlDataReader reader)
        {
            var task = new ProjectTask
            {
                Id = Convert.ToInt32(reader["Id"]),
                Description = reader["Description"].ToString(),
                DurationInDays = Convert.ToInt32(reader["DurationInDays"]),
                ProjectId = Convert.ToInt32(reader["ProjectId"]),
                DeveloperId = Convert.ToInt32(reader["DeveloperId"])
            };

            // Map Developer if available
            if (!reader.IsDBNull("DeveloperName"))
            {
                task.Developer = new Developer
                {
                    Id = task.DeveloperId,
                    UserName = reader["DeveloperName"].ToString(),
                    Email = reader["DeveloperEmail"].ToString()
                };
            }

            // Map Project if available
            if (reader.HasColumn("ProjectName") && !reader.IsDBNull("ProjectName"))
            {
                task.Project = new Project
                {
                    Id = task.ProjectId,
                    Name = reader["ProjectName"].ToString()
                };

                if (reader.HasColumn("ProjectClient") && !reader.IsDBNull("ProjectClient"))
                {
                    task.Project.Client = reader["ProjectClient"].ToString();
                }
            }

            return task;
        }
    }

    // Extension method to check if column exists
    public static class SqlDataReaderExtensions
    {
        public static bool HasColumn(this SqlDataReader reader, string columnName)
        {
            for (int i = 0; i < reader.FieldCount; i++)
            {
                if (reader.GetName(i).Equals(columnName, StringComparison.InvariantCultureIgnoreCase))
                    return true;
            }
            return false;
        }
    }
}
