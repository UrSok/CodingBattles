using Application.Managers.Lobby;
using Domain.Models.Results;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using WebApi.Hubs;

namespace WebApi.Controllers;

[Authorize]
[Route("api/v1/[controller]")]
[ApiController]
public class LobbyController: BaseController
{
    private readonly ILobbyManager lobbyManager;
    private readonly IHubContext<LobbyHub, ILobbyClient> lobbyHubContext;

    public LobbyController(ILobbyManager lobbyManager, IHubContext<LobbyHub, ILobbyClient> lobbyHubContext)
    {
        this.lobbyManager = lobbyManager;
        this.lobbyHubContext = lobbyHubContext;
    }


    [HttpPost("joinLobby/{userId}/{code}")]
    public async Task<IActionResult> JoinLobby([FromRoute] string userId, [FromRoute] string Code, CancellationToken cancellationToken)
    {
        var result = await this.lobbyManager.JoinLobby(userId, Code, cancellationToken);

        this.IfSuccess(result, async (result) =>
        {
            await this.lobbyHubContext.Groups.AddToGroupAsync(userId, result.Value, cancellationToken);
        });

        return this.Process(result);
    }

    private void IfSuccess(Result result, Action<Result> resultFunc)
    {
        if (result.IsSuccess)
        {
            resultFunc.Invoke(result);
        }
    }

    private void IfSuccess<T>(Result<T> result, Action<Result<T>> resultFunc)
    {
        if (result.IsSuccess)
        {
            resultFunc.Invoke(result);
        }
    }

}
