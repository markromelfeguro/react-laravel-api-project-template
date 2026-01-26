import axios from "axios";
import { notify } from "../utils/notify";

const AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  // for Cookie-based Auth: allows sending/receiving cookies
  withCredentials: true, 
});

AxiosInstance.interceptors.request.use((config) => {
  // We no longer manually pull from localStorage.
  // The browser handles the Cookie header automatically.

  if (!(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }
  
  // Necessary for Laravel Sanctum/Fortify to prevent CSRF attacks
  config.headers["X-Requested-With"] = "XMLHttpRequest";
  
  return config;
});

AxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 422) {
      const errors = error.response.data.errors;
      const firstMessage = Object.values(errors).flat()[0] as string;
      notify.error(firstMessage);
    } 
    
    else if (status === 401) {
      // The backend will usually clear the cookie via Set-Cookie.
      notify.error("Your session has expired.");
    } 

    else if (status === 403) {
      notify.error("You do not have permission to perform this action.");
    }

    else if (status >= 500) {
      notify.error("Server error. Please try again later.");
    }

    return Promise.reject(error);
  }
);

export default AxiosInstance;