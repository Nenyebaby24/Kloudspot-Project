// auth.js

// Fake login API - works without backend
export async function loginApi(email, password) {
  // simulate backend delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  const TEST_EMAIL = "test@test.com";
  const TEST_PASSWORD = "1234567890";

  if (email === TEST_EMAIL && password === TEST_PASSWORD) {
    return {
      data: {
        token: "fake_cms_token_123456789"
      }
    };
  }

  return { error: "Invalid email or password" };
}

// Save token to localStorage
export function saveToken(token) {
  localStorage.setItem("cms_token", token);
}

// Remove token
export function clearToken() {
  localStorage.removeItem("cms_token");
}

// Get token
export function getToken() {
  return localStorage.getItem("cms_token");
}

