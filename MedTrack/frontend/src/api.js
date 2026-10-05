const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\\/$/, "");

export const SESSION_KEY = "medtrack_session";

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

async function parseResponse(response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

export async function apiFetch(path, options = {}) {
  const session = getSession();
  const headers = new Headers(options.headers || {});

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (session?.accessToken) {
    headers.set("Authorization", `Bearer ${session.accessToken}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include"
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    const error = new Error(data.message || "Не удалось выполнить запрос.");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export async function signIn(email, password) {
  const data = await apiFetch("/api/auth/signin", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });

  const session = {
    accessToken: data.accessToken,
    user: {
      id: data.id,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      role: data.role
    }
  };

  setSession(session);
  return session;
}

export async function signUp({ first_name, last_name, email, password }) {
  return apiFetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ first_name, last_name, email, password })
  });
}

export async function getCurrentUser(id) {
  return apiFetch(`/api/users/${id}`);
}

export async function updateUser(id, payload) {
  return apiFetch(`/api/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export async function getUsers() {
  return apiFetch("/api/users");
}
