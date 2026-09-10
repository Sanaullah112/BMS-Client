import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

const TOKEN_KEY = 'bms_token';
const ROLE_KEY = 'bms_role';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setSession(token, role) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ROLE_KEY, role);
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
}

export function getStoredRole() {
  return localStorage.getItem(ROLE_KEY);
}

export function unwrap(response) {
  const body = response.data;
  if (body && typeof body === 'object' && 'data' in body) {
    return body.data;
  }
  return body;
}

export function unwrapPage(response) {
  const body = response.data || {};
  return { items: body.data || [], pagination: body.pagination || {} };
}

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Central 401/network handling. Components should still catch errors for
// field-level validation messages (422/400), but auth expiry and network
// failure are handled once, here, per prompt section 24.
let onUnauthorized = null;
export function registerUnauthorizedHandler(fn) {
  onUnauthorized = fn;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.friendlyMessage = 'Network error. Check your connection and try again.';
    } else if (error.response.status === 401) {
      error.friendlyMessage = 'Your session has expired. Please sign in again.';
      clearSession();
      if (onUnauthorized) onUnauthorized();
    } else if (error.response.status === 403) {
      error.friendlyMessage = "You don't have permission to do that.";
    } else if (error.response.status === 404) {
      error.friendlyMessage = 'That resource could not be found.';
    } else if (error.response.status === 409) {
      error.friendlyMessage = error.response.data?.message || 'This conflicts with existing data.';
    } else if (error.response.status >= 500) {
      error.friendlyMessage = 'Something went wrong on our end. Please try again shortly.';
    } else {
      error.friendlyMessage = error.response.data?.message || 'That request could not be completed.';
    }
    return Promise.reject(error);
  }
);

export default api;
