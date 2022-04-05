namespace StubGenerator.StubInput.Models.Validation;

public sealed class StatementValidationCode : ValidationCode
{
    public static readonly StatementValidationCode KeywordInvalid =
        new(nameof(KeywordInvalid), 11);

    public static readonly StatementValidationCode TextMissing =
        new(nameof(TextMissing), 12);

    public static readonly StatementValidationCode VariablesMissing =
        new(nameof(VariablesMissing), 13);

    public static readonly StatementValidationCode LoopValueMissing =
        new(nameof(LoopValueMissing), 14);

    public static readonly StatementValidationCode LoopVariableNameInvalid =
        new(nameof(LoopVariableNameInvalid), 15);

    public static readonly StatementValidationCode LoopVariablesMissing =
        new(nameof(LoopVariablesMissing), 16);

    private StatementValidationCode(string name, int value) : base(name, value)
    {
    }
}
