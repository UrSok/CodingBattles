﻿using AutoMapper;
using Domain.Entities.Games;
using Domain.Models.Games.Results;
using Domain.Models.Results;
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
        this.CreateMap<RoundSummary, RoundSummaryDetails>().ReverseMap();
        this.CreateMap<Round, RoundDetails>().ReverseMap();


        this.CreateMap<PaizaJobDetails, TestResult>().ReverseMap();
        this.CreateMap<GameDocument, Game>().ReverseMap();
        this.CreateMap<Game, GameDetails>().ReverseMap();
        this.CreateMap<Game, GameSearchItem>().ReverseMap();
    }
}
