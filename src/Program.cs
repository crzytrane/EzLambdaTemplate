using EzLambda;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddEnvironmentVariables("EzLambda_");

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var authenticationBuilder = builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
});

authenticationBuilder.AddJwtBearer(options =>
{
    var authority = builder.Configuration["auth:oidc:authority"];
    options.Authority = $"https://{authority}";
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        ValidateAudience = false
    };
});
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy =>
        policy.RequireAssertion(context =>
            context.User.HasClaim(c => c.Type == "cognito:groups" && c.Value == "Admin")));
});

builder.Services.AddControllers();
builder.Services.AddAWSLambdaHosting(LambdaEventSource.HttpApi);

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    //     app.UseExceptionHandler("/Error");
    app.UseHsts();
}
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseRouting();
app.UseAuthorization();

app.MapControllers();

app.UseStaticFiles();

app.MapFallbackToFile("index.html"); ;

app.Run();
