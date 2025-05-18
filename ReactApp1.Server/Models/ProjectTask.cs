namespace ReactApp1.Server.Models
{
    public class ProjectTask
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public int DurationInDays { get; set; }
        public int ProjectId { get; set; }
        public Project Project { get; set; }
        public int DeveloperId { get; set; }
        public Developer Developer { get; set; }
        public List<TaskProgress> Progresses { get; set; } = new List<TaskProgress>();
    }
}
