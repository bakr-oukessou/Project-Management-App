using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Interfaces;
using ReactApp1.Server.Models;

namespace ReactApp1.Server.Services
{
    public class ProjectService : IProjectService
    {
        private readonly ApplicationDbContext _context;
        private readonly INotificationService _notificationService;

        public ProjectService(ApplicationDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }

        public async Task<List<Project>> GetAllProjectsAsync()
        {
            return await _context.Projects
                .Include(p => p.ProjectManager)
                .ToListAsync();
        }

        public async Task<Project> GetProjectByIdAsync(int id)
        {
#pragma warning disable CS8603 // Possible null reference return.
            return await _context.Projects
                .Include(p => p.ProjectManager)
                .Include(p => p.Technologies)
                .Include(p => p.Team)
                .Include(p => p.Tasks)
                    .ThenInclude(t => t.Developer)
                .Include(p => p.Tasks)
                    .ThenInclude(t => t.Progresses)
                .FirstOrDefaultAsync(p => p.Id == id);
#pragma warning restore CS8603 // Possible null reference return.
        }

        public async Task<bool> CreateProjectAsync(Project project)
        {
            _context.Projects.Add(project);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateProjectAsync(Project project)
        {
            _context.Entry(project).State = EntityState.Modified;
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteProjectAsync(int id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null) return false;

            _context.Projects.Remove(project);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> IsProjectNameUniqueAsync(string name, int? excludeId = null)
        {
            if (excludeId.HasValue)
                return !await _context.Projects.AnyAsync(p => p.Name == name && p.Id != excludeId);

            return !await _context.Projects.AnyAsync(p => p.Name == name);
        }

        public async Task NotifyProjectManagerAsync(int projectId, int managerId)
        {
            var project = await _context.Projects.FindAsync(projectId);
            if (project != null)
            {
                var notification = new Notification
                {
                    UserId = managerId,
                    ProjectId = projectId,
                    Message = $"Vous avez été assigné comme chef de projet pour '{project.Name}'",
                    Date = DateTime.Now,
                    IsRead = false
                };

                await _notificationService.CreateNotificationAsync(notification);
            }
        }

        public async Task<List<Developer>> GetDevelopersByTechnologiesAsync(List<int> technologyIds)
        {
            return await _context.Developers
                .Include(d => d.Technologies)
                .Where(d => d.Technologies.Any(t => technologyIds.Contains(t.Id)))
                .ToListAsync();
        }

        public async Task AssignTeamToProjectAsync(int projectId, List<int> developerIds)
        {
            var project = await _context.Projects
                .Include(p => p.Team)
                .FirstOrDefaultAsync(p => p.Id == projectId);

            if (project == null) return;

            // Clear current team and add new members
            project.Team.Clear();
            foreach (var developerId in developerIds)
            {
                var developer = await _context.Developers.FindAsync(developerId);
                if (developer != null)
                {
                    project.Team.Add(developer);
                }
            }

            await _context.SaveChangesAsync();
        }

        public async Task<bool> ScheduleTeamMeetingAsync(int projectId, DateTime meetingDate)
        {
            var project = await _context.Projects.FindAsync(projectId);
            if (project == null) return false;

            project.TeamMeetingDate = meetingDate;
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task NotifyTeamMembersAsync(int projectId)
        {
            var project = await _context.Projects
                .Include(p => p.Team)
                .FirstOrDefaultAsync(p => p.Id == projectId);

            if (project == null || !project.TeamMeetingDate.HasValue) return;

            foreach (var developer in project.Team)
            {
                var notification = new Notification
                {
                    UserId = developer.Id,
                    ProjectId = projectId,
                    Message = $"Vous avez été affecté au projet '{project.Name}'. Une réunion est prévue le {project.TeamMeetingDate.Value.ToString("dd/MM/yyyy HH:mm")}",
                    Date = DateTime.Now,
                    IsRead = false
                };

                await _notificationService.CreateNotificationAsync(notification);
            }
        }
    }
}
