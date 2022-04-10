using Ardalis.SmartEnum;

namespace StubGenerator.StubOutput.Models;

public sealed class Language : SmartEnum<Language>
{
    public static readonly Language Unknown =
        new(nameof(Unknown), 0);

    public static readonly Language CSharp =
        new("csharp", 1);

    public static readonly Language JavaScript =
        new("javascript", 2);

    public static readonly Language TypeScript =
        new("typescript", 3);

    public static readonly Language Java =
        new("java", 4);

    public string DisplayName { get; }

    public Language(string name, int value) : base(name, value)
    {
    }
}
