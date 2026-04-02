const defaultApiBaseUrl =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://students-expense-tracking-system.onrender.com/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || defaultApiBaseUrl;

function buildUserHeaders(user) {
  if (!user) return {};

  return {
    "x-user-uid": user.uid,
    "x-user-email": user.email || "",
    "x-user-name": user.displayName || "",
  };
}

export async function apiRequest(path, { user, method = "GET", body, headers = {} } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...buildUserHeaders(user),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  let payload = null;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { message: text };
    }
  }

  if (!response.ok) {
    const message = payload?.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return payload;
}

export { API_BASE_URL };
