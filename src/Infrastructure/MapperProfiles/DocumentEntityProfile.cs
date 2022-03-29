using AutoMapper;
using Domain.Entities.Games;
using Domain.Entities.ProgrammingProblems;
using Domain.Entities.Users;
using Infrastructure.DbDocuments.Games;
using Infrastructure.DbDocuments.ProgrammingProblems;
using Infrastructure.DbDocuments.Users;

namespace Infrastructure.MapperProfiles;

public class DocumentEntityProfile : Profile
{
    public DocumentEntityProfile()
    {
        CreateMap<User, UserDocument>().ReverseMap();
        CreateMap<Game, GameDocument>().ReverseMap();
        CreateMap<ProgrammingProblem, ProgrammingProblemDocument>().ReverseMap();
    }
}
