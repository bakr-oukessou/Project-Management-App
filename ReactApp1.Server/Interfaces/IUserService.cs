using ReactApp1.Server.Models;

namespace ReactApp1.Server.Interfaces
{
    public interface IUserService
    {
        IEnumerable<User> GetAll();
        User GetById(int id);
        User UpdateProfile(int id, UpdateProfileRequest model);
        IEnumerable<User> GetByRole(UserRole role);
        IEnumerable<User> GetDevelopersByProject(int projectId);
        IEnumerable<User> GetAvailableDevelopers(int projectId);
    }
}
