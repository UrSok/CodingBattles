namespace Infrastructure.Options;

public interface IUrlGeneratorOptions
{
    string AccountActivation { get; set; }
    string Base { get; set; }
    string ForgotPassword { get; set; }
}

public class UrlGeneratorOptions : IUrlGeneratorOptions
{
    public string Base { get; set; }
    public string AccountActivation { get; set; }
    public string ForgotPassword { get; set; }
}
