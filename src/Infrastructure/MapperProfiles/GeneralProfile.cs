using AutoMapper;
using Domain.Entities;
using Domain.Entities.Common;
using Domain.Entities.Games;
using Infrastructure.DbDocuments;
using Infrastructure.DbDocuments.Common;
using Infrastructure.DbDocuments.Games;
using MongoDB.Bson;

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
    }

    private static string GenerateIdIfEmpty(string id) =>
        string.IsNullOrEmpty(id)
            ? ObjectId.GenerateNewId().ToString()
            : id;
}
