using ReactApp1.Server.Models;

namespace ReactApp1.Server.Interfaces
{
    public interface IProjectService
    {
        IEnumerable<Project> GetAll();
        Project GetById(int id);
        Project Create(Project project);
        Project Update(int id, Project project);
        void Delete(int id);
        IEnumerable<Project> GetByDirector(int directorId);
        IEnumerable<Project> GetByManager(int managerId);
        IEnumerable<Project> GetByDeveloper(int developerId);
        Project AssignManager(int projectId, int managerId);
        Project AddDeveloper(int projectId, int developerId);
        Project RemoveDeveloper(int projectId, int developerId);
        Project AddTechnology(int projectId, int technologyId);
        Project RemoveTechnology(int projectId, int technologyId);
        Project UpdateStatus(int projectId, ProjectStatus status);
    }
}
