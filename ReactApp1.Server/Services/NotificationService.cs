using Microsoft.Data.SqlClient;
using ReactApp1.Server.Interfaces;
using ReactApp1.Server.Models;
using System.Data;

namespace ReactApp1.Server.Services
{
    public class NotificationService : INotificationService
    {
        private readonly ILogger<NotificationService> _logger;
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;

        public NotificationService(
            ILogger<NotificationService> logger,
            IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
            _connectionString = _configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<List<Notification>> GetNotificationsForUserAsync(int userId)
        {
            var notifications = new List<Notification>();

            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    const string query = @"
                        SELECT n.*, p.Name as ProjectName, p.Client as ProjectClient, u.UserName, u.Email
                        FROM Notifications n
                        LEFT JOIN Projects p ON n.ProjectId = p.Id
                        LEFT JOIN Users u ON n.UserId = u.Id
                        WHERE n.UserId = @UserId 
                        ORDER BY n.Date DESC";

                    using (var command = new SqlCommand(query, connection))
                    {
                        command.Parameters.AddWithValue("@UserId", userId);

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                notifications.Add(MapNotificationFromReader(reader));
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving notifications for user {UserId}", userId);
                throw;
            }

            return notifications;
        }

        public async Task CreateNotificationAsync(Notification notification)
        {
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    const string insertQuery = @"
                        INSERT INTO Notifications (UserId, Message, Date, IsRead, ProjectId) 
                        VALUES (@UserId, @Message, @Date, @IsRead, @ProjectId);
                        SELECT SCOPE_IDENTITY();";

                    using (var command = new SqlCommand(insertQuery, connection))
                    {
                        command.Parameters.AddWithValue("@UserId", notification.UserId);
                        command.Parameters.AddWithValue("@Message", notification.Message);
                        command.Parameters.AddWithValue("@Date", notification.Date);
                        command.Parameters.AddWithValue("@IsRead", notification.IsRead);
                        command.Parameters.AddWithValue("@ProjectId",
                            notification.ProjectId.HasValue ? (object)notification.ProjectId.Value : DBNull.Value);

                        // Get the newly created notification ID
                        var notificationId = Convert.ToInt32(await command.ExecuteScalarAsync());
                        notification.Id = notificationId;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating notification for user {UserId}", notification.UserId);
                throw;
            }
        }

        public async Task MarkNotificationAsReadAsync(int notificationId)
        {
            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    const string updateQuery = @"
                        UPDATE Notifications 
                        SET IsRead = 1 
                        WHERE Id = @NotificationId";

                    using (var command = new SqlCommand(updateQuery, connection))
                    {
                        command.Parameters.AddWithValue("@NotificationId", notificationId);
                        await command.ExecuteNonQueryAsync();
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error marking notification {NotificationId} as read", notificationId);
                throw;
            }
        }

        private Notification MapNotificationFromReader(SqlDataReader reader)
        {
            var notification = new Notification
            {
                Id = Convert.ToInt32(reader["Id"]),
                UserId = Convert.ToInt32(reader["UserId"]),
                Message = reader["Message"].ToString(),
                Date = Convert.ToDateTime(reader["Date"]),
                IsRead = Convert.ToBoolean(reader["IsRead"]),
                ProjectId = reader["ProjectId"] != DBNull.Value ? Convert.ToInt32(reader["ProjectId"]) : null
            };

            // Map User if available
            if (!reader.IsDBNull("UserName"))
            {
                notification.User = new User
                {
                    Id = notification.UserId,
                    UserName = reader["UserName"].ToString(),
                    Email = reader["Email"].ToString()
                };
            }

            // Map Project if available
            if (notification.ProjectId.HasValue && !reader.IsDBNull("ProjectName"))
            {
                notification.Project = new Project
                {
                    Id = notification.ProjectId.Value,
                    Name = reader["ProjectName"].ToString(),
                    Client = reader["ProjectClient"] != DBNull.Value ? reader["ProjectClient"].ToString() : null
                };
            }

            return notification;
        }
    }
}
