using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Data;
using ReactApp1.Server.Interfaces;
using ReactApp1.Server.Models;

namespace ReactApp1.Server.Services
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;

        public UserService(ApplicationDbContext context)
        {
            _context = context;
        }

        public IEnumerable<User> GetAll()
        {
            return _context.Users
                .AsNoTracking()
                .ToList();
        }

        public User GetById(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null)
                throw new KeyNotFoundException("User not found");

            return user;
        }

        public User UpdateProfile(int id, UpdateProfileRequest model)
        {
            var user = _context.Users.Find(id);
            if (user == null)
                throw new KeyNotFoundException("User not found");

            // Update user properties if provided
            if (!string.IsNullOrEmpty(model.FirstName))
                user.FirstName = model.FirstName;

            if (!string.IsNullOrEmpty(model.LastName))
                user.LastName = model.LastName;

            if (!string.IsNullOrEmpty(model.Email))
            {
                // Check if email is already taken by another user
                if (_context.Users.Any(u => u.Email == model.Email && u.Id != id))
                    throw new ApplicationException($"Email '{model.Email}' is already registered");

                user.Email = model.Email;
            }

            if (!string.IsNullOrEmpty(model.Bio))
                user.Bio = model.Bio;

            if (!string.IsNullOrEmpty(model.ProfilePicture))
                user.ProfilePicture = model.ProfilePicture;

            _context.Users.Update(user);
            _context.SaveChanges();

            return user;
        }

        public IEnumerable<User> GetByRole(UserRole role)
        {
            return _context.Users
                .Where(u => u.Role == role)
                .AsNoTracking()
                .ToList();
        }

        public IEnumerable<User> GetDevelopersByProject(int projectId)
        {
            return _context.ProjectDevelopers
                .Where(pd => pd.ProjectId == projectId)
                .Include(pd => pd.Developer)
                .Select(pd => pd.Developer)
                .AsNoTracking()
                .ToList();
        }

        public IEnumerable<User> GetAvailableDevelopers(int projectId)
        {
            var assignedDeveloperIds = _context.ProjectDevelopers
                .Where(pd => pd.ProjectId == projectId)
                .Select(pd => pd.DeveloperId)
                .ToList();

            return _context.Users
                .Where(u => u.Role == UserRole.Developer && !assignedDeveloperIds.Contains(u.Id))
                .AsNoTracking()
                .ToList();
        }
    }
}
