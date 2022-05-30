using Ardalis.SmartEnum;

namespace Domain.Enums;

public class ChallengeSelectorType : SmartEnum<ChallengeSelectorType>
{
    public static ChallengeSelectorType Specific = new("specific", 1);
    public static ChallengeSelectorType Random = new("random", 2);
    public static ChallengeSelectorType RandomNotPassed = new("randomNotPassed", 3);

    public ChallengeSelectorType(string name, int value) : base(name, value)
    {
    }
}
