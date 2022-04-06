namespace Domain.Enums;

public enum ErrorCode
{
    None = 0,
    Unknown = 1,
    InternalError = 2,
    UserExists = 3,
    IncorrectLoginOrPassword = 4,
    UserEmailNotVerified = 5,
    UserNotFound = 6,
    EmailAlreadyVerified = 7,
    InvalidVerificationCode = 8,
    CannotEditForeignRecord = 9,
    ChallengeNotFound = 10,
}
