using System.Text.Json.Serialization;

namespace ReactApp1.Server.Models
{
    public class User
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        [JsonIgnore]
        public string PasswordHash { get; set; }
        public string Role { get; set; } // Directeur, ChefProjet, Développeur
    }

    public class Developer : User
    {
        public List<Technology> Technologies { get; set; } = new List<Technology>();
        public List<ProjectTask> AssignedTasks { get; set; } = new List<ProjectTask>();
        public List<Project> Projects { get; set; } = new List<Project>();
    }
}
