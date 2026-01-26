import AxiosInstance from "../../../api/AxiosInstance";
import { handleRequest } from "../../../api/apiHandler";

const AuthService = {
    /**
     * Required for Laravel Sanctum. Sets the XSRF-TOKEN cookie.
     * Call this before calling login().
     */
    getCsrfToken: () => 
        handleRequest(AxiosInstance.get('/sanctum/csrf-cookie'), "CSRF Initialization failed"),

    /**
     * Standard Login
     * Browser will automatically store the session cookie on success
     */
    login: async (credentials: any) => {
        // Ensure CSRF cookie is set before attempting login
        await AuthService.getCsrfToken();
        
        return handleRequest(
            AxiosInstance.post('/login', credentials), 
            "Login failed", 
            true
        );
    },

    /**
     * Standard Logout
     * Backend will clear the cookie via Set-Cookie header
     */
    logout: () => 
        handleRequest(AxiosInstance.post('/logout', {}), "Logout failed"),

    /**
     * Check Session
     * Validates if the browser's current cookie is still active
     */
    me: () => 
        handleRequest(AxiosInstance.get('/user/auth/me'), "Failed to fetch user session"),
};

export default AuthService;