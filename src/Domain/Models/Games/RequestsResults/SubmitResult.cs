using Domain.Entities.Common;

namespace Domain.Models.Games.RequestsResults;

public class SubmitResultRequest
{
    public string GameId { get; set; }
    public string UserId { get; set; }
    public Solution Solution { get; set; }
}
