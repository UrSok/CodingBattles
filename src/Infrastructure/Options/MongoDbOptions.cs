namespace Infrastructure.Options;

internal interface IMongoDbOptions
{
    string ConnectionString { get; set; }
    string DatabaseName { get; set; }
}

internal class MongoDbOptions : IMongoDbOptions
{
    public string ConnectionString { get; set; }
    public string DatabaseName { get; set; }
}
