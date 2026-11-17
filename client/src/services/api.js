const API_ROOT = import.meta.env.VITE_API_URL || "/api";

export async function apiRequest(path, { token, ...options } = {}) {
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_ROOT}${path}`, { ...options, headers });
  } catch {
    throw new Error("Could not reach the server. Check that both app services are running.");
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "The request could not be completed.");
  return data;
}
