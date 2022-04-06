using AutoMapper;
using Domain.Entities.Users;
using Domain.Models.Users;
using Infrastructure.DbDocuments.Users;

namespace Infrastructure.MapperProfiles;

internal class UserProfile : Profile
{
    public UserProfile()
    {
        this.CreateMap<Session, SessionDocument>().ReverseMap();
        this.CreateMap<Verification, VerificationDocument>().ReverseMap();
        this.CreateMap<User, UserDocument>().ReverseMap();

        this.CreateMap<User, AuthUserModel>();
    }
}
