using Autofac;
using Infrastructure.Options;
using Infrastructure.Persistence;
using Infrastructure.Repositories;
using Microsoft.Extensions.Configuration;

namespace Infrastructure;

public class InfrastractureAutofacModule : Module
{
    private readonly IConfiguration configuration;

    public InfrastractureAutofacModule(IConfiguration configuration)
    {
        this.configuration = configuration;
    }

    protected override void Load(ContainerBuilder builder)
    {
        builder.RegisterType<MongoDbContext>().As<IMongoDbContext>().SingleInstance();

        var mongoDbOptions = configuration.GetSection(nameof(MongoDbOptions)).Get<MongoDbOptions>();
        builder.Register(b => mongoDbOptions).As(typeof(IMongoDbOptions)).SingleInstance();

        builder.RegisterAssemblyTypes(typeof(BaseRepository).Assembly)
            .Where(t => t.Name.EndsWith("Repository"))
            .AsImplementedInterfaces();


    }
}
