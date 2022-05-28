namespace Domain.Models.Common;

public class Paginated<T>
{
    public int TotalPages { get; set; }
    public int TotalItems { get; set; }
    public IEnumerable<T> Items { get; set; }
}
