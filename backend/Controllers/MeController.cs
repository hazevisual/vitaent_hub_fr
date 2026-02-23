using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api")]
public class MeController : ControllerBase
{
    [Authorize]
    [HttpGet("me")]
    public ActionResult<MeResponse> Me()
    {
        var username = User.Identity?.Name;
        if (string.IsNullOrWhiteSpace(username))
        {
            return Unauthorized();
        }

        return Ok(new MeResponse(username));
    }
}
