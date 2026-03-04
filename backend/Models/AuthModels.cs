using Microsoft.AspNetCore.Mvc;

namespace backend.Models;

public record LoginRequest(string Username, string Password, string? TenantSlug = null);
public record LoginResponse(string AccessToken, long ExpiresIn, string? RefreshToken = null);
public record RefreshRequest(string? AccessToken = null);
public record RegisterByInviteRequest(
    string InviteCode,
    string Email,
    string Password,
    string FullName,
    DateOnly? BirthDate,
    string Sex);
public record RegisterByInviteResult(
    LoginResponse? Response,
    ProblemDetails? Problem = null,
    ValidationProblemDetails? ValidationProblem = null);
public record MeResponse(
    Guid UserId,
    string Username,
    Guid? TenantId,
    string? TenantSlug,
    Guid? MembershipId,
    IReadOnlyList<string> Roles,
    Guid? PatientId,
    Guid? DoctorId);

// Legacy compatibility for existing frontend integration during the Phase 0 transition.
public record SignInRequest(string Username, string Password, string? TenantSlug = null)
    : LoginRequest(Username, Password, TenantSlug);

// Legacy compatibility for existing frontend integration during the Phase 0 transition.
public record SignInResponse(string AccessToken, long ExpiresIn, string? RefreshToken = null)
    : LoginResponse(AccessToken, ExpiresIn, RefreshToken);
