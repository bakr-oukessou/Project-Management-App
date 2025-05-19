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
        public TaskPriority Priority { get; set; }

        [Required]
        public TaskStatus Status { get; set; } = TaskStatus.ToDo;

        [Required]
        public DateTime DueDate { get; set; }

        public DateTime? CompletionDate { get; set; }

        public int? AssignedToId { get; set; }

        [ForeignKey("AssignedToId")]
        public User? AssignedTo { get; set; }

        public int ProjectId { get; set; }

        [ForeignKey("ProjectId")]
        public Project Project { get; set; }

        public int? EstimatedHours { get; set; }

        public int? ActualHours { get; set; }

        public ICollection<TaskComment> Comments { get; set; } = new List<TaskComment>();

        public ICollection<TaskProgress> ProgressUpdates { get; set; } = new List<TaskProgress>();
    }

    public enum TaskStatus
    {
        ToDo,
        InProgress,
        Review,
        Completed
    }

    public enum TaskPriority
    {
        Low,
        Medium,
        High,
        Critical
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

}
