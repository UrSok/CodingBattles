using Domain.Enums;

namespace Domain.Models.Challenges;

public class ChallengeSearchModel
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string SortBy { get; set; }
    public OrderStyle OrderStyle { get; set; }
    public string Text { get; set; }
    public IEnumerable<string> TagIds { get; set; } = new List<string>();
    public float? MinimumDifficulty { get; set; }
    public float? MaximumDifficulty { get; set; }
    public bool IncludeNoDifficulty { get; set; } = true;

    public bool HasBothDifficultiesSet =>
        MinimumDifficulty is not null && MaximumDifficulty is not null;
}
