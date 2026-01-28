import axios from "axios";
import { notify } from "../utils/notify";

const AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
});

// Single Request Interceptor
AxiosInstance.interceptors.request.use((config) => {
  // Manual XSRF extraction (Backup for cross-port cookie reading)
  const cookies = document.cookie.split('; ');
  const xsrfCookie = cookies.find(row => row.startsWith('XSRF-TOKEN='));
  
  if (xsrfCookie) {
    const token = decodeURIComponent(xsrfCookie.split('=')[1]);
    config.headers["X-XSRF-TOKEN"] = token;
  }

  // Standard Headers
  if (!(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }
  
  config.headers["X-Requested-With"] = "XMLHttpRequest";
  config.headers["Accept"] = "application/json";
  
  return config;
});

// Response Interceptor (Handling Notifications)
AxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const isAuthCheck = error.config.url?.includes('/user/auth/me');

    // Handle Session Expiry (Silent during initial /me check)
    if (status === 401 && !isAuthCheck) {
      notify.error("Your session has expired. Please log in again.");
    } 

    // Handle Permissions
    else if (status === 403) {
      notify.error("You do not have permission to perform this action.");
    }

    // Handle System Failures
    else if (status >= 500) {
      notify.error("The server encountered an error. Please try again later.");
    }

    return Promise.reject(error);
  }
);

export default AxiosInstance;