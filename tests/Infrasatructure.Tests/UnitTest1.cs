using Infrastructure.Services.Compiler;
using NUnit.Framework;
using System.Threading.Tasks;

namespace Infrasatructure.Tests;
public class Tests
{
    [SetUp]
    public void Setup()
    {
    }

    [Test]
    public async Task Test1()
    {
        await new PaizaService().Execute("letg v = 0; for(; v < 100000; v+=1) {}", "typescript", "5");
    }
}