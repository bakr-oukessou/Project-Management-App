using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReactApp1.Server.Models
{
    public class TaskItem
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public int PriorityId { get; set; }

        [ForeignKey("PriorityId")]
        public TaskPriority Priority { get; set; }

        [Required]
        public int StatusId { get; set; }

        [ForeignKey("StatusId")]
        public TaskStatus Status { get; set; }

        [Required]
        public DateTime DueDate { get; set; }

        public DateTime? EndDate { get; set; }

        public int? AssignedToId { get; set; }

        [ForeignKey("AssignedToId")]
        public User? AssignedTo { get; set; }

        public int ProjectId { get; set; }

        [ForeignKey("ProjectId")]
        public Project Project { get; set; }

        public int? EstimatedHours { get; set; }

        public int? ActualHours { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        public ICollection<TaskComment> Comments { get; set; } = new List<TaskComment>();

        public ICollection<TaskProgress> ProgressUpdates { get; set; } = new List<TaskProgress>();

        // Helper properties for easier status checking
        [NotMapped]
        public bool IsCompleted => Status?.Name == "Completed";

        [NotMapped]
        public bool IsInProgress => Status?.Name == "InProgress";

        [NotMapped]
        public bool IsOverdue => DueDate < DateTime.Now && !IsCompleted;

        [NotMapped]
        public TaskPriorityLevel PriorityLevel
        {
            get
            {
                return Priority?.Name switch
                {
                    "Low" => TaskPriorityLevel.Low,
                    "Medium" => TaskPriorityLevel.Medium,
                    "High" => TaskPriorityLevel.High,
                    "Critical" => TaskPriorityLevel.Critical,
                    _ => TaskPriorityLevel.Medium
                };
            }
        }

        [NotMapped]
        public TaskStatusLevel StatusLevel
        {
            get
            {
                return Status?.Name switch
                {
                    "ToDo" => TaskStatusLevel.ToDo,
                    "InProgress" => TaskStatusLevel.InProgress,
                    "Review" => TaskStatusLevel.Review,
                    "Completed" => TaskStatusLevel.Completed,
                    _ => TaskStatusLevel.ToDo
                };
            }
        }
    }

    // Renamed to avoid conflict with navigation property
    public enum TaskStatusLevel
    {
        ToDo = 1,
        InProgress = 2,
        Review = 3,
        Completed = 4
    }

    public enum TaskPriorityLevel
    {
        Low = 1,
        Medium = 2,
        High = 3,
        Critical = 4
    }

    // New entity classes to match your database tables
    public class TaskStatus
    {
        public int Id { get; set; }

        [Required]
        [StringLength(20)]
        public string Name { get; set; }

        public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
    }

    public class TaskPriority
    {
        public int Id { get; set; }

        [Required]
        [StringLength(20)]
        public string Name { get; set; }

        public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
    }

    public class TaskComment
    {
        public int Id { get; set; }

        [Required]
        public string Content { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int TaskId { get; set; }

        [ForeignKey("TaskId")]
        public TaskItem Task { get; set; }

        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; }
    }

    // Static helper class for valid status and priority values
    public static class TaskConstants
    {
        public static readonly string[] ValidStatuses = { "ToDo", "InProgress", "Review", "Completed" };
        public static readonly string[] ValidPriorities = { "Low", "Medium", "High", "Critical" };

        public static bool IsValidStatus(string status)
        {
            return ValidStatuses.Contains(status);
        }

        public static bool IsValidPriority(string priority)
        {
            return ValidPriorities.Contains(priority);
        }
    }
}