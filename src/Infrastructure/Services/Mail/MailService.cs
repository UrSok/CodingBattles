﻿using Domain.Entities.Common;
using Domain.Enums;
using Domain.Models.Mails;
using Infrastructure.Options;
using Infrastructure.Repositories;
using MimeKit;

namespace Infrastructure.Services.Mail;

internal interface IMailService
{
    Task SendAccountActivation(VerificationMailDto mailData, CancellationToken cancellationToken);
}

internal class MailService : IMailService
{
    private readonly IMailTemplateRepository mailTemplateRepository;
    private readonly IMailOptions mailOptions;
    private readonly IGmailService gmailService;

    public MailService(IMailTemplateRepository mailTemplateRepository, IMailOptions mailOptions)
    {
        this.mailTemplateRepository = mailTemplateRepository;
        this.mailOptions = mailOptions;
        Task.Run(this.InsertDefaultMailTemplates);

        this.gmailService = new GmailService(mailOptions);
    }

    private async Task InsertDefaultMailTemplates()
    {
        var templates = new List<MailTemplate>();

        templates.Add(new MailTemplate
        {
            TemplateCode = MailTemplateCode.AccountVerification,
            Subject = "Coding Battles | Account Verification",
            Body = DefaultMailTemplates.GetAccountVerification()
        });

        templates.Add(new MailTemplate
        {
            TemplateCode = MailTemplateCode.ResetPasswordVerification,
            Subject = "Coding Battles | Reset Password",
            Body = DefaultMailTemplates.GetResetPassword()
        });

        await this.mailTemplateRepository.InsertTemplatesIfDontExist(templates);
    }

    private MimeMessage GetMimeMessage(SendMailDto mailRequest)
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

    public async Task SendAccountActivation(VerificationMailDto mailData, CancellationToken cancellationToken)
    {
        var mailTemplate = await this.mailTemplateRepository
            .GetTemplateByCode(MailTemplateCode.AccountVerification, cancellationToken);

        var messageBody = string
            .Format(mailTemplate.Body,
                    mailData.Username,
                    mailData.VerificationCode,
                    mailData.VerificationUrl);

        var mimeMail = this.GetMimeMessage(new SendMailDto()
        {
            Recipient = mailData.Email,
            Subject = mailTemplate.Subject,
            Body = messageBody
        });

        await this.gmailService.Send(mimeMail, cancellationToken);
    }
}
