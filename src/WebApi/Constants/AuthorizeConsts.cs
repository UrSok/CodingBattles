using Domain.Entities.Users;

namespace WebApi.Constants;

public static class AuthorizeConsts
{
    public const string MemberAndAdmin = Role.Member + "," + Role.Admin;
}
