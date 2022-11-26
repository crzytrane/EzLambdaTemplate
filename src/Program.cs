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
    var authority = builder.Configuration.GetValue<string>("auth:oidc:authority");
    var userPoolRegion = builder.Configuration.GetValue<string>("auth:oidc:user_pool_region");
    var userPoolId = builder.Configuration.GetValue<string>("auth:oidc:user_pool_id");
    var clientId = builder.Configuration.GetValue<string>("auth:oidc:client_id");

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidIssuer = $"https://cognito-idp.{userPoolRegion}.amazonaws.com/{userPoolId}",
        ValidateIssuerSigningKey = true,
        ValidateIssuer = true,
        ValidateLifetime = true,
        ValidAudience = $"{clientId}",
        ValidateAudience = false
    };

    options.MetadataAddress = $"https://cognito-idp.{userPoolRegion}.amazonaws.com/{userPoolId}/.well-known/openid-configuration";

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
    // app.UseExceptionHandler("/Error");
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
