using Application;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using Infrastructure;
using Infrastructure.Options;
using Microsoft.OpenApi.Models;
using MongoDB.ApplicationInsights.DependencyInjection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

#region Custom DI region
builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());
var configuration = builder.Configuration;

builder.Host.ConfigureContainer<ContainerBuilder>(builder =>
{
    builder.RegisterModule(new InfrastructureModule(configuration));
    builder.RegisterModule(new ApplicationModule(configuration));
});
#endregion


builder.Services.AddControllers();

builder.Services.AddRouting(options => options.LowercaseUrls = true);
builder.Services.AddHttpContextAccessor();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(opt =>
{
    opt.SwaggerDoc("v1", new OpenApiInfo { Title = "CodingBattlesApi", Version = "v1" });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(opt => 
        opt.SwaggerEndpoint("/swagger/v1/swagger.json", "CodingBattlesApi v1"));
}

app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
