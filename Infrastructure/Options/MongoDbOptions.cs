namespace Infrastructure.Options;
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.

public interface IMongoDbOptions
{
    string ConnectionString { get; set; }
    string DatabaseName { get; set; }
}

public class MongoDbOptions : IMongoDbOptions
{
    public string ConnectionString { get; set; }
    public string DatabaseName { get; set; }
}
