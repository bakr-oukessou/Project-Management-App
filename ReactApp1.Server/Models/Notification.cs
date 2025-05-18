namespace ReactApp1.Server.Models
{
    public class Notification
    {
        public int Id { get; set; }
        public string Message { get; set; }
        public DateTime Date { get; set; }
        public bool IsRead { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public int? ProjectId { get; set; }
        public Project Project { get; set; }
    }
}
