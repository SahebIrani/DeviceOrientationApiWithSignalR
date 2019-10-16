using System.Threading.Tasks;

using Microsoft.AspNetCore.SignalR;

using Simple.Models;

namespace Simple.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage2(string user, string message) =>
            await Clients.All.SendAsync("ReceiveMessage", user, message);

        public async Task SendMessage(ChatDto model) =>
            await Clients.All.SendAsync("ReceiveMessage", model.User, model.Message);
    }
}