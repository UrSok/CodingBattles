using Autofac;
using AutoMapper.Contrib.Autofac.DependencyInjection;
using FluentValidation;
using Infrastructure.Options;
using Infrastructure.Persistence;
using Infrastructure.Repositories;
using Infrastructure.Services.Cryptography;
using Infrastructure.Services.Generators;
using Infrastructure.Services.Mail;
using Infrastructure.Utils;
using Infrastructure.Utils.Validation;
using MediatR;
using MediatR.Extensions.Autofac.DependencyInjection;
using Microsoft.Extensions.Configuration;

namespace Infrastructure;

public class InfrastructureInjectionModule : Module
{
    private readonly IConfiguration configuration;

    public InfrastructureInjectionModule(IConfiguration configuration)
    {
        this.configuration = configuration;
    }

    protected override void Load(ContainerBuilder builder)
    {
        #region Options
        var mongoDbOptions = this.configuration.GetSection(nameof(MongoDbOptions)).Get<MongoDbOptions>();
        builder.Register(b => mongoDbOptions).As(typeof(IMongoDbOptions)).SingleInstance();
        var mailOptions = this.configuration.GetSection(nameof(MailOptions)).Get<MailOptions>();
        builder.Register(b => mailOptions).As(typeof(IMailOptions)).SingleInstance();
        var urlGeneratorOptions = this.configuration.GetSection(nameof(UrlGeneratorOptions)).Get<UrlGeneratorOptions>();
        builder.Register(b => urlGeneratorOptions).As(typeof(IUrlGeneratorOptions)).SingleInstance();
        var jwtKeyOptions = this.configuration.GetSection(nameof(JwtKeyOptions)).Get<JwtKeyOptions>();
        builder.Register(b => jwtKeyOptions).As(typeof(IJwtKeyOptions)).SingleInstance();
        #endregion

        #region Persistence&Repository
        builder.RegisterType<MongoDbContext>().As<IMongoDbContext>().SingleInstance();
        builder.RegisterAssemblyTypes(typeof(UserRepository).Assembly)
            .Where(t => t.Name.EndsWith("Repository"))
            .AsImplementedInterfaces();
        #endregion

        #region Services
        builder.RegisterType<MailService>().As<IMailService>().SingleInstance();
        builder.RegisterType<PBKDFCryptoService>().As<ICryptoService>().SingleInstance();
        builder.RegisterType<UrlGeneratorService>().As<IUrlGeneratorService>().SingleInstance();
        #endregion

        #region 3rd party Packages
        builder.RegisterAutoMapper(true, ThisAssembly);
        builder.RegisterMediatR(ThisAssembly);
        builder.RegisterGeneric(typeof(ValidationBehaviour<,>)).As(typeof(IPipelineBehavior<,>));
        #endregion

        // validators
        builder.RegisterAssemblyTypes(ThisAssembly)
               .Where(t => t.Name.EndsWith("Validator"))
               .AsImplementedInterfaces()
               .InstancePerLifetimeScope();

        builder.RegisterType<AutofacValidatorFactory>().As<IValidatorFactory>().SingleInstance();
        // validators end

        builder.RegisterAssemblyTypes(ThisAssembly)
            .Where(t => t.Name.EndsWith("Manager"))
            .AsImplementedInterfaces();
    }
}
