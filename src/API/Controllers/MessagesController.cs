using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessagesController : ControllerBase
    {
        private readonly IMessageService _messageService;

        public MessagesController(IMessageService messageService)
        {
            _messageService = messageService;
        }

        [HttpPost]
        public async Task<IActionResult> SendMessage([FromBody] string content)
        {
            await _messageService.SendMessageAsync(content);
            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> GetMessages()
        {
            var messages = await _messageService.ReceiveMessagesAsync();
            return Ok(messages);
        }
    }
}
