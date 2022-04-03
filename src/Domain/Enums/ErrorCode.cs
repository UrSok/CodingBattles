namespace Domain.Enums;

public enum ErrorCode
{
    None = 0,
    Unknown = 1,
    InternalError = 2,
    UserExists = 3,
    IncorrectLoginOrPassword = 4,
    UserEmailNotVerified = 5,
    NoSuchUser = 6,
    EmailAlreadyVerified = 7,
    InvalidVerificationCode = 8,
}
