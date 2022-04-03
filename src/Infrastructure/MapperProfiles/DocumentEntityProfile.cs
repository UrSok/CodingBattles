using AutoMapper;
using Domain.Entities.Common;
using Domain.Entities.Games;
using Domain.Entities.ProgrammingProblems;
using Domain.Entities.Users;
using Infrastructure.DbDocuments.Common;
using Infrastructure.DbDocuments.Games;
using Infrastructure.DbDocuments.ProgrammingProblems;
using Infrastructure.DbDocuments.Users;

namespace Infrastructure.MapperProfiles;

public class DocumentEntityProfile : Profile
{
    public DocumentEntityProfile()
    {
        this.CreateMap<Verification, VerificationDocument>().ReverseMap();
        this.CreateMap<User, UserDocument>().ReverseMap();
        this.CreateMap<Game, GameDocument>().ReverseMap();
        this.CreateMap<ProgrammingProblem, ProgrammingProblemDocument>().ReverseMap();
        this.CreateMap<MailTemplate, MailTemplateDocument>().ReverseMap();
    }
}
