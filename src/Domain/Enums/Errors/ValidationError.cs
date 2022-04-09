﻿namespace Domain.Enums.Errors;

public sealed class ValidationError : Error
{
    public static readonly ValidationError UnspecifiedError =
        new(nameof(UnspecifiedError), 10000);

    public static readonly ValidationError InvalidEmail =
        new(nameof(InvalidEmail), 10001);

    public static readonly ValidationError InvalidPassword =
        new(nameof(InvalidPassword), 10002);

    public static readonly ValidationError InvalidUsername =
        new(nameof(InvalidUsername), 10003);

    public static readonly ValidationError EmptyId =
        new(nameof(EmptyId), 10004);

    public static readonly ValidationError EmptyJwtToken =
        new(nameof(EmptyJwtToken), 10005);

    public static readonly ValidationError InvalidVerificationCode =
        new(nameof(InvalidVerificationCode), 10006);

    public static readonly ValidationError EmptyChallengeName =
        new(nameof(EmptyChallengeName), 10007);

    public ValidationError(string name, int value) : base(name, value)
    {
    }
}