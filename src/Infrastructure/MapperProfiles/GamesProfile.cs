using AutoMapper;
using Domain.Models.Results;
using Infrastructure.Services.Compiler.Models;

namespace Infrastructure.MapperProfiles;

public class GamesProfile : Profile
{
    public GamesProfile()
    {
        this.CreateMap<PaizaJobDetails, TestResult>().ReverseMap();
    }
}
