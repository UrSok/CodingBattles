using Domain.Models.Games.Results;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Managers.Lobby;

public interface ILobbyClient
{
    Task OnSomeoneJoinedLobby(GetGameResult game);
    //Task Send(string message, CancellationToken cancellationToken = default);
}
