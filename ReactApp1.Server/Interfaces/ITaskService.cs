using ReactApp1.Server.Models;
using TaskStatus = ReactApp1.Server.Models.TaskStatus; // Explicit alias to resolve ambiguity

namespace ReactApp1.Server.Interfaces
{
    public interface ITaskService
    {
        IEnumerable<TaskItem> GetAll();
        TaskItem GetById(int id);
        TaskItem Create(TaskItem task);
        TaskItem Update(int id, TaskItem updatedTask);
        void Delete(int id);
        IEnumerable<TaskItem> GetByProject(int projectId);
        IEnumerable<TaskItem> GetByDeveloper(int developerId);
        TaskItem AssignTask(int taskId, int developerId);
        TaskItem UpdateStatus(int taskId, int statusId); // Changed from TaskStatus enum to int
        TaskItem UpdateProgress(int taskId, TaskProgress progress);
        TaskComment AddComment(int taskId, TaskComment comment);
        IEnumerable<TaskComment> GetCommentsByTask(int taskId);
        IEnumerable<TaskProgress> GetProgressByTask(int taskId);

        // Helper methods for working with lookup tables
        int GetStatusIdByName(string statusName);
        int GetPriorityIdByName(string priorityName);
        IEnumerable<TaskStatus> GetAllStatuses();
        IEnumerable<TaskPriority> GetAllPriorities();
    }
}
