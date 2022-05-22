using AutoMapper;

namespace Infrastructure.Repositories;

internal abstract class BaseRepository
{
    protected readonly IMapper mapper;

    protected BaseRepository(IMapper mapper)
    {
        this.mapper = mapper;
    }
}
