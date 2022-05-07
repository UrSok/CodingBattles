using Domain.Entities.Challenges;

namespace Domain.Models.Results;

public class ChallengeSearchResultItem
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string DescriptionShort { get; set; }
    public double Difficulty { get; set; }
    public List<string> TagIds { get; set; }
}
