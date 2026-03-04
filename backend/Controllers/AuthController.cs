using backend.Application.Auth;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(IAuthApplicationService authApplicationService) : ControllerBase
{
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        var response = await authApplicationService.LoginAsync(request, cancellationToken);
        if (response is null)
        {
            return Unauthorized(new ProblemDetails
            {
                Status = StatusCodes.Status401Unauthorized,
                Title = "Неверные учетные данные."
            });
        }

        return Ok(response);
    }

    [HttpPost("sign-in")]
    public async Task<ActionResult<SignInResponse>> SignIn([FromBody] SignInRequest request, CancellationToken cancellationToken)
    {
        var response = await authApplicationService.LoginAsync(
            new LoginRequest(request.Username, request.Password, request.TenantSlug),
            cancellationToken);

        if (response is null)
        {
            return Unauthorized(new ProblemDetails
            {
                Status = StatusCodes.Status401Unauthorized,
                Title = "Неверные учетные данные."
            });
        }

        return Ok(new SignInResponse(response.AccessToken, response.ExpiresIn, response.RefreshToken));
    }

    [Authorize]
    [HttpPost("refresh")]
    public async Task<ActionResult<LoginResponse>> Refresh([FromBody] RefreshRequest request, CancellationToken cancellationToken)
    {
        _ = request;

        var response = await authApplicationService.RefreshAsync(User, cancellationToken);
        if (response is null)
        {
            return Unauthorized(new ProblemDetails
            {
                Status = StatusCodes.Status401Unauthorized,
                Title = "Не удалось обновить сессию."
            });
        }

        return Ok(response);
    }

    [HttpPost("register-by-invite")]
    public async Task<ActionResult<LoginResponse>> RegisterByInvite(
        [FromBody] RegisterByInviteRequest request,
        CancellationToken cancellationToken)
    {
        var result = await authApplicationService.RegisterByInviteAsync(request, cancellationToken);

        if (result.ValidationProblem is not null)
        {
            return BadRequest(result.ValidationProblem);
        }

        if (result.Problem is not null)
        {
            return StatusCode(result.Problem.Status ?? StatusCodes.Status409Conflict, result.Problem);
        }

        return Ok(result.Response);
    }
}
