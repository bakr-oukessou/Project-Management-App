using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReactApp1.Server.Models
{
    public class Project
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        public DateTime? DeadlineDate { get; set; }

        public DateTime? EndDate { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        public int StatusId { get; set; }

        [ForeignKey("StatusId")]
        public ProjectStatus Status { get; set; }

        public int? ManagerId { get; set; }

        [ForeignKey("ManagerId")]
        public User? Manager { get; set; }

        public int DirectorId { get; set; }

        [ForeignKey("DirectorId")]
        public User Director { get; set; }

        public ICollection<ProjectDeveloper> Developers { get; set; } = new List<ProjectDeveloper>();

        public ICollection<ProjectTechnology> Technologies { get; set; } = new List<ProjectTechnology>();

        public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();

        [NotMapped]
        public int CompletionPercentage
        {
            get
            {
                if (Status?.Name == "Completed") return 100;
                if (Status?.Name == "Planning") return 0;
                if (!Tasks.Any()) return 0;

                return (int)((double)Tasks.Count(t => t.Status?.Name == "Completed") / Tasks.Count * 100);
            }
        }

        public string? ClientName { get; set; }
    }

    public class ProjectStatus
    {
        public int Id { get; set; }

        [Required]
        [StringLength(20)]
        public string Name { get; set; }

        public ICollection<Project> Projects { get; set; } = new List<Project>();
    }

    public class ProjectDeveloper
    {
        public int ProjectId { get; set; }
        public Project Project { get; set; }

        public int DeveloperId { get; set; }
        public User Developer { get; set; }

        public DateTime AssignedDate { get; set; } = DateTime.UtcNow;
    }

    public class ProjectTechnology
    {
        public int ProjectId { get; set; }
        public Project Project { get; set; }

        public int TechnologyId { get; set; }
        public Technology Technology { get; set; }
    }
}