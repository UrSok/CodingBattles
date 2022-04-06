using Domain.Enums;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Infrastructure.DbDocuments.Common;

internal class MailTemplateDocument
{
    [BsonElement("TemplateCode")]
    [BsonRepresentation(BsonType.String)]
    public MailTemplateCode TemplateCode { get; set; }

    [BsonElement("Subject")]
    public string Subject { get; set; }

    [BsonElement("Body")]
    public string Body { get; set; }
}
