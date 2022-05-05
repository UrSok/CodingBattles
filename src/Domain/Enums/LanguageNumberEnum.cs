using Ardalis.SmartEnum;

namespace Domain.Enums;

public class Language : SmartEnum<Language>
{
    public static Language CS = new("C#", "csharp", 1);
    public static Language Javascript = new Language("JavaScript", "javascript", 2);
    public static Language Typescript = new Language("TypeScript", "typescript", 3);

    public string DisplayName { get; }

    public Language(string displayName, string name, int value) : base(name, value)
    {
        DisplayName = displayName;
    }
}