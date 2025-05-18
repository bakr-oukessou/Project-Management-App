using ReactApp1.Server.Models;

namespace ReactApp1.Server.Interfaces
{
    public interface INotificationService
    {
        Task<List<Notification>> GetNotificationsForUserAsync(int userId);
        Task CreateNotificationAsync(Notification notification);
        Task MarkNotificationAsReadAsync(int notificationId);
    }
}
