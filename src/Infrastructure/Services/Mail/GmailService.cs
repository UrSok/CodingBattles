using Infrastructure.Options;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using Newtonsoft.Json;

namespace Infrastructure.Services.Mail;

internal interface IGmailService
{
    Task Send(MimeMessage mail, CancellationToken cancellationToken);
}

internal class GmailService : IGmailService
{
    private readonly HttpClient client = new HttpClient();
    private readonly IMailOptions mailOptions;
    private GoogleToken googleToken;

    public GmailService(IMailOptions mailOptions)
    {
        this.mailOptions = mailOptions;
        var populate = this.RefreshAccessToken();

        Task.WaitAll(new Task[] { populate });
    }

    private async Task RefreshAccessToken()
    {
        var values = new Dictionary<string, string>
          {
              { "client_id", this.mailOptions.ClientId },
              { "client_secret", this.mailOptions.ClientSecret },
              { "refresh_token", this.mailOptions.RefreshToken },
              { "grant_type", "refresh_token" }
          };

        var content = new FormUrlEncodedContent(values);
        var response = await this.client.PostAsync("https://accounts.google.com/o/oauth2/token", content);
        var responseString = await response.Content.ReadAsStringAsync();
        this.googleToken = JsonConvert.DeserializeObject<GoogleToken>(responseString);
        this.googleToken.GenerateExpiresAt();
    }

    public async Task Send(MimeMessage mail, CancellationToken cancellationToken)
    {
        using var smtpClient = new SmtpClient
        {
            CheckCertificateRevocation = false,
        };

        await smtpClient.ConnectAsync(this.mailOptions.Host, this.mailOptions.Port, SecureSocketOptions.StartTls, cancellationToken);

        if (this.googleToken.IsExpired)
        {
            await this.RefreshAccessToken();
        }

        var oauth2 = new SaslMechanismOAuth2(this.mailOptions.Email, this.googleToken.AccessToken);
        await smtpClient.AuthenticateAsync(oauth2, cancellationToken);
        await smtpClient.SendAsync(mail, cancellationToken);
        await smtpClient.DisconnectAsync(true, cancellationToken);
    }
}
