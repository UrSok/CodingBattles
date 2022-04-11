using Domain.Entities.Users;

namespace WebApi.Constants;

public static class AuthorizeConsts
{
    public const string MemberOrAdmin = Role.Member + "," + Role.Admin;
    public const string All = Role.Guest + "," + Role.UnverifiedMember + "," + Role.Member + "," + Role.Admin;
}
