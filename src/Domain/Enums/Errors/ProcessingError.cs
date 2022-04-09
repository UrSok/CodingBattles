﻿namespace Domain.Enums.Errors;

public class ProcessingError : Error
{
    public static readonly ProcessingError IncorrectLoginOrPassword =
        new(nameof(IncorrectLoginOrPassword), 100);

    public static readonly ProcessingError UserExists =
        new(nameof(UserExists), 101);

    public static readonly ProcessingError UserNotFound =
        new(nameof(UserNotFound), 102);

    public static readonly ProcessingError AccountAlreadyActivated =
        new(nameof(AccountAlreadyActivated), 103);

    public static readonly ProcessingError BadVerificationCode =
        new(nameof(BadVerificationCode), 104);

    public static readonly ProcessingError VerificationCodeExpired =
        new(nameof(VerificationCodeExpired), 105);

    public static readonly ProcessingError NoVerificationCode =
        new(nameof(NoVerificationCode), 106);

    public static readonly ProcessingError ChallengeNotFound =
        new(nameof(ChallengeNotFound), 107);

    public static readonly ProcessingError CannotEditForeignRecord =
        new(nameof(CannotEditForeignRecord), 108);

    public ProcessingError(string name, int value) : base(name, value)
    {
    }
}