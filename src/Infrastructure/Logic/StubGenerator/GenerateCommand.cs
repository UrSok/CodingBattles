using AutoMapper;
using Domain.Enums;
using Domain.Enums.Errors;
using Domain.Models.Common;
using Domain.Models.Results;
using FluentValidation;
using Infrastructure.Utils.Validation;
using MediatR;
using StubGenerator;

namespace Infrastructure.Logic.StubGenerator;

internal record GenerateCommand(StubGeneratorModel Model) : IRequest<Result<StubGeneratorResult>>;

internal class GenerateCommandValidator : AbstractValidator<GenerateCommand>
{
    public GenerateCommandValidator()
    {
        this.RuleFor(x => x.Model.Language)
            .NotEmpty().WithError(ValidationError.EmptyLanguage);

        this.RuleFor(x => x.Model.Input)
            .NotEmpty().WithError(ValidationError.EmptyStubGeneratorInput);

    }
}

internal class GenerateHandler : IRequestHandler<GenerateCommand, Result<StubGeneratorResult>>
{
    private readonly IMapper mapper;

    public GenerateHandler(IMapper mapper)
    {
        this.mapper = mapper;
    }

    public Task<Result<StubGeneratorResult>> Handle(GenerateCommand request, CancellationToken cancellationToken)
    {
        Language.TryFromName(request.Model.Language, out Language language);

        var stubGeneratorResult = StubGeneratorEntry.Generate(language, request.Model.Input);

        if (stubGeneratorResult is null)
        {
            return Task.FromResult(Result<StubGeneratorResult>.Failure(ProcessingError.UnsupportedStubGeneratorLanguage));
        }

        var generateResult = this.mapper.Map<StubGeneratorResult>(stubGeneratorResult);
        if (!stubGeneratorResult.IsSuccess)
        {
            return Task.FromResult(Result<StubGeneratorResult>.Failure(generateResult, ProcessingError.StubGeneratorError));
        }

        return Task.FromResult(Result<StubGeneratorResult>.Success(generateResult));
    }
}
