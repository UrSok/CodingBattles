using StubGenerator.StubInput.Constants;
using StubGenerator.StubInput.Models;
using StubGenerator.StubInput.Models.Validation;
using StubGenerator.StubInput.Validator;

namespace StubGenerator.StubInput.Factory;

public static class VariableFactory
{
    private static Variable GetVariable(string[] nameAndType)
    {
        try
        {
            var name = nameAndType[PositionSyntax.VarName];
            var typeAndLength = nameAndType[PositionSyntax.VarType].Split(DelimiterSyntax.VarTypeAndLength, 2);
            var type = typeAndLength[PositionSyntax.VarTypeLength];

            switch (type)
            {
                case VarTypeSyntax.Bool:
                case VarTypeSyntax.Int:
                case VarTypeSyntax.Float:
                    return new Variable(name, type);
                case VarTypeSyntax.String:
                case VarTypeSyntax.Word:
                {
                    var length = int.Parse(typeAndLength[PositionSyntax.VarLength]);

                    return new TextVariable(name, type, length);
                }
                default:
                    throw new Exception("Variable Invalid Unknown!");
            }
        }
        catch
        {
            return new BadVariable(ValidationCode.InvalidUnknown, "");
        }
    }

    public static Variable Get(string rawVariable)
    {
        var validationCode = VarValidator.Validate(rawVariable);
        var nameAndType = rawVariable.Split(DelimiterSyntax.VarNameAndType, 2);

        if (validationCode != ValidationCode.Valid)
        {
            return new BadVariable(validationCode, nameAndType[0]);
        }

        return GetVariable(nameAndType);
    }
}
