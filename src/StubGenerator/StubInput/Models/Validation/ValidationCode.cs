using Ardalis.SmartEnum;

namespace StubGenerator.StubInput.Models.Validation;

public class ValidationCode : SmartEnum<ValidationCode>
{
    public static readonly ValidationCode Skipped =
        new(nameof(Skipped), 0);

    public static readonly ValidationCode Valid =
        new(nameof(Valid), 1);

    public static readonly ValidationCode InvalidUnknown =
        new(nameof(InvalidUnknown), 2);

    public static readonly ValidationCode BadStatement =
        new(nameof(InvalidUnknown), 3);

    public static readonly ValidationCode BadVariable =
        new(nameof(BadVariable), 4);

    protected ValidationCode(string name, int value) : base(name, value)
    {
    }
}
