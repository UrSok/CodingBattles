using AutoMapper;
using Domain.Entities.Games;
using Domain.Models.Games;
using Infrastructure.DbDocuments.Games;
using Infrastructure.Services.Compiler.Models;

namespace Infrastructure.MapperProfiles;

public class GamesProfile : Profile
{
    public GamesProfile()
    {
        this.CreateMap<RoundDocument, Round>().ReverseMap();
        this.CreateMap<RoundSummaryDocument, RoundSummary>().ReverseMap();
        this.CreateMap<TestSummaryDocument, TestSummary>().ReverseMap();
        this.CreateMap<RoundSummary, RoundSummaryDto>().ReverseMap();
        this.CreateMap<Round, RoundDto>().ReverseMap();


        this.CreateMap<PaizaJobDetails, TestResult>().ReverseMap();
        this.CreateMap<GameDocument, Game>().ReverseMap();
        this.CreateMap<Game, GameDto>().ReverseMap();
        this.CreateMap<Game, GameSearchItem>().ReverseMap();
    }
}
