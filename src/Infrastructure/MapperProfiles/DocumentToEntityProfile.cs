using AutoMapper;
using Domain.Entities;
using Domain.Entities.Common;
using Domain.Entities.Games;
using Domain.Entities.ProgrammingProblems;
using Domain.Entities.Users;
using Infrastructure.DbDocuments;
using Infrastructure.DbDocuments.Common;
using Infrastructure.DbDocuments.Games;
using Infrastructure.DbDocuments.ProgrammingProblems;
using Infrastructure.DbDocuments.Users;
using MongoDB.Bson;

namespace Infrastructure.MapperProfiles;

public class DocumentToEntityProfile : Profile
{
    public DocumentToEntityProfile()
    {
        this.CreateMap<BaseEntity, MongoDocument>()
            .ForMember(destination => destination.Id, 
            action => 
                action.MapFrom(source => string.IsNullOrEmpty(source.Id) 
                    ? ObjectId.GenerateNewId().ToString()
                    : source.Id));

        this.CreateMap<Session, SessionDocument>().ReverseMap();
        this.CreateMap<Verification, VerificationDocument>().ReverseMap();
        this.CreateMap<User, UserDocument>().ReverseMap();
        this.CreateMap<Game, GameDocument>().ReverseMap();
        this.CreateMap<ProgrammingProblem, ProgrammingProblemDocument>().ReverseMap();
        this.CreateMap<MailTemplate, MailTemplateDocument>().ReverseMap();
    }
}
