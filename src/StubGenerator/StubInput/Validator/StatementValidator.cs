using StubGenerator.StubInput.Constants;
using StubGenerator.StubInput.Models.Validation;

namespace StubGenerator.StubInput.Validator;

public static class StatementValidator
{
    private static readonly List<string> keywords = new()
    {
        KeywordSyntax.Input,
        KeywordSyntax.Inputloop,
        KeywordSyntax.Output,
    };

    private static bool ValidateKeyword(string value)
    {
        return keywords.Any(x => x == value);
    }

    private static ValidationCode ValidateValue(string[] keywordAndValue)
    {
        var keyword = keywordAndValue[PositionSyntax.StatementKeyword];

        if (keywordAndValue.Length == 1)
        {
            switch (keyword)
            {
                case KeywordSyntax.Output:
                    return StatementValidationCode.TextMissing;
                case KeywordSyntax.Input:
                    return StatementValidationCode.VariablesMissing;
                case KeywordSyntax.Inputloop:
                    return StatementValidationCode.LoopValueMissing;
            }
        }

        if (keyword == KeywordSyntax.Inputloop)
        {
            var loopAndVariables = keywordAndValue[PositionSyntax.StatementValue].Split(DelimiterSyntax.LoopTimesAndValue, 2);

            if (loopAndVariables.Length == 1)
            {
                return StatementValidationCode.LoopVariablesMissing;
            }
        }

        return ValidationCode.Valid;
    }

    public static ValidationCode Validate(string rawStatement)
    {
        var keywordAndValue = rawStatement.Split(DelimiterSyntax.StatementAndValue, 2);

        if (!ValidateKeyword(keywordAndValue[PositionSyntax.StatementKeyword])) return StatementValidationCode.KeywordInvalid;

        return ValidateValue(keywordAndValue);
    }
}
