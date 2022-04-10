using StubGenerator.StubInput;
using StubGenerator.StubInput.Models;
using StubGenerator.StubInput.Models.Validation;
using StubGenerator.StubOutput;
using StubGenerator.StubOutput.Models;
using System;

namespace StubGenerator;

public class StubInputError
{
    public int Line { get; set; }

    public ValidationCode ValidationCode { get; set; }

    public string? CulpritName { get; set; }

    public StubInputError(int line, ValidationCode validationCode, string? culpritName = null)
    {
        Line = line;
        ValidationCode = validationCode;
        CulpritName = culpritName;
    }
}

public class GeneratorResult
{
    public string? Stub { get; set; }

    public bool IsSuccess
        => Error is null;

    public StubInputError? Error { get; set; }

    public GeneratorResult()
    {

    }

    public GeneratorResult(string stub)
    {
        Stub = stub;
    }
}


public static class StubGeneratorEntry
{
    public static GeneratorResult GenerateError(InputParserResult parserResult)
    {
        StubInputError stubInputError = new StubInputError(-1, ValidationCode.InvalidUnknown, "System");

        var statement = parserResult.Statements.First();

        if (parserResult.ValidationCode == ValidationCode.BadStatement)
        {
            var badStatement = (BadStatement)statement;

            badStatement.ValidationCode
                .When(StatementValidationCode.KeywordInvalid)
                    .Then(() => stubInputError = new StubInputError(badStatement.LineNumber, badStatement.ValidationCode, badStatement.Keyword))
                .Default(() => stubInputError = new StubInputError(badStatement.LineNumber, badStatement.ValidationCode, badStatement.Keyword));
        }
        else if (parserResult.ValidationCode == ValidationCode.BadVariable)
        {
            var inputStatement = (InputStatement)statement;
            var badVariable = inputStatement.Variables.OfType<BadVariable>().First();


            badVariable.ValidationCode
                .When(VarValidationCode.LengthNotNeeded)
                    .Then(() => stubInputError = new StubInputError(inputStatement.LineNumber, badVariable.ValidationCode, badVariable.Type))
                .When(VarValidationCode.TypeInvalid)
                    .Then(() => stubInputError = new StubInputError(inputStatement.LineNumber, badVariable.ValidationCode, badVariable.Type))
                .Default(() => stubInputError = new StubInputError(inputStatement.LineNumber, badVariable.ValidationCode, badVariable.Name));

        }
        else if (parserResult.ValidationCode != ValidationCode.InvalidUnknown)
        {
            parserResult.ValidationCode
                .When(FinalValidationCode.LoopVariableNotDeclared).Then(() =>
                {
                    var inputLoop = (InputloopStatement)statement;

                    stubInputError = new StubInputError(inputLoop.LineNumber, parserResult.ValidationCode, inputLoop.LoopVariableName);
                })
                .When(FinalValidationCode.LoopVariableTypeNotIntOrFloat).Then(() =>
                {
                    var inputLoop = (InputloopStatement)statement;

                    stubInputError = new StubInputError(inputLoop.LineNumber, parserResult.ValidationCode, inputLoop.LoopVariableName);
                })
                .When(FinalValidationCode.StringVariableShouldBeSingle).Then(() =>
                {
                    stubInputError = new StubInputError(statement.LineNumber, parserResult.ValidationCode);
                })
                .When(FinalValidationCode.VariableAlreadyDeclared).Then(() =>
                {
                    var variable = ((InputStatement)statement).Variables.First();

                    stubInputError = new StubInputError(statement.LineNumber, parserResult.ValidationCode, variable.Name);
                });
        }

        return new GeneratorResult()
        {
            Error = stubInputError
        };
    }

    public static GeneratorResult? Generate(int languageValue, string input)
    {
        var language = Language.FromValue(languageValue, Language.Unknown);

        if (language == Language.Unknown) return null;

        var inputParserResult = InputParser.Parse(input);

        if (inputParserResult.ValidationCode == ValidationCode.Skipped)
        {
            return new GeneratorResult("");
        }

        if (inputParserResult.ValidationCode != ValidationCode.Valid)
        {
            return GenerateError(inputParserResult);
        }

        var generatedStub = OutputParser.Parse(language, inputParserResult.Statements);
        return new GeneratorResult(generatedStub);
    }
}
