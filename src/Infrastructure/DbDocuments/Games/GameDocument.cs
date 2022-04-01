using Infrastructure.DbDocuments.Users;
using MongoDB.Bson.Serialization.Attributes;

namespace Infrastructure.DbDocuments.Games;

public class GameDocument : MongoDocument
{
    public string Name { get; set; }
    public string Code { get; set; }
    public bool IsPrivate { get; set; }
    public List<Guid> UserIds { get; set; }

    public bool HasEnded { get; set; }
    // TODO: Should I use state instead?: InProgress, Voting, HasConcluded?
}
