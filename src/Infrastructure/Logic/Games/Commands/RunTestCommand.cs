using AutoMapper;
using Domain.Entities.Challenges;
using Domain.Enums.Errors;
using Domain.Models.Games;
using Domain.Models.Results;
using FluentValidation;
using Infrastructure.Services.Compiler;
using Infrastructure.Services.Compiler.Models;
using MediatR;

namespace Infrastructure.Logic.Games.Commands;
internal record RunTestCommand(RunTestRequest Model) : IRequest<Result<RunTestResult>>;

internal class RunTestCommandValidator : AbstractValidator<RunTestCommand>
{
    public RunTestCommandValidator()
    {

    }
}

internal class RunTestCommandHandler : IRequestHandler<RunTestCommand, Result<RunTestResult>>
{
    private readonly IPaizaService paizaService;
    private readonly IMapper mapper;

    public RunTestCommandHandler(IPaizaService paizaService, IMapper mapper)
    {
        this.paizaService = paizaService;
        this.mapper = mapper;
    }

    public async Task<Result<RunTestResult>> Handle(RunTestCommand request, CancellationToken cancellationToken)
    {
        var testSolutionResult = new RunTestResult
        {
            Id = request.Model.Id,
        };

        var testResult = await this.paizaService.Execute(request.Model.SourceCode, request.Model.Language, request.Model.Test.Case.Input, cancellationToken);
        testSolutionResult.Test = this.mapper.Map<TestResult>(testResult);

        var (testValidationCode, testErrorString) = this.ValidateTestAndGetResult(testResult, request.Model.Test.Case.ExpectedOutput); 

        if (testValidationCode != 0)
        {
            testSolutionResult.OutputError = testErrorString;
            return Result<RunTestResult>.Failure(testSolutionResult, testValidationCode == -1 ? ProcessingError.TestNotPassed : ProcessingError.BuildError);
        }

        var validatorResult = await this.paizaService.Execute(request.Model.SourceCode, request.Model.Language, request.Model.Test.Validator.Input, cancellationToken);
        testSolutionResult.Test = this.mapper.Map<TestResult>(validatorResult);

        var (validatorValidationCode, validatorErrorString) = this.ValidateTestAndGetResult(validatorResult, request.Model.Test.Validator.ExpectedOutput);

        if (validatorValidationCode != 0)
        {
            testSolutionResult.OutputError = validatorErrorString;
            return Result<RunTestResult>.Failure(testSolutionResult, validatorValidationCode == -1 ? ProcessingError.ValidatorNotPassed : ProcessingError.BuildError);
        }

        return Result<RunTestResult>.Success(testSolutionResult);
    }

    // -2 - build fail
    // -1 - test fail
    // 0 - good
    private (int, string) ValidateTestAndGetResult(PaizaJobDetails testResult, string expectedOutput)
    {
        if (testResult is null || (testResult.BuildResult is not null 
            && testResult.BuildResult != PaizaJobDetailsResult.Success)
            || testResult.Result != PaizaJobDetailsResult.Success)
        {
            return (-2, testResult?.BuildStderr);
        }

        if (this.RemoveNewLine(testResult.Stdout) != expectedOutput)
        {
            return (-1, this.RemoveNewLine(testResult.Stdout));
        }

        return (0, string.Empty);

    }

    private string RemoveNewLine(string input)
    {
        if (input.EndsWith("\n"))
            return input[0..^1];
        return input;
    }
}
