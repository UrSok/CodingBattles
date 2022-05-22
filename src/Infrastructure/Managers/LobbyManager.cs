using Application.Managers.Lobby;
using Domain.Models.Results;
using Infrastructure.Logic.Lobby.Commands;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Managers;

internal class LobbyManager : BaseManager, ILobbyManager
{
    public LobbyManager(IMediator mediator) : base(mediator)
    {
    }

    public async Task<Result<string>> JoinLobby(string userId, string code, CancellationToken cancellationToken)
    {
        var command = new JoinLobbyCommand(userId, code);
        return await this.SendCommand(command, cancellationToken);
    }
}
