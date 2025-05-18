namespace ReactApp1.Server.Models
{
    public class Project
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Client { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime DeliveryDate { get; set; }
        public int DevelopmentDays { get; set; }
        public int ProjectManagerId { get; set; }
        public User ProjectManager { get; set; }
        public List<Technology> Technologies { get; set; } = new List<Technology>();
        public string Methodology { get; set; }
        public DateTime? TeamMeetingDate { get; set; }
        public List<Developer> Team { get; set; } = new List<Developer>();
        public List<ProjectTask> Tasks { get; set; } = new List<ProjectTask>();
    }
}
