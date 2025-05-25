using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ReactApp1.Server.Models
{
    public class User
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Username { get; set; }
        
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        
        [Required]
        [JsonIgnore]
        public string PasswordHash { get; set; }
        
        [Required]
        [Column(TypeName = "nvarchar(20)")]
        public UserRole Role { get; set; }
        
        public string? FirstName { get; set; }
        
        public string? LastName { get; set; }
        
        public string? ProfilePicture { get; set; }
        
        
        public ICollection<Project> ManagedProjects { get; set; } = new List<Project>();
        
        public ICollection<ProjectDeveloper> Projects { get; set; } = new List<ProjectDeveloper>();
        
        public ICollection<TaskItem> AssignedTasks { get; set; } = new List<TaskItem>();
    }
    public enum UserRole
    {
        Director,
        Manager,
        Developer
    }

    public class Developer : User
    {
        public List<Technology> Technologies { get; set; } = new List<Technology>();
        public List<ProjectTask> AssignedTasks { get; set; } = new List<ProjectTask>();
        public List<Project> Projects { get; set; } = new List<Project>();
    }
}
