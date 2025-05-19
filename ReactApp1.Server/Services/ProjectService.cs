using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Data;
using ReactApp1.Server.Interfaces;
using ReactApp1.Server.Models;

namespace ReactApp1.Server.Services
{
    public class ProjectService : IProjectService
    {
        private readonly ApplicationDbContext _context;

        public ProjectService(ApplicationDbContext context)
        {
            _context = context;
        }
        
        public async Task<IEnumerable<Project>> GetProjectsForUserAsync(int userId, string role)
        {
            switch (role)
            {
                case "Director":
                    return await GetProjectsByDirectorIdAsync(userId);
                case "Manager":
                    return await GetProjectsByManagerIdAsync(userId);
                case "Developer":
                    return await GetProjectsByDeveloperIdAsync(userId);
                default:
                    return new List<Project>();
            }
        }

        public IEnumerable<Project> GetAll()
        {
            return _context.Projects
                .Include(p => p.Manager)
                .Include(p => p.Director)
                .Include(p => p.Developers)
                    .ThenInclude(pd => pd.Developer)
                .Include(p => p.Technologies)
                    .ThenInclude(pt => pt.Technology)
                .AsNoTracking()
                .ToList();
        }

        public Project GetById(int id)
        {
            var project = _context.Projects
                .Include(p => p.Manager)
                .Include(p => p.Director)
                .Include(p => p.Developers)
                    .ThenInclude(pd => pd.Developer)
                .Include(p => p.Technologies)
                    .ThenInclude(pt => pt.Technology)
                .Include(p => p.Tasks)
                .FirstOrDefault(p => p.Id == id);

            if (project == null)
                throw new KeyNotFoundException("Project not found");

            return project;
        }

        public Project Create(Project project)
        {
            _context.Projects.Add(project);
            _context.SaveChanges();
            return project;
        }

        public Project Update(int id, Project updatedProject)
        {
            var project = _context.Projects.Find(id);
            if (project == null)
                throw new KeyNotFoundException("Project not found");

            // Update project properties
            project.Name = updatedProject.Name;
            project.Description = updatedProject.Description;
            project.StartDate = updatedProject.StartDate;
            project.DeadlineDate = updatedProject.DeadlineDate;
            project.Status = updatedProject.Status;

            if (updatedProject.CompletionDate.HasValue)
                project.CompletionDate = updatedProject.CompletionDate;

            _context.Projects.Update(project);
            _context.SaveChanges();

            return GetById(id); // Return the updated project with all related data
        }

