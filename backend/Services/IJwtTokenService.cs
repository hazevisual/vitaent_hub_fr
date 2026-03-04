using backend.Models;

namespace backend.Services;

public interface IJwtTokenService
{
    (string Token, DateTime ExpiresAtUtc) CreateToken(
        User user,
        Tenant? tenant = null,
        Membership? membership = null,
        IReadOnlyCollection<string>? roles = null);
}
