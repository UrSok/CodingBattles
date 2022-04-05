using StubGenerator.StubInput;
using StubGenerator.StubInput.Models;
using StubGenerator.StubInput.Models.Validation;
using StubGenerator.StubOutput;
using StubGenerator.StubOutput.Models;

namespace StubGenerator;

public class GeneratorResult
{
    public string Code { get; set; }
    public bool IsSuccess { get; set; }
    public string Error { get; set; }

    public GeneratorResult(bool isSuccess, string error)
    {
        Code = "";
        IsSuccess = isSuccess;
        Error = error;
    }

    public GeneratorResult(string code, bool isSuccess)
    {
        Code = code;
        IsSuccess = isSuccess;
        Error = "";
    }
}

public static class GeneratorManager
{
    private static string ParseError(InputParserResult parserResult)
    {

        if (parserResult.ValidationCode == ValidationCode.Skipped)
        {
            return "";
        }

        var statement = parserResult.Statements.First();
        var error = $"Line {statement.LineNumber} error: ";

        if (parserResult.ValidationCode == ValidationCode.BadStatement)
        {
            var badStatement = (BadStatement)statement;

            badStatement.ValidationCode
                .When(StatementValidationCode.KeywordInvalid).Then(() => error += $"'{badStatement.Keyword}' is not a valid keyword.")
                .When(StatementValidationCode.TextMissing).Then(() => error += $"Missing text for output.")
                .When(StatementValidationCode.VariablesMissing).Then(() => error += $"Missing variables for input.")
                .When(StatementValidationCode.LoopValueMissing).Then(() => error += $"Missing loop condition value for inputloop.")
                .When(StatementValidationCode.LoopVariableNameInvalid).Then(() => error += $"Invalid loop condition variable name for inputloop.")
                .When(StatementValidationCode.LoopVariablesMissing).Then(() => error += $"Missing variables for inputloop.");

            return error;
        }

        if (parserResult.ValidationCode == ValidationCode.BadVariable)
        {
            var inputStatement = (InputStatement)statement;
            var badVariable = inputStatement.Variables.OfType<BadVariable>().First();

            badVariable.ValidationCode
                .When(VarValidationCode.NameInvalid).Then(() => error += $"Invalid variable name.")
                .When(VarValidationCode.TypeMissing).Then(() => error += $"Missing type for '{badVariable.Name}' variable.")
                .When(VarValidationCode.TypeInvalid).Then(() => error += $"Invalid type for '{badVariable.Name}' variable.")
                .When(VarValidationCode.LengthMissing).Then(() => error += $"Missing length for '{badVariable.Name}' variable.")
                .When(VarValidationCode.LengthInvalid).Then(() => error += $"Invalid length for '{badVariable.Name}' variable.")
                .When(VarValidationCode.LengthOverflow).Then(() => error += $"Length overflow for '{badVariable.Name}' variable.")
                .When(VarValidationCode.LengthNegativeOrZero).Then(() => error += $"Length negative or zero for '{badVariable.Name}' variable.")
                .When(VarValidationCode.LengthNotNeeded).Then(() => error += $"Length is not needed for '{badVariable.Type}' variable typ.");

            return error;
        }

        if (parserResult.ValidationCode != ValidationCode.InvalidUnknown)
        {

            parserResult.ValidationCode
                .When(FinalValidationCode.LoopVariableNotDeclared).Then(() =>
                {
                    var inputLoop = (InputloopStatement)statement;

                    error += $"'{inputLoop.LoopVariableName}' was not declared in this scope.";
                })
                .When(FinalValidationCode.LoopVariableTypeNotIntOrFloat).Then(() =>
                {
                    var inputLoop = (InputloopStatement)statement;

                    error += $"'{inputLoop.LoopVariableName}' is of type string/word.";
                })
                .When(FinalValidationCode.StringVariableShouldBeSingle).Then(() =>
                {
                    error += $"Cannot use string with multiple variables.";
                })
                .When(FinalValidationCode.VariableAlreadyDeclared).Then(() =>
                {
                    var variable = ((InputStatement)statement).Variables.First();

                    error += $"'{variable.Name}' was already declared in this scope.";
                });

            return error;
        }



        return error += $"Internal error of unknown type!";
    }

    public static GeneratorResult Generate(Language language, string input)
    {
        var inputParserResult = InputParser.Parse(input);

        if (inputParserResult.ValidationCode != ValidationCode.Valid)
        {
            return new GeneratorResult(false, ParseError(inputParserResult)); ;
        }

        var generatedStub = OutputParser.Parse(language, inputParserResult.Statements);

        return new GeneratorResult(generatedStub, true);
    }
}
