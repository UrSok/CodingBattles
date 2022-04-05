namespace StubGenerator.StubInput.Models.Validation;

public sealed class FinalValidationCode : ValidationCode
{
    public static readonly FinalValidationCode LoopVariableNotDeclared =
        new(nameof(LoopVariableNotDeclared), 31);

    public static readonly FinalValidationCode LoopVariableTypeNotIntOrFloat =
        new(nameof(LoopVariableTypeNotIntOrFloat), 32);

    public static readonly FinalValidationCode StringVariableShouldBeSingle =
        new(nameof(StringVariableShouldBeSingle), 33);

    public static readonly FinalValidationCode VariableAlreadyDeclared =
        new(nameof(VariableAlreadyDeclared), 34);

    private FinalValidationCode(string name, int value) : base(name, value)
    {
    }
}
