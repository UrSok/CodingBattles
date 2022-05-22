using Application.Managers.Lobby;
using Microsoft.AspNetCore.SignalR;

namespace WebApi.Hubs;

public class LobbyHub : Hub<ILobbyClient>
{
    private readonly ILobbyManager lobbyManager;

    public LobbyHub(ILobbyManager lobbyManager)
    {
        this.lobbyManager = lobbyManager;
    }


    public async Task JoinLobby(string userId, string lobbyCode)
    {
        var result = await this.lobbyManager.JoinLobby(userId, lobbyCode);
        if (result.IsSuccess)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, result.Value);
            
        }

    }
}
