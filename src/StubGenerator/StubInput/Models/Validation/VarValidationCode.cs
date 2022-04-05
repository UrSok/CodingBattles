namespace StubGenerator.StubInput.Models.Validation;

public sealed class VarValidationCode : ValidationCode
{
    public static readonly VarValidationCode NameInvalid =
        new(nameof(NameInvalid), 21);

    public static readonly VarValidationCode TypeMissing =
        new(nameof(TypeMissing), 22);

    public static readonly VarValidationCode TypeInvalid =
        new(nameof(TypeInvalid), 23);

    public static readonly VarValidationCode LengthMissing =
        new(nameof(LengthMissing), 24);

    public static readonly VarValidationCode LengthInvalid =
        new(nameof(LengthInvalid), 25);

    public static readonly VarValidationCode LengthOverflow =
        new(nameof(LengthOverflow), 26);

    public static readonly VarValidationCode LengthNegativeOrZero =
        new(nameof(LengthNegativeOrZero), 27);

    public static readonly VarValidationCode LengthNotNeeded =
        new(nameof(LengthNotNeeded), 28);

    private VarValidationCode(string name, int value) : base(name, value)
    {
    }
}
