using ReactApp1.Server.Models;
using TaskStatus = ReactApp1.Server.Models.TaskStatus; // Explicit alias to resolve ambiguity

namespace ReactApp1.Server.Interfaces
{
    public interface ITaskService
    {
        IEnumerable<TaskItem> GetAll();
        TaskItem GetById(int id);
        TaskItem Create(TaskItem task);
        TaskItem Update(int id, TaskItem task);
        void Delete(int id);
        IEnumerable<TaskItem> GetByProject(int projectId);
        IEnumerable<TaskItem> GetByDeveloper(int developerId);
        TaskItem AssignTask(int taskId, int developerId);
        TaskItem UpdateStatus(int taskId, TaskStatus status);
        TaskItem UpdateProgress(int taskId, TaskProgress progress);
        TaskComment AddComment(int taskId, TaskComment comment);
        IEnumerable<TaskComment> GetCommentsByTask(int taskId);
        IEnumerable<TaskProgress> GetProgressByTask(int taskId);
    }
}
