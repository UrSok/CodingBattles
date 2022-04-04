namespace Infrastructure.DbDocuments.Games;

internal class GameDocument : MongoDocument
{
    public string Name { get; set; }
    public string Code { get; set; }
    public bool IsPrivate { get; set; }
    public List<Guid> UserIds { get; set; }

    public bool HasEnded { get; set; }
    // TODO: Should I use state instead?: InProgress, Voting, HasConcluded?
}
