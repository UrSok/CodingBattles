using Cronos;
using System;

namespace WebApi.Schedulers
{
    internal static class ExpressionHelper
    {
        internal static CronExpression ParseExpression(string expression)
        {
            var cronosFormat = CronFormat.Standard;
            string[] expressionSections = expression.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            if (expressionSections.Length == 6)
            {
                cronosFormat = CronFormat.IncludeSeconds;
            }

            return CronExpression.Parse(expression, cronosFormat);
        }
    }
}