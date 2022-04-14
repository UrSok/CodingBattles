namespace Infrastructure.Services.Mail;

internal static class DefaultMailTemplates
{
    public static string GetAccountVerification()
    {
        return @"
    ﻿        <html xmlns='http://www.w3.org/1999/xhtml'>
                <head>
                    <meta http-equiv='Content-Type' content='text/html; charset=utf-8' />
                </head>
                <body>
                    <h3>Hello {0},</h3>
                    <p>To be able to access the account, you'll need to activate it!</p>
                    <p>You can use the following methods:</p>
                    <p>Verification code: {1}</p>
                    <p>Verification link:</p>
                    <a href='{2}'>{2}</a>   
                    <p>The code and link will expire in 30 mins!</p>
                    <p>Thank you, Coding Battles Team!</p>
                </body>
            </html>";
    }

    public static string GetResetPassword()
    {
        return @"
    ﻿        <html xmlns='http://www.w3.org/1999/xhtml'>
                <head>
                    <meta http-equiv='Content-Type' content='text/html; charset=utf-8' />
                </head>
                <body>
                    <h3>Hello {0},</h3>
                    <p>To reset your password, you'll need to confirm your identity!</p>
                    <p>You can use the following methods:</p>
                    <p>Verification code: {1}</p>
                    <p>Verification link:</p>
                    <a href='{2}'>{2}</a>   
                    <p>The code and link will expire in 30 mins!</p>
                    <p>Thank you, Coding Battles Team!</p>
                </body>
            </html>";
    }
}
