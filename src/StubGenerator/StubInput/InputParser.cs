using StubGenerator.StubInput.Constants;
using StubGenerator.StubInput.Factory;
using StubGenerator.StubInput.Models;
using StubGenerator.StubInput.Models.Validation;
using StubGenerator.StubInput.Validator;
using System.Text.RegularExpressions;

namespace StubGenerator.StubInput;

public static class InputParser
{
    private static List<Variable> TryParseVariables(string rawVariables)
    {
        var variableStringList = rawVariables.Split(DelimiterSyntax.Var);
        var variableList = new List<Variable>();

        foreach (var variableString in variableStringList)
        {
            var variable = VariableFactory.Get(variableString);

            if (variable is BadVariable)
            {
                return new List<Variable> { variable };
            }

            variableList.Add(variable);
        }

        return variableList;
    }

    private static (bool, Statement) TryParseStatement(string line)
    {
        var statement = StatementFactory.Get(line);

        if (statement is BadStatement)
        {
            return (false, statement);
        }

        if (statement is InputStatement inputStatement)
        {
            var variables = TryParseVariables(inputStatement.RawVariables);

            if (variables.First() is BadVariable badVariable)
            {
                inputStatement.Variables.Add(badVariable);
                return (false, statement);
            }

            inputStatement.Variables.AddRange(variables);
        }

        return (true, statement);
    }

    private static InputParserResult ParseLines(string[] lines)
    {
        var finalValidator = new FinalValidator();
        var validParserResult = new InputParserResult()
        {
            ValidationCode = ValidationCode.Valid
        };

        foreach (var (line, lineNumber) in lines
            .Select((line, index) => (line, index + 1)))
        {
            if (string.IsNullOrWhiteSpace(line)) continue;

            var (isSuccess, statement) = TryParseStatement(line);
            statement.LineNumber = lineNumber;

            if (!isSuccess)
            {
                if (statement is BadStatement badStatement)
                {
                    return InputParserResult.GetInvalidResultWithCode(ValidationCode.BadStatement, badStatement);
                }

                if (statement is InputStatement inputStatement)
                {
                    var badVariable = inputStatement.Variables.First();

                    return InputParserResult.GetInvalidResultWithCode(ValidationCode.BadVariable, inputStatement);
                }

                return InputParserResult.GetInvalidResultWithCode(ValidationCode.InvalidUnknown, statement);
            }

            var validationCode = finalValidator.Validate(statement);

            if (validationCode != ValidationCode.Valid)
            {
                return InputParserResult.GetInvalidResultWithCode(validationCode, statement);
            }

            validParserResult.Statements.Add(statement);
        }

        return validParserResult;
    }

    public static InputParserResult Parse(string input)
    {
        Regex regex = new Regex("[ ]{2,}", RegexOptions.None);

        if (string.IsNullOrWhiteSpace(input))
        {
            return new InputParserResult()
            {
                ValidationCode = ValidationCode.Skipped
            };
        }

        var lines = input.Split('\n');
        var cleanedLines = lines
            .Select(x => regex.Replace(x, " ").Trim()).ToArray();

        return ParseLines(cleanedLines);
    }
}
