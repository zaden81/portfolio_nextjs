const AUTH_ERROR_MESSAGES: Record<string, string> = {
  oauth_failed: "Authentication failed. Please try again.",
  access_denied: "Access was denied by the provider.",
  invalid_state: "Invalid authentication state. Please try again.",
  missing_tokens: "Authentication data was incomplete.",
  server_error: "A server error occurred. Please try again later.",
};

export function getSafeErrorMessage(code: string | null): string {
  if (!code) return "An unknown error occurred.";
  return AUTH_ERROR_MESSAGES[code] || "Authentication failed. Please try again.";
}
