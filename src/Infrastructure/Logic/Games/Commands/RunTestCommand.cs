using AutoMapper;
using Domain.Enums.Errors;
using Domain.Models.Common;
using Domain.Models.Games;
using Domain.Models.Results;
using FluentValidation;
using Infrastructure.Services.Compiler;
using Infrastructure.Services.Compiler.Models;
using Infrastructure.Utils.Validation;
using MediatR;

namespace Infrastructure.Logic.Games.Commands;
internal record RunTestCommand(RunTestModel Model) : IRequest<Result<RuntTestResult>>;

internal class RunTestCommandValidator : AbstractValidator<RunTestCommand>
{
    public RunTestCommandValidator()
    {

    }
}

internal class RunTestCommandHandler : IRequestHandler<RunTestCommand, Result<RuntTestResult>>
{
    private readonly IPaizaService paizaService;
    private readonly IMapper mapper;

    public RunTestCommandHandler(IPaizaService paizaService, IMapper mapper)
    {
        this.paizaService = paizaService;
        this.mapper = mapper;
    }

    public async Task<Result<RuntTestResult>> Handle(RunTestCommand request, CancellationToken cancellationToken)
    {
        var testSolutionResult = new RuntTestResult();
        var testResult = await this.paizaService.Execute(request.Model.SourceCode, request.Model.Language, request.Model.Test.Case.Input, cancellationToken);
        testSolutionResult.Test = this.mapper.Map<RunResult>(testResult);
        if (testResult is null 
            || testResult.BuildResult != PaizaJobDetailsResult.Success 
            || testResult.Result != PaizaJobDetailsResult.Success 
            || this.RemoveNewLine(testResult.Stdout) != request.Model.Test.Case.ExpectedOutput)
        {
            return Result<RuntTestResult>.Failure(testSolutionResult, ProcessingError.TestNotPassed);
        }

        var validatorResult = await this.paizaService.Execute(request.Model.SourceCode, request.Model.Language, request.Model.Test.Validator.Input, cancellationToken);
        testSolutionResult.Test = this.mapper.Map<RunResult>(validatorResult);
        if (validatorResult is null
            || validatorResult.BuildResult != PaizaJobDetailsResult.Success 
            || validatorResult.Result != PaizaJobDetailsResult.Success 
            || this.RemoveNewLine(validatorResult.Stdout) != request.Model.Test.Validator.ExpectedOutput)
        {
            return Result<RuntTestResult>.Failure(testSolutionResult, ProcessingError.ValidatorNotPassed);
        }

        return Result<RuntTestResult>.Success(testSolutionResult);
    }

    private string RemoveNewLine(string input)
    {
        if (input.EndsWith("\n")) 
             return input.Substring(0, input.Length - 1);
        return input;
    }
}
