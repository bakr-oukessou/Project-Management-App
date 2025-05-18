using ReactApp1.Server.Models;

namespace ReactApp1.Server.Interfaces
{
    public interface ITaskService
    {
        Task<List<ProjectTask>> GetTasksByProjectIdAsync(int projectId);
        Task<List<ProjectTask>> GetTasksByDeveloperIdAsync(int developerId);
        Task<bool> CreateTaskAsync(ProjectTask task);
        Task<bool> UpdateTaskAsync(ProjectTask task);
        Task<bool> DeleteTaskAsync(int id);
        Task<bool> UpdateTaskProgressAsync(int taskId, TaskProgress progress);
    }
}
