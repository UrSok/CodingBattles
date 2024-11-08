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

    public static readonly ValidationError UnsupportedLanguage =
        new(nameof(UnsupportedLanguage), 10008);

    public static readonly ValidationError EmptyStubGeneratorInput =
        new(nameof(EmptyStubGeneratorInput), 10009);

    public static readonly ValidationError MinimumDifficultyIsBiggerThanMaximumDifficulty =
        new(nameof(MinimumDifficultyIsBiggerThanMaximumDifficulty), 10010);

    public static readonly ValidationError NotEnoughChallengeTask =
        new(nameof(NotEnoughChallengeTask), 10011);

    public static readonly ValidationError ChallengeEmptyDescriptionShort =
        new(nameof(ChallengeEmptyDescriptionShort), 10012);

    public static readonly ValidationError ChallengeEmptyDescriptionShortMarkdown =
        new(nameof(ChallengeEmptyDescriptionShortMarkdown), 10013);

    public static readonly ValidationError EmptyChallengeConstraints =
        new(nameof(EmptyChallengeConstraints), 10014);

    public static readonly ValidationError BadChallengeTest =
        new(nameof(BadChallengeTest), 10015);

    public static readonly ValidationError BadChallengeTests =
        new(nameof(BadChallengeTests), 10016);

    public static readonly ValidationError BadChallengeSolution =
        new(nameof(BadChallengeSolution), 10017);

    public static readonly ValidationError EmptyEmail =
        new(nameof(EmptyEmail), 10018);

    public static readonly ValidationError EmptyLanguage =
        new(nameof(EmptyLanguage), 10019);

    public static readonly ValidationError InvalidId =
        new(nameof(InvalidId), 10020);

    public static readonly ValidationError EmptyStatusReason =
        new(nameof(EmptyStatusReason), 10021);

    public static readonly ValidationError EmptyUserId =
        new(nameof(EmptyUserId), 10022);

    public static readonly ValidationError InvalidCode =
        new(nameof(InvalidCode), 10023);

    public static readonly ValidationError EmptyGameId =
        new(nameof(EmptyGameId), 10024);

    public static readonly ValidationError EmptyChallengeId =
        new(nameof(EmptyChallengeId), 10025);

    public ValidationError(string name, int value) : base(name, value)
    {
    }
}
