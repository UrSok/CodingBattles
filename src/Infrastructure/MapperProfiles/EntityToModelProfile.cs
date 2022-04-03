using AutoMapper;
using Domain.Entities.Users;
using Domain.Models.Users;

namespace Application.MapperProfiles;

public class EntityToModelProfile : Profile
{
    public EntityToModelProfile()
    {
        this.CreateMap<User, AuthUserModel>();
    }
}
