namespace ReactApp1.Server.Models.DTO
{
    public class TaskItemDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string PriorityName { get; set; }
        public string StatusName { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string AssignedToUsername { get; set; }
        public string ProjectTitle { get; set; }
        public int? EstimatedHours { get; set; }
        public int? ActualHours { get; set; }
    }
}
