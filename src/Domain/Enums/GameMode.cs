using Ardalis.SmartEnum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Enums;

public class GameMode : SmartEnum<GameMode>
{
    public static GameMode Classic = new("classic", 1);
    public static GameMode Reverse = new("reverse", 2);
    public static GameMode Shortest = new("shortest", 3);
    public static GameMode FastestComputation = new("fastestComputation", 4);

    public GameMode(string name, int value) : base(name, value)
    {
    }
}