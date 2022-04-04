namespace Infrastructure.Options;

internal interface IUrlGeneratorOptions
{
    string AccountActivation { get; set; }
    string Base { get; set; }
    string ForgotPassword { get; set; }
}

internal class UrlGeneratorOptions : IUrlGeneratorOptions
{
    public string Base { get; set; }
    public string AccountActivation { get; set; }
    public string ForgotPassword { get; set; }
}
