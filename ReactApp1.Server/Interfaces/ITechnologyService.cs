using ReactApp1.Server.Models;

namespace ReactApp1.Server.Interfaces
{
    public interface ITechnologyService
    {
        IEnumerable<Technology> GetAll();
        Technology GetById(int id);
        Technology Create(Technology technology);
        Technology Update(int id, Technology technology);
        void Delete(int id);
        IEnumerable<Technology> GetByProject(int projectId);
    }
}
