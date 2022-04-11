namespace Domain.Models.Results;

public class PublishChallengeResult
{
    public string ChallengeId { get; set; }
   
    //TODO: Solution Error

    public StubGeneratorError Error { get; set; }
}
