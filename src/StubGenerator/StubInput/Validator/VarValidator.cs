using StubGenerator.StubInput.Constants;
using StubGenerator.StubInput.Models.Validation;

namespace StubGenerator.StubInput.Validator;

public static class VarValidator
{
    private static readonly List<string> types = new()
    {
        VarTypeSyntax.Int,
        VarTypeSyntax.Float,
        VarTypeSyntax.Bool,
        VarTypeSyntax.String,
        VarTypeSyntax.Word,
    };

    private static bool ValidateName(string value)
    {
        if (string.IsNullOrWhiteSpace(value)) return false;

        var firstChar = value.First();
        if (!char.IsLetter(firstChar) && firstChar != '_') return false;

        if (value.Skip(1).Any(x => !char.IsLetterOrDigit(x) && x != '_')) return false;

        return true;
    }

    private static bool ValidateType(string value)
    {
        return types.Any(x => x == value);
    }

    private static ValidationCode ValidateLength(string lengthString)
    {
        if (!lengthString.All(x => char.IsDigit(x)))
        {
            return VarValidationCode.LengthInvalid;
        }

        int length = 0;
        try
        {
            length = int.Parse(lengthString);
        }
        catch (FormatException)
        {
            return VarValidationCode.LengthInvalid;
        }
        catch (OverflowException)
        {
            return VarValidationCode.LengthOverflow;
        }

        if (length < 1) // Length < 1
        {
            return VarValidationCode.LengthNegativeOrZero;
        }

        return ValidationCode.Valid;
    }

    public static ValidationCode Validate(string rawVariable)
    {
        var nameAndType = rawVariable.Split(DelimiterSyntax.VarNameAndType, 2);
        var name = nameAndType[PositionSyntax.VarName];

        if (!ValidateName(name)) return VarValidationCode.NameInvalid;

        if (nameAndType.Length == 1) return VarValidationCode.TypeMissing;

        var typeAndLength = nameAndType[PositionSyntax.VarType].Split(DelimiterSyntax.VarTypeAndLength, 2);
        var type = typeAndLength[PositionSyntax.VarTypeLength];

        if (!ValidateType(type)) return VarValidationCode.TypeInvalid;

        if (typeAndLength.Length == 2)
        {
            switch (type)
            {
                case VarTypeSyntax.Int:
                case VarTypeSyntax.Float:
                case VarTypeSyntax.Bool:
                    return VarValidationCode.LengthNotNeeded;
            }
        }

        switch (type)
        {
            case VarTypeSyntax.String:
            case VarTypeSyntax.Word:
            {
                if (typeAndLength.Length == 1) return VarValidationCode.LengthMissing;

                return ValidateLength(typeAndLength[PositionSyntax.VarLength]);
            }
        }

        return ValidationCode.Valid;
    }
}
