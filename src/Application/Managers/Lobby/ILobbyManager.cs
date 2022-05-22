using Domain.Models.Results;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Managers.Lobby;
public interface ILobbyManager
{
    Task<Result<string>> JoinLobby(string userId, string code, CancellationToken cancellationToken = default);
}
