namespace ReactApp1.Server.Models
{
    public class TaskProgress
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public int PercentageComplete { get; set; }
        public int TaskId { get; set; }
        public ProjectTask Task { get; set; }
    }
}
