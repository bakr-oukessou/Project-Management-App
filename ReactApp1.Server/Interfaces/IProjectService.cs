using ReactApp1.Server.Models;

namespace ReactApp1.Server.Interfaces
{
    public interface IProjectService
    {
        Task<List<Project>> GetAllProjectsAsync();
        Task<Project> GetProjectByIdAsync(int id);
        Task<bool> CreateProjectAsync(Project project);
        Task<bool> UpdateProjectAsync(Project project);
        Task<bool> DeleteProjectAsync(int id);
        Task<bool> IsProjectNameUniqueAsync(string name, int? excludeId = null);
        Task NotifyProjectManagerAsync(int projectId, int managerId);
        Task<List<Developer>> GetDevelopersByTechnologiesAsync(List<int> technologyIds);
        Task AssignTeamToProjectAsync(int projectId, List<int> developerIds);
        Task<bool> ScheduleTeamMeetingAsync(int projectId, DateTime meetingDate);
        Task NotifyTeamMembersAsync(int projectId);
    }
}
