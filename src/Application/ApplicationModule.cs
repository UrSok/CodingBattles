using Application.UserLogic.Commands;
using Autofac;
using Infrastructure.Options;
using Infrastructure.Utils.Cryptography;
using MediatR.Extensions.Autofac.DependencyInjection;
using Microsoft.Extensions.Configuration;

namespace Application;

public class ApplicationModule : Module
{
    private readonly IConfiguration configuration;

    public ApplicationModule(IConfiguration configuration)
    {
        this.configuration = configuration;
    }

    protected override void Load(ContainerBuilder builder)
    {
        builder.RegisterMediatR(typeof(RegisterUserCommand).Assembly);
        builder.RegisterType<PBKDFCryptoService>().As<ICryptoService>().SingleInstance();

        var jwtKeyOptions = this.configuration.GetSection(nameof(JwtKeyOptions)).Get<JwtKeyOptions>();
        builder.Register(b => jwtKeyOptions).As(typeof(IJwtKeyOptions)).SingleInstance();
    }
}
