using Domain.Enums;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json.Converters;
using System.Text.Json.Serialization;

namespace Infrastructure.DbDocuments.Users;

public class UserDocument : MongoDocument
{
    [BsonElement("Email")]
    public string Email { get; set; }

    [BsonElement("Username")]
    public string Username { get; set; }

    [BsonElement("PasswordSalt")]
    public string PasswordSalt { get; set; }

    [BsonElement("PasswordHash")]
    public string PasswordHash { get; set; }

    [BsonElement("Registered")]
    [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
    public DateTime Registered { get; set; }

    [BsonElement("Role")]
    public string Role { get; set; }

    [BsonElement("Verification")]
    public VerificationDocument Verification { get; set; }

    [BsonElement("Sessions")]
    public List<SessionDocument> Sessions { get; set; }

    // Role: Guest, Member, Admin
    // Guest -> room rights
    // Should add later PassedProblemsIds and their status(Passed/Failed?)
}
