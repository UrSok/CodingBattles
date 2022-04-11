using Ardalis.SmartEnum;

namespace Domain.Enums;

// TODO: To be used in a future iteration. Maybe.
public sealed class ChallengeValidation : SmartFlagEnum<ChallengeValidation>
{
    public static readonly ChallengeValidation None = new(nameof(None), 0);
    public static readonly ChallengeValidation StubInput = new(nameof(StubInput), 1);
    public static readonly ChallengeValidation Solution = new(nameof(Solution), 2);

    public ChallengeValidation(string name, int value) : base(name, value)
    {
    }
}
