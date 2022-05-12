using Domain.Entities.Games;

namespace Domain.Models.Games;

public class SubmitResultRequest
{
    public string GameId { get; set; }

    public int RoundNumber { get; set; }

    public RoundSummary RoundSummary { get; set; }
}
