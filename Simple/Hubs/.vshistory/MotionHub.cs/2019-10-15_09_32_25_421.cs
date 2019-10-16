using System.Threading.Tasks;

using Microsoft.AspNetCore.SignalR;

namespace Demo
{
    public class MotionHub : Hub
    {
        public async Task MySuperDuperAction(MotionDto data)
            => await Clients.All.SendAsync("motionUpdated", data);
    }
}