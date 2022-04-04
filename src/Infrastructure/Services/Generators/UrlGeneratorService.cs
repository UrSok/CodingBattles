using Infrastructure.Options;

namespace Infrastructure.Services.Generators;

internal interface IUrlGeneratorService
{
    string GetActivation(string userId, string verificationCode);
    string GetResetPassword(string userId, string verificationCode);
}

internal class UrlGeneratorService : IUrlGeneratorService
{
    private readonly IUrlGeneratorOptions urlGeneratorOptions;

    public UrlGeneratorService(IUrlGeneratorOptions urlGeneratorOptions)
    {
        this.urlGeneratorOptions = urlGeneratorOptions;
    }

    public string GetActivation(string userId, string verificationCode)
    {
        return string.Concat(this.urlGeneratorOptions.Base,
            string.Format(this.urlGeneratorOptions.AccountActivation, userId, verificationCode));
    }

    public string GetResetPassword(string userId, string verificationCode)
    {
        return string.Concat(this.urlGeneratorOptions.Base,
            string.Format(this.urlGeneratorOptions.ForgotPassword, userId, verificationCode));
    }
}
