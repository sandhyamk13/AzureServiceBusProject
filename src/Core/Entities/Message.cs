namespace Core.Entities
{
    public class Message
    {
        public string Id { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Status { get; set; }
    }
}
