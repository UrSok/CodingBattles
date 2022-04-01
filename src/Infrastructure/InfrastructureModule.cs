using Autofac;
using AutoMapper.Contrib.Autofac.DependencyInjection;
using Infrastructure.MapperProfiles;
using Infrastructure.Options;
using Infrastructure.Persistence;
using Infrastructure.Repositories;
using Microsoft.Extensions.Configuration;

namespace Infrastructure;

public class InfrastructureModule : Module
{
    private readonly IConfiguration configuration;

    public InfrastructureModule(IConfiguration configuration)
    {
        this.configuration = configuration;
    }

    protected override void Load(ContainerBuilder builder)
    {
        builder.RegisterAutoMapper(true, typeof(DocumentEntityProfile).Assembly);

        builder.RegisterType<MongoDbContext>().As<IMongoDbContext>().SingleInstance();

        var mongoDbOptions = this.configuration.GetSection(nameof(MongoDbOptions)).Get<MongoDbOptions>();
        builder.Register(b => mongoDbOptions).As(typeof(IMongoDbOptions)).SingleInstance();

        builder.RegisterAssemblyTypes(typeof(UserRepository).Assembly)
            .Where(t => t.Name.EndsWith("Repository"))
            .AsImplementedInterfaces();


    }
}
