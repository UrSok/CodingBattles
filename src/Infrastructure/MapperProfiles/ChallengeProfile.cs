using AutoMapper;
using Domain.Entities.Challenges;
using Domain.Models.Challenges;
using Domain.Models.Results;
using Infrastructure.DbDocuments.Challenges;

namespace Infrastructure.MapperProfiles;

internal class ChallengeProfile : Profile
{
    public ChallengeProfile()
    {
        this.CreateMap<Feedback, FeedbackDocument>().ReverseMap();
        this.CreateMap<TagEntity, TagDocument>().ReverseMap();
        this.CreateMap<TestCase, TestCaseDocument>().ReverseMap();
        this.CreateMap<TestPair, TestPairDocument>().ReverseMap();
        this.CreateMap<Challenge, ChallengeDocument>().ReverseMap();

        this.CreateMap<ChallengeSaveModel, Challenge>();

        this.CreateMap<Challenge, ChallengeSearchResultItem>();
    }
}
