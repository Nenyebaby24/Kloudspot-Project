const BASE = import.meta.env.VITE_API_BASE || "";

function parseJSONSafe(text) {
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}

export async function request(path, options = {}) {
  const url = path.startsWith("http") ? path : `${BASE}${path}`;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // attach token if present
  const token = localStorage.getItem("cms_token");
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const res = await fetch(url, { ...options, headers });
    const text = await res.text();
    const body = parseJSONSafe(text);
    if (!res.ok) {
      const message = (body && (body.message || body.error)) || res.statusText;
      return { error: String(message || "API Error"), status: res.status };
    }
    return { data: body, status: res.status };
  } catch (err) {
    return { error: err?.message || "Network error", status: 0 };
  }
}
