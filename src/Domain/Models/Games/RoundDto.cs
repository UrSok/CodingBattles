using Domain.Models.Challenges;

namespace Domain.Models.Games;

public class RoundDto
{
    public int Number { get; set; }
    public DateTime StartTime { get; set; }
    public int DurationMinutes { get; set; }
    public ChallengeDto Challenge { get; set; }
    public List<RoundSummaryDto> RoundSummaries { get; set; }

}
