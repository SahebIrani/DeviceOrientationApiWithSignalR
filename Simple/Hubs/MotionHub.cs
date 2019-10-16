using System.Threading.Tasks;

using Microsoft.AspNetCore.SignalR;

using Simple.Models;

namespace Simple.Hubs
{
    public class MotionHub : Hub
    {
        public async Task MySuperDuperAction(long beta, long gamma) =>
            await Clients.All.SendAsync("MotionUpdated", beta, gamma);

        public async Task MySuperDuperAction2(MotionDto data) =>
            await Clients.All.SendAsync("MotionUpdated", data);
    }
}