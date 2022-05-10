using AutoMapper;
using Domain.Models.Games;
using Infrastructure.Services.Compiler.Models;

namespace Infrastructure.MapperProfiles;

public class GamesProfile : Profile
{
    public GamesProfile()
    {
        this.CreateMap<PaizaJobDetails, RunResult>().ReverseMap();
    }
}
