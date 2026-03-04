using System.Security.Claims;
using backend.Models;

namespace backend.Application.Auth;

public interface IAuthApplicationService
{
    Task<LoginResponse?> LoginAsync(LoginRequest request, CancellationToken cancellationToken);
    Task<LoginResponse?> RefreshAsync(ClaimsPrincipal principal, CancellationToken cancellationToken);
    Task<RegisterByInviteResult> RegisterByInviteAsync(RegisterByInviteRequest request, CancellationToken cancellationToken);
    Task<MeResponse?> GetCurrentUserAsync(ClaimsPrincipal principal, CancellationToken cancellationToken);
}
