using backend.Data;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(
    ApplicationDbContext dbContext,
    IPasswordHasher passwordHasher,
    IJwtTokenService jwtTokenService) : ControllerBase
{
    [HttpPost("sign-in")]
    public async Task<ActionResult<SignInResponse>> SignIn([FromBody] SignInRequest request)
    {
        var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
        if (user is null || !passwordHasher.Verify(request.Password, user.PasswordHash))
        {
            return Unauthorized();
        }

        var (token, expiresAt) = jwtTokenService.CreateToken(user);
        var expiresIn = (long)(expiresAt - DateTime.UtcNow).TotalSeconds;

        return Ok(new SignInResponse(token, expiresIn));
    }
}
