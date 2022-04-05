using Ardalis.SmartEnum;

namespace StubGenerator.StubOutput.Models;

public sealed class Language : SmartEnum<Language>
{
    public static readonly Language CSharp =
        new("C#", "csharp", 1);
    public static readonly Language JavaScript =
        new("JavaScript", "javascript", 2);
    public static readonly Language TypeScript =
        new("TypeScript", "typescript", 3);
    public static readonly Language Java =
        new("Java", "java", 4);

    public string DisplayName { get; }

    public Language(string displayName, string name, int value) : base(name, value)
    {
        DisplayName = displayName;
    }
}
