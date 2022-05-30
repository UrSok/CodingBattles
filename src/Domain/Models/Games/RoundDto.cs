using Domain.Enums;
using Domain.Models.Challenges;

namespace Domain.Models.Games;

public class RoundDto
{
    public int Number { get; set; }
    public RoundStatus Status { get; set; }
    public string GameMode { get; set; }
    public List<string> RestrictedLanguages { get; set; }
    public string ChallengeSelectorType { get; set; }
    public DateTime StartTime { get; set; }
    public int DurationMinutes { get; set; }
    public ChallengeDto Challenge { get; set; }
    public List<RoundSummaryDto> RoundSummaries { get; set; }

}
