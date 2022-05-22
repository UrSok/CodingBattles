using Domain.Entities.Challenges;
using Domain.Entities.Common;
using Domain.Entities.Games;
using Domain.Enums;
using Domain.Models.Users;

namespace Domain.Models.Games.Results;


public class RoundSummaryDetails
{
    public UserModel User { get; set; }
    public Solution Solution { get; set; }
    public List<TestSummary> TestSummaries { get; set; }

}

public class RoundDetails
{
    public int Number { get; set; }
    public DateTime StartTime { get; set; }
    public int DurationMinutes { get; set; }
    public Challenge Challenge { get; set; }
    public List<RoundSummaryDetails> RoundSummaries { get; set; }

}

public class GameDetails
{
    public string Code { get; set; }

    public string Name { get; set; }
    
    public GameStatus Status { get; set; }

    public bool IsPrivate { get; set; }

    public UserModel GameMasterUser { get; set; }

    public List<UserModel> Users { get; set; }

    public RoundDetails CurrentRound { get; set; }

    public List<RoundDetails> PreviousRounds { get; set; }
}
