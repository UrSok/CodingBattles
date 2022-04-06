namespace Domain.Entities.Challenges;

public class Feedback : EntityWithId
{
    public string UserId { get; set; }

    public int Difficulty { get; set; }

    public int Fun { get; set; }

    public int TestCasesRelvancy { get; set; }

    public string Text { get; set; }

    public bool HasIssues { get; set; }
}
