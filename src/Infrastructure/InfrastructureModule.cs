using Autofac;
using AutoMapper.Contrib.Autofac.DependencyInjection;
using Infrastructure.MapperProfiles;
using Infrastructure.Options;
using Infrastructure.Persistence;
using Infrastructure.Repositories;
using Infrastructure.Utils;
using Infrastructure.Utils.Cryptography;
using Infrastructure.Utils.Mail;
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
        var mongoDbOptions = this.configuration.GetSection(nameof(MongoDbOptions)).Get<MongoDbOptions>();
        builder.Register(b => mongoDbOptions).As(typeof(IMongoDbOptions)).SingleInstance();
        var mailOptions = this.configuration.GetSection(nameof(MailOptions)).Get<MailOptions>();
        builder.Register(b => mailOptions).As(typeof(IMailOptions)).SingleInstance();
        var urlGeneratorOptions = this.configuration.GetSection(nameof(UrlGeneratorOptions)).Get<UrlGeneratorOptions>();
        builder.Register(b => urlGeneratorOptions).As(typeof(IUrlGeneratorOptions)).SingleInstance();

        builder.RegisterAutoMapper(true, typeof(DocumentToEntityProfile).Assembly);

        builder.RegisterType<MongoDbContext>().As<IMongoDbContext>().SingleInstance();
        builder.RegisterAssemblyTypes(typeof(UserRepository).Assembly)
            .Where(t => t.Name.EndsWith("Repository"))
            .AsImplementedInterfaces();

        builder.RegisterType<MailService>().As<IMailService>().SingleInstance();
        builder.RegisterType<PBKDFCryptoService>().As<ICryptoService>().SingleInstance();
        builder.RegisterType<UrlGenerator>().As<IUrlGenerator>().SingleInstance();
    }
}
