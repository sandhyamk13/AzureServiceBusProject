namespace Core.Interfaces
{
    public interface IMessageService
    {
        Task SendMessageAsync(string content);
        Task<IEnumerable<string>> ReceiveMessagesAsync();
    }
}