        public void Delete(int id)
        {
            var project = _context.Projects.Find(id);
            if (project == null)
                throw new KeyNotFoundException("Project not found");

            _context.Projects.Remove(project);
            _context.SaveChanges();
        }
        public async Task<IEnumerable<Project>> GetProjectsByDirectorIdAsync(int directorId)
        {
            return await _context.Projects
                .Include(p => p.Manager)
                .Where(p => p.DirectorId == directorId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Project>> GetProjectsByManagerIdAsync(int managerId)
        {
            return await _context.Projects
                .Include(p => p.Director)
                .Where(p => p.ManagerId == managerId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Project>> GetProjectsByDeveloperIdAsync(int developerId)
        {
            return await _context.Projects
                .Include(p => p.Director)
                .Include(p => p.Manager)
                .Where(p => p.Developers.Any(pu => pu.DeveloperId == developerId))
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }
        public IEnumerable<Project> GetByDirector(int directorId)
        {
            return _context.Projects
                .Where(p => p.DirectorId == directorId)
                .Include(p => p.Manager)
                .Include(p => p.Developers)
                    .ThenInclude(pd => pd.Developer)
                .Include(p => p.Technologies)
                    .ThenInclude(pt => pt.Technology)
                .AsNoTracking()
                .ToList();
        }

        public IEnumerable<Project> GetByManager(int managerId)
        {
            return _context.Projects
                .Where(p => p.ManagerId == managerId)
                .Include(p => p.Director)
                .Include(p => p.Developers)
                    .ThenInclude(pd => pd.Developer)
                .Include(p => p.Technologies)
                    .ThenInclude(pt => pt.Technology)
                .AsNoTracking()
                .ToList();
        }

        public IEnumerable<Project> GetByDeveloper(int developerId)
        {
            return _context.ProjectDevelopers
                .Where(pd => pd.DeveloperId == developerId)
                .Include(pd => pd.Project)
                    .ThenInclude(p => p.Manager)
                .Include(pd => pd.Project)
                    .ThenInclude(p => p.Director)
                .Include(pd => pd.Project)
                    .ThenInclude(p => p.Technologies)
                        .ThenInclude(pt => pt.Technology)
                .Select(pd => pd.Project)
                .AsNoTracking()
                .ToList();
        }

        public Project AssignManager(int projectId, int managerId)
        {
            var project = _context.Projects.Find(projectId);
            if (project == null)
                throw new KeyNotFoundException("Project not found");

            var manager = _context.Users.FirstOrDefault(u => u.Id == managerId && u.Role == UserRole.Manager);
            if (manager == null)
                throw new KeyNotFoundException("Manager not found");

            project.ManagerId = managerId;
            _context.Projects.Update(project);
            _context.SaveChanges();

            return GetById(projectId);
        }

        public Project AddDeveloper(int projectId, int developerId)
        {
            var project = _context.Projects.Find(projectId);
            if (project == null)
                throw new KeyNotFoundException("Project not found");

            var developer = _context.Users.FirstOrDefault(u => u.Id == developerId && u.Role == UserRole.Developer);
            if (developer == null)
                throw new KeyNotFoundException("Developer not found");

            // Check if developer is already assigned to the project
            var existingAssignment = _context.ProjectDevelopers
                .FirstOrDefault(pd => pd.ProjectId == projectId && pd.DeveloperId == developerId);

            if (existingAssignment != null)
                throw new ApplicationException("Developer is already assigned to this project");

            var projectDeveloper = new ProjectDeveloper
            {
                ProjectId = projectId,
                DeveloperId = developerId,
                AssignedDate = DateTime.UtcNow
            };

            _context.ProjectDevelopers.Add(projectDeveloper);
            _context.SaveChanges();

            return GetById(projectId);
        }

        public Project RemoveDeveloper(int projectId, int developerId)
        {
            var projectDeveloper = _context.ProjectDevelopers
                .FirstOrDefault(pd => pd.ProjectId == projectId && pd.DeveloperId == developerId);

            if (projectDeveloper == null)
                throw new KeyNotFoundException("Developer is not assigned to this project");

            _context.ProjectDevelopers.Remove(projectDeveloper);
            _context.SaveChanges();

            return GetById(projectId);
        }

        public Project AddTechnology(int projectId, int technologyId)
        {
            var project = _context.Projects.Find(projectId);
            if (project == null)
                throw new KeyNotFoundException("Project not found");

            var technology = _context.Technologies.Find(technologyId);
            if (technology == null)
                throw new KeyNotFoundException("Technology not found");

            // Check if technology is already added to the project
            var existingTech = _context.ProjectTechnologies
                .FirstOrDefault(pt => pt.ProjectId == projectId && pt.TechnologyId == technologyId);

            if (existingTech != null)
                throw new ApplicationException("Technology is already added to this project");

            var projectTechnology = new ProjectTechnology
            {
                ProjectId = projectId,
                TechnologyId = technologyId
            };

            _context.ProjectTechnologies.Add(projectTechnology);
            _context.SaveChanges();

            return GetById(projectId);
        }

        public Project RemoveTechnology(int projectId, int technologyId)
        {
            var projectTechnology = _context.ProjectTechnologies
                .FirstOrDefault(pt => pt.ProjectId == projectId && pt.TechnologyId == technologyId);

            if (projectTechnology == null)
                throw new KeyNotFoundException("Technology is not added to this project");

            _context.ProjectTechnologies.Remove(projectTechnology);
            _context.SaveChanges();

            return GetById(projectId);
        }

        public Project UpdateStatus(int projectId, ProjectStatus status)
        {
            var project = _context.Projects.Find(projectId);
            if (project == null)
                throw new KeyNotFoundException("Project not found");

            project.Status = status;

            // If project is completed, set completion date
            if (status == ProjectStatus.Completed && !project.CompletionDate.HasValue)
                project.CompletionDate = DateTime.UtcNow;

            // If project is not completed, clear completion date
            if (status != ProjectStatus.Completed)
                project.CompletionDate = null;

            _context.Projects.Update(project);
            _context.SaveChanges();

            return GetById(projectId);
        }
    }
}
