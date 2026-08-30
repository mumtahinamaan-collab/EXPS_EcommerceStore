
import API_BASE_URL from "../config/api";

// ==========================================
// REFRESH ACCESS TOKEN
// ==========================================

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh: refreshToken,
      }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    localStorage.setItem("accessToken", data.access);

    return data.access;
  } catch {
    return null;
  }
};

// ==========================================
// AUTHENTICATED FETCH
// ==========================================

export const authFetch = async (url, options = {}) => {
  let accessToken = localStorage.getItem("accessToken");

  const request = async (token) => {
    return fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });
  };

  // First request
  let response = await request(accessToken);

  // Access token expired
  if (response.status === 401) {
    const newAccessToken = await refreshAccessToken();

    // Refresh token bhi invalid/expired
    if (!newAccessToken) {
      return response;
    }

    // Same request again with new token
    response = await request(newAccessToken);
  }

  return response;
};

// ==========================================
// LOGOUT
// ==========================================

export const logoutUser = () => {
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
  localStorage.removeItem("email");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  window.dispatchEvent(new Event("authChanged"));
};

