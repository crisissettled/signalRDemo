using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace signalR_server {

    [Authorize]
    //[Authorize(Roles ="admin")]
    public class ChatHub : Hub {

        public override Task OnConnectedAsync() {
            var connectionId = this.Context.ConnectionId;

            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception) {
            var connectionId = this.Context.ConnectionId;
            this.Context.Abort();

            return base.OnDisconnectedAsync(exception);
        }
        //[Authorize(Roles ="admin")]
        public async Task SendMessage(string user, string message) {
            var userInfo = this.Context.User;
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public void BanUser(string username) {
        }

        public void ViewUserHistory(string username) {
        }
    }
}
