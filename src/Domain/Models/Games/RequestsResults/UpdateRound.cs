namespace Domain.Models.Games.RequestsResults;

public class UpdateCurrentRoundSettingsRequest
{
    public string GameMode { get; set; }
    public int Duration { get; set; }
    public List<string> RestrictedLanguages { get; set; }
    public string ChallengeSelectorType { get; set; }
}
