namespace Infrastructure.Options;
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
