using Infrastructure.Options;

namespace Infrastructure.Utils;

public interface IUrlGenerator
{
    string GetActivation(string userId, string verificationCode);
    string GetResetPassword(string userId, string verificationCode);
}

public class UrlGenerator : IUrlGenerator
{
    private readonly IUrlGeneratorOptions urlGeneratorOptions;

    public UrlGenerator(IUrlGeneratorOptions urlGeneratorOptions)
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
