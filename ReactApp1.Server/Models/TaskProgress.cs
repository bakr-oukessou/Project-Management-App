using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReactApp1.Server.Models
{
    public class TaskProgress
    {
        public int Id { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public int PercentageComplete { get; set; }

        [Required]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public int TaskId { get; set; }

        [ForeignKey("TaskId")]
        public TaskItem Task { get; set; }

        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User User { get; set; }
    }
}
