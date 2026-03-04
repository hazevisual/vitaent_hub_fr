using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Application.DoctorInvites;

public interface IDoctorInviteApplicationService
{
    Task<ProblemDetails?> GetAccessProblemAsync(CancellationToken cancellationToken);
    Task<DoctorInviteCreateResult> CreateInviteAsync(CancellationToken cancellationToken);
    Task<IReadOnlyList<DoctorInviteListItem>> GetRecentInvitesAsync(CancellationToken cancellationToken);
}
