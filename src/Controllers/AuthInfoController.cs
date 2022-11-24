using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EzLambda.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthInfoController : ControllerBase
{
    private readonly ILogger<AuthInfoController> _logger;
    private readonly IConfiguration _configuration;

    public AuthInfoController(
        ILogger<AuthInfoController> logger,
        IConfiguration configuration
        )
    {
        _logger = logger;
        _configuration = configuration;
    }

    [HttpGet]
    public AuthInfo Get()
    {
        var authority = _configuration.GetValue<string>("auth:oidc:authority");
        var clientId = _configuration.GetValue<string>("auth:oidc:clientid");

        _logger.LogInformation("Authority {authority}, ClientId {clientId}", authority, clientId);

        return new AuthInfo()
        {
            Authority = authority,
            ClientId = clientId
        };
    }
}
