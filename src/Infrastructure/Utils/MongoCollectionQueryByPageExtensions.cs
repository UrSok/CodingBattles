using Domain.Enums;
using MongoDB.Driver;

namespace Infrastructure.Utils;

//TODO: improve sorting problem someday.. : https://stackoverflow.com/questions/56815949/mongodb-c-sharp-case-insensitive-sort-and-index
public static class MongoCollectionQueryByPageExtensions
{
    public static async Task<(int totalPages, int totalPageItems, IReadOnlyList<TDocument> data)> AggregateByPage<TDocument>(
        this IMongoCollection<TDocument> collection,
        FilterDefinition<TDocument> filterDefinition,
        string sortBy,
        OrderStyle order,
        int page,
        int pageSize)
    {
        var countFacet = AggregateFacet.Create("count",
            PipelineDefinition<TDocument, AggregateCountResult>.Create(new[]
            {
                    PipelineStageDefinitionBuilder.Count<TDocument>()
            }));
        var dataPipeline = GetDataPipeline<TDocument>(sortBy, order, page, pageSize);

        var dataFacet = AggregateFacet.Create("data",
            PipelineDefinition<TDocument, TDocument>.Create(dataPipeline));

        var aggregation = await collection.Aggregate()
            .Match(filterDefinition)
            .Facet(countFacet, dataFacet)
            .ToListAsync();

        var count = (int)(aggregation.First()
            .Facets
            .First(x => x.Name == "count")
            .Output<AggregateCountResult>()
            .FirstOrDefault()
            ?.Count ?? 0);

        var totalPages = GetTotalPages(pageSize, count);

        var data = aggregation.First()
            .Facets.First(x => x.Name == "data")
            .Output<TDocument>();

        return (totalPages, count, data);
    }

    private static int GetTotalPages(int pageSize, long count)
    {
        if (count == 0)
        {
            return 0;
        }

        if (pageSize <= 0)
        {
            return 1;
        }

        return (int)Math.Ceiling((double)count / pageSize);
    }

    private static IList<PipelineStageDefinition<TDocument, TDocument>>
        GetDataPipeline<TDocument>(string sortBy, OrderStyle order, int page, int pageSize)
    {
        var dataPipeline = new List<PipelineStageDefinition<TDocument, TDocument>>();
        if (!string.IsNullOrEmpty(sortBy))
        {
            var sortDefinition = GetSortDefinition<TDocument>(sortBy, order);
            dataPipeline.Add(PipelineStageDefinitionBuilder.Sort(sortDefinition));
        }

        if (page > 0)
        {
            dataPipeline.Add(PipelineStageDefinitionBuilder.Skip<TDocument>((page - 1) * pageSize));
        }

        if (pageSize > 0)
        {
            dataPipeline.Add(PipelineStageDefinitionBuilder.Limit<TDocument>(pageSize));
        }

        return dataPipeline;
    }

    private static SortDefinition<TDocument> GetSortDefinition<TDocument>(string sortBy, OrderStyle order)
    {
        SortDefinition<TDocument> sortDefinition = null;
        if (!string.IsNullOrWhiteSpace(sortBy))
        {
            var firstSortByLetterUpper = char.ToUpper(sortBy[0]);
            var sortByWithoutFirstChar = sortBy[1..].ToLower();
            var sortByNormalized = firstSortByLetterUpper + sortByWithoutFirstChar;
            FieldDefinition<TDocument> sortByField = new StringFieldDefinition<TDocument>(sortByNormalized);
            sortDefinition = order == OrderStyle.Ascend
                ? Builders<TDocument>.Sort.Ascending(sortByField)
                : Builders<TDocument>.Sort.Descending(sortByField);
        }

        return sortDefinition;
    }
}
