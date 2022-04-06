namespace Domain.Models.Challenges;

public class ChallengeRequestSaveModel
{
    public string UserId { get; set; }

    public ChallengeSaveModel Challenge { get; set; }
}
