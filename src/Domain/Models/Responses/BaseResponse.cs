using Domain.Enums;

namespace Domain.Models.Responses;

public class BaseResponse
{
    public ErrorCode ErrorCode { get; set; }
    public bool IsSuccess => 
        ErrorCode == ErrorCode.None;

    public static BaseResponse Success()
    {
        return new BaseResponse();
    }

    public static BaseResponse Failure(ErrorCode errorCode)
    {
        return new BaseResponse { ErrorCode = errorCode };
    }
}

public class BaseResponse<T> : BaseResponse
{
    public T Response { get; set; }

    public static BaseResponse<T> Success(T response)
    {
        return new BaseResponse<T> { Response = response };
    }

    public new static BaseResponse<T> Failure(ErrorCode errorCode)
    {
        return new BaseResponse<T> { ErrorCode = errorCode };
    }

}
