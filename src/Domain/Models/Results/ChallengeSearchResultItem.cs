using Domain.Entities.Challenges;

namespace Domain.Models.Results;

public class ChallengeSearchResultItem
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string Task { get; set; }
    public double Difficulty { get; set; }
    public IEnumerable<TagEntity> Tags { get; set; }
}
