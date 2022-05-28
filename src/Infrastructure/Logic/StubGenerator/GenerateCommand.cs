using AutoMapper;
using Domain.Enums;
using Domain.Enums.Errors;
using Domain.Models.Common.Results;
using Domain.Models.General.RequestsResults;
using FluentValidation;
using Infrastructure.Utils.Validation;
using MediatR;
using StubGenerator;

namespace Infrastructure.Logic.StubGenerator;

internal record GenerateCommand(GenerateStubRequest Model) : IRequest<Result<GenerateStubResult>>;

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

internal class GenerateHandler : IRequestHandler<GenerateCommand, Result<GenerateStubResult>>
{
    private readonly IMapper mapper;

    public GenerateHandler(IMapper mapper)
    {
        this.mapper = mapper;
    }

    public Task<Result<GenerateStubResult>> Handle(GenerateCommand request, CancellationToken cancellationToken)
    {
        Language.TryFromName(request.Model.Language, out Language language);

        var stubGeneratorResult = StubGeneratorEntry.Generate(language, request.Model.Input);

        if (stubGeneratorResult is null)
        {
            return Task.FromResult(Result<GenerateStubResult>.Failure(ProcessingError.UnsupportedStubGeneratorLanguage));
        }

        var generateResult = this.mapper.Map<GenerateStubResult>(stubGeneratorResult);
        if (!stubGeneratorResult.IsSuccess)
        {
            return Task.FromResult(Result<GenerateStubResult>.Failure(generateResult, ProcessingError.StubGeneratorError));
        }

        return Task.FromResult(Result<GenerateStubResult>.Success(generateResult));
    }
}
