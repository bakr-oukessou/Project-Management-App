using ReactApp1.Server.Data;
using ReactApp1.Server.Interfaces;
using ReactApp1.Server.Models;
using Microsoft.EntityFrameworkCore;
namespace ReactApp1.Server.Services
{
    public class TechnologyService : ITechnologyService
    {
        private readonly ApplicationDbContext _context;

        public TechnologyService(ApplicationDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Technology> GetAll()
        {
            return _context.Technologies
                .AsNoTracking()
                .ToList();
        }

        public Technology GetById(int id)
        {
            var technology = _context.Technologies.Find(id);
            if (technology == null)
                throw new KeyNotFoundException("Technology not found");

            return technology;
        }

        public Technology Create(Technology technology)
        {
            _context.Technologies.Add(technology);
            _context.SaveChanges();
            return technology;
        }

        public Technology Update(int id, Technology updatedTechnology)
        {
            var technology = _context.Technologies.Find(id);
            if (technology == null)
                throw new KeyNotFoundException("Technology not found");

            technology.Name = updatedTechnology.Name;
            technology.Description = updatedTechnology.Description;
            technology.Category = updatedTechnology.Category;

            _context.Technologies.Update(technology);
            _context.SaveChanges();

            return technology;
        }

        public void Delete(int id)
        {
            var technology = _context.Technologies.Find(id);
            if (technology == null)
                throw new KeyNotFoundException("Technology not found");

            _context.Technologies.Remove(technology);
            _context.SaveChanges();
        }

        public IEnumerable<Technology> GetByProject(int projectId)
        {
            return _context.ProjectTechnologies
                .Where(pt => pt.ProjectId == projectId)
                .Include(pt => pt.Technology)
                .Select(pt => pt.Technology)
                .AsNoTracking()
                .ToList();
        }
    }
}
