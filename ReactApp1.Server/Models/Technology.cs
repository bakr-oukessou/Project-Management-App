using System.ComponentModel.DataAnnotations;

namespace ReactApp1.Server.Models
{
    public class Technology
    {
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Name { get; set; }

        public string? Description { get; set; }

        public string? Category { get; set; }

        public ICollection<ProjectTechnology> Projects { get; set; } = new List<ProjectTechnology>();
    }
}
