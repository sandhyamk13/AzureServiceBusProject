using Core.Interfaces;
using Microsoft.Azure.ServiceBus;
using System.Text;
using System.Text.Json;

namespace Infrastructure.Services
{
    public class ServiceBusMessageService : IMessageService
    {
        private readonly IQueueClient _queueClient;
        private readonly string _connectionString;
        private readonly string _queueName;

        public ServiceBusMessageService(string connectionString, string queueName)
        {
            _connectionString = connectionString;
            _queueName = queueName;
            _queueClient = new QueueClient(_connectionString, _queueName);
        }

        public async Task SendMessageAsync(string content)
        {
            var message = new Message(Encoding.UTF8.GetBytes(content));
            await _queueClient.SendAsync(message);
        }

        public async Task<IEnumerable<string>> ReceiveMessagesAsync()
        {
            var messages = new List<string>();
            var tcs = new TaskCompletionSource<bool>();
            var messageHandlerOptions = new MessageHandlerOptions(ExceptionReceivedHandler)
            {
                MaxConcurrentCalls = 1,
                AutoComplete = false
            };

            _queueClient.RegisterMessageHandler(async (message, token) =>
            {
                var messageContent = Encoding.UTF8.GetString(message.Body);
                messages.Add(messageContent);
                await _queueClient.CompleteAsync(message.SystemProperties.LockToken);
                tcs.SetResult(true);
            }, messageHandlerOptions);

            await tcs.Task;
            return messages;
        }

        private Task ExceptionReceivedHandler(ExceptionReceivedEventArgs exceptionReceivedEventArgs)
        {
            Console.WriteLine($"Message handler encountered an exception {exceptionReceivedEventArgs.Exception}.");
            return Task.CompletedTask;
        }

        public async ValueTask DisposeAsync()
        {
            if (_queueClient != null)
            {
                await _queueClient.CloseAsync();
            }
        }
    }
}
