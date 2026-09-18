import axios from 'axios';

/**
 * Shared Axios instance for the Herbix backend API.
 *
 * Used by authentication, the MongoDB product catalog, admin management, and checkout.
 */
export const AUTH_TOKEN_KEY = 'herbix_token';

// Fired whenever a request comes back 401 (missing/invalid/expired token) so
// AuthContext can clear its state app-wide without api.js needing to know
// anything about React.
export const UNAUTHORIZED_EVENT = 'herbix:unauthorized';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach the JWT to every request once the user is logged in.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralized handling for expired/invalid sessions — any 401 from the API
// clears the stored token and notifies the app, instead of every call site
// having to remember to do this itself.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT));
    }
    return Promise.reject(error);
  }
);

export default api;
