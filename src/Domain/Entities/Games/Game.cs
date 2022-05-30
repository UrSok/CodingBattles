using Domain.Enums;

namespace Domain.Entities.Games;

public class Game : EntityWithId
{
    public string Code { get; set; }

    public string Name { get; set; }

    public GameStatus Status { get; set; }

    public bool IsPrivate { get; set; }

    public string GameMasterUserId { get; set; }

    public List<string> UserIds { get; set; }

    public List<Round> Rounds { get; set; }
}
