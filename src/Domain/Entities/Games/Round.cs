using Domain.Enums;

namespace Domain.Entities.Games;

public class Round
{
    public int Number { get; set; }
    public DateTime StartTime { get; set; }
    public int DurationMinutes { get; set; }
    public string ChallengeId { get; set; }
    public RoundStatus Status { get; set; }
    public List<RoundSummary> RoundSummaries { get; set; }
}