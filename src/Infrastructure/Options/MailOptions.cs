namespace Infrastructure.Options;

internal interface IMailOptions
{
    string DisplayName { get; set; }
    string Email { get; set; }
    string ClientId { get; set; }
    string ClientSecret { get; set; }
    string RefreshToken { get; set; }
    string Host { get; set; }
    int Port { get; set; }
}

internal class MailOptions : IMailOptions
{
    public string DisplayName { get; set; }
    public string Email { get; set; }
    public string ClientId { get; set; }
    public string ClientSecret { get; set; }
    public string RefreshToken { get; set; }
    public string Host { get; set; }
    public int Port { get; set; }
}
