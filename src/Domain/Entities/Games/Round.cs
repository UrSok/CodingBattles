using Domain.Enums;

namespace Domain.Entities.Games;

public class Round
{
    public int Number { get; set; }
    public RoundStatus Status { get; set; }
    public string GameMode { get; set; }
    public List<string> RestrictedLanguages { get; set; }
    public string ChallengeSelectorType { get; set; }
    public DateTime? StartTime { get; set; }
    public int DurationMinutes { get; set; }
    public string ChallengeId { get; set; }
    public List<RoundSummary> RoundSummaries { get; set; }
}