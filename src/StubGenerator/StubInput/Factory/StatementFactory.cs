using StubGenerator.StubInput.Constants;
using StubGenerator.StubInput.Models;
using StubGenerator.StubInput.Models.Validation;
using StubGenerator.StubInput.Validator;

namespace StubGenerator.StubInput.Factory;

public static class StatementFactory
{
    private static InputloopStatement GetInputloopStatement(string value)
    {
        var loopAndVariables = value.Split(DelimiterSyntax.LoopTimesAndValue, 2);
        var loopValue = loopAndVariables[PositionSyntax.StatementLoopValue];
        var loopVariables = loopAndVariables[PositionSyntax.StatementLoopVariables];

        if (loopValue.All(x => char.IsDigit(x)))
        {
            var loopTimes = int.Parse(loopValue);

            return new InputloopStatement(KeywordSyntax.Inputloop, loopVariables, loopTimes);
        }

        return new InputloopStatement(KeywordSyntax.Inputloop, loopVariables, loopValue);
    }

    private static Statement GetStatement(string[] keywordAndValue)
    {
        try
        {
            var keyword = keywordAndValue[PositionSyntax.StatementKeyword];
            var value = keywordAndValue[PositionSyntax.StatementValue];

            return keyword switch
            {
                KeywordSyntax.Output => new OutputStatement(keyword, value),
                KeywordSyntax.Input => new InputStatement(keyword, value),
                KeywordSyntax.Inputloop => GetInputloopStatement(value),
                _ => throw new Exception("Statement Invalid Unknown!"),
            };
        }
        catch
        {
            return new BadStatement(ValidationCode.InvalidUnknown, "");
        }
    }

    public static Statement Get(string rawStatement)
    {
        var validatorCode = StatementValidator.Validate(rawStatement);
        var keywordAndValue = rawStatement.Split(DelimiterSyntax.StatementAndValue, 2);

        if (validatorCode != ValidationCode.Valid)
        {
            return new BadStatement(validatorCode, keywordAndValue[PositionSyntax.StatementKeyword]);
        }

        return GetStatement(keywordAndValue);
    }
}
