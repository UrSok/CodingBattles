using Autofac;
using AutoMapper.Contrib.Autofac.DependencyInjection;
using Infrastructure.MapperProfiles;
using Infrastructure.Options;
using Infrastructure.Persistence;
using Infrastructure.Repositories;
using Microsoft.Extensions.Configuration;
using MongoDB.Bson;

namespace Infrastructure;

public class InfrastructureModule : Module
{
    private readonly IConfiguration _configuration;

    public InfrastructureModule(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    protected override void Load(ContainerBuilder builder)
    {
        builder.RegisterAutoMapper(true, typeof(DocumentEntityProfile).Assembly);

        builder.RegisterType<MongoDbContext>().As<IMongoDbContext>().SingleInstance();

        var mongoDbOptions = _configuration.GetSection(nameof(MongoDbOptions)).Get<MongoDbOptions>();
        builder.Register(b => mongoDbOptions).As(typeof(IMongoDbOptions)).SingleInstance();

        builder.RegisterAssemblyTypes(typeof(UserRepository).Assembly)
            .Where(t => t.Name.EndsWith("Repository"))
            .AsImplementedInterfaces();


    }
}
