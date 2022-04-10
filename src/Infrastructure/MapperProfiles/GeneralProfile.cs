using AutoMapper;
using Domain.Entities.Common;
using Domain.Entities.Games;
using Domain.Models.Results;
using Infrastructure.DbDocuments.Common;
using Infrastructure.DbDocuments.Games;
using MongoDB.Bson;
using StubGenerator;

namespace Infrastructure.MapperProfiles;

internal class GeneralProfile : Profile
{
    public GeneralProfile()
    {
        /*this.CreateMap<EntityWithId, MongoDocumentWithId>()
            .ForMember(destination => destination.Id,
            action =>
                action.MapFrom(source => GenerateIdIfEmpty(source.Id)));*/

        this.CreateMap<Solution, SolutionDocument>().ReverseMap();
        this.CreateMap<Game, GameDocument>().ReverseMap();
        this.CreateMap<MailTemplate, MailTemplateDocument>().ReverseMap();

        this.CreateMap<StubInputError, StubGeneratorError>()
            .ForMember(destination => destination.ValidationCode,
                action 
                    => action.MapFrom(source => source.ValidationCode.Name));
        this.CreateMap<GeneratorResult, StubGeneratorResult>();
    }

    private static string GenerateIdIfEmpty(string id) =>
        string.IsNullOrEmpty(id)
            ? ObjectId.GenerateNewId().ToString()
            : id;
}
