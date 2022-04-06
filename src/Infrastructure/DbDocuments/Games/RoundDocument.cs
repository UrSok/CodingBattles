namespace Infrastructure.DbDocuments.Games;

internal class RoundDocument : MongoDocumentWithId
{
    public Guid ProgrammingProblemId { get; set; }


    //TODO: Result
    //TODO: Round state?: InProgress, HasEnded
}
