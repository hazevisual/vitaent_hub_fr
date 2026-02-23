namespace backend.Models;

public record SignInRequest(string Username, string Password);
public record SignInResponse(string AccessToken, long ExpiresIn);
public record MeResponse(string Username);
