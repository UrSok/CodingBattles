using Domain.Entities.Common;
using Domain.Enums;
using Domain.Models.Common;
using Domain.Repositories;
using Infrastructure.Options;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using Newtonsoft.Json;

namespace Infrastructure.Utils.Mail;

public interface IMailService
{
    Task Send(MailRequest mailRequest, CancellationToken cancellationToken);
}

public class MailService : IMailService
{
    private readonly HttpClient client = new HttpClient();
    private readonly IInfrastructureRepository infrastructureRepository;
    private readonly IMailOptions mailOptions;
    private GoogleToken googleToken;

    public MailService(IInfrastructureRepository infrastructureRepository, IMailOptions mailOptions)
    {
        this.infrastructureRepository = infrastructureRepository;
        this.mailOptions = mailOptions;
        var insert = this.InsertDefaultMailTemplates();
        var populate = this.RefreshAccessToken();

        Task.WaitAll(new Task[] { insert, populate });
    }

    private async Task InsertDefaultMailTemplates()
    {
        var templates = new List<MailTemplate>();

        templates.Add(new MailTemplate
        {
            TemplateCode = MailTemplateCode.AccountVerification,
            Subject = "Coding Battles | Account Verification",
            Body = DefaultMailTemplateGenerator.GetAccountVerification()
        });

        templates.Add(new MailTemplate
        {
            TemplateCode = MailTemplateCode.ResetPasswordVerification,
            Subject = "Coding Battles | Reset Password",
            Body = DefaultMailTemplateGenerator.GetResetPassword()
        });

        await this.infrastructureRepository.InsertTemplatesIfDontExist(templates);
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
    private MimeMessage GetMimeMessage(MailRequest mailRequest)
    {
        var mailMessage = new MimeMessage();
        mailMessage.From.Add(new MailboxAddress(this.mailOptions.DisplayName, this.mailOptions.Email));
        mailMessage.To.Add(new MailboxAddress(string.Empty, mailRequest.Recipient));
        mailMessage.Subject = mailRequest.Subject;
        var builder = new BodyBuilder
        {
            HtmlBody = mailRequest.Body
        };
        mailMessage.Body = builder.ToMessageBody();
        return mailMessage;
    }

    public async Task Send(MailRequest mailRequest, CancellationToken cancellationToken)
    {
            using var smtpClient = new SmtpClient
        {
            CheckCertificateRevocation = false,
        };
        smtpClient.Connect(this.mailOptions.Host, this.mailOptions.Port, SecureSocketOptions.StartTls);

        if (this.googleToken.IsExpired)
        {
            await this.RefreshAccessToken();
        }

        var oauth2 = new SaslMechanismOAuth2(this.mailOptions.Email, this.googleToken.AccessToken);
        await smtpClient.AuthenticateAsync(oauth2);
        await smtpClient.SendAsync(this.GetMimeMessage(mailRequest), cancellationToken);
        await smtpClient.DisconnectAsync(true, cancellationToken);
    }
}
