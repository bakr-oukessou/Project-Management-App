namespace ReactApp1.Server.Models.DTO
{
    public class TaskProgressDto
    {
        public string Description { get; set; }
        public int PercentageComplete { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int UserId { get; set; }
    }

}
