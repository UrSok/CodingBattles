namespace Infrastructure.DbDocuments.Games;

internal class RoundDocument : MongoDocument
{
    public Guid ProgrammingProblemId { get; set; }


    //TODO: Result
    //TODO: Round state?: InProgress, HasEnded
}
