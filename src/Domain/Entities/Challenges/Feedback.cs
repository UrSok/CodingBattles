namespace Domain.Entities.Challenges;

public class Feedback : EntityWithId
{
    public string UserId { get; set; }

    public float Difficulty { get; set; }

    public float Fun { get; set; }

    public float TestCasesRelevancy { get; set; }

    public string Text { get; set; }
}
