namespace Domain.Models.Common;

public class PaginatedModel<T>
{
    public int TotalPages { get; set; }
    public int TotalItems { get; set; }
    public IEnumerable<T> Items { get; set; }
}
