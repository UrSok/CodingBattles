using AutoMapper;
using Domain.Entities.Users;
using Domain.Models.Users;

namespace Infrastructure.MapperProfiles;

internal class EntityToModelProfile : Profile
{
    public EntityToModelProfile()
    {
        this.CreateMap<User, AuthUserModel>();
    }
}
