using EzLambda;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddEnvironmentVariables("EzLambda_");

// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();

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

// builder.Services.AddControllersWithViews();
// builder.Services.AddControllers();
builder.Services.AddAWSLambdaHosting(LambdaEventSource.HttpApi);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();
// app.UseAuthentication();
// app.UseRouting();
// app.UseAuthorization();

// this might need to be before static hosting
// app.MapControllers();
// app.MapControllerRoute(
//     name: "default",
//     pattern: "{controller}/{action=Index}/{id?}");

// this needs to come back
// app.UseStaticFiles();

// app.MapFallbackToFile("index.html"); ;

// app.Run();



// this should work™
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapGet("/api/authinfo", () =>
{
    // var authority = _configuration.GetValue<string>("auth:oidc:authority");
    // var clientId = _configuration.GetValue<string>("auth:oidc:clientid");

    // _logger.LogInformation("Authority {authority}, ClientId {clientId}", authority, clientId);

    return new AuthInfo()
    {
        Authority = "",//authority,
        ClientId = "",//clientId
    };
});

app.UseStaticFiles();

app.MapFallbackToFile("index.html"); ;

app.Run();