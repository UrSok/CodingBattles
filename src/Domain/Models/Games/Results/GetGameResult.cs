using Domain.Entities.Challenges;
using Domain.Entities.Common;
using Domain.Entities.Games;
using Domain.Enums;
using Domain.Models.Users;

namespace Domain.Models.Games.Results;


public class GetGameRoundSummaryResult
{
    public UserModel User { get; set; }
    public Solution Solution { get; set; }
    public List<TestSummary> TestSummaries { get; set; }

}

public class GetGameRoundResult
{
    public int Number { get; set; }
    public DateTime StartTime { get; set; }
    public int DurationMinutes { get; set; }
    public Challenge Challenge { get; set; }
    public List<GetGameRoundSummaryResult> RoundSummaries { get; set; }

}

public class GetGameResult
{
    public string Code { get; set; }

    public string Name { get; set; }

    public bool IsPrivate { get; set; }

    public UserModel CreatedByUser { get; set; }

    public List<UserModel> Users { get; set; }

    public RoundStatus Status { get; set; }

    public List<GetGameRoundResult> Rounds { get; set; }
}
