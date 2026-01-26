import AxiosInstance from "../../../api/AxiosInstance";
import { handleRequest } from "../../../api/apiHandler";

const BASE_PREFIX = 'users';

const UserService = {
    // Get all users for your Table component
    getAll: () => 
        handleRequest(AxiosInstance.get(`/${BASE_PREFIX}`), "Failed to fetch users"),

    // Get a single user
    getOne: (slug: string) => 
        handleRequest(AxiosInstance.get(`/${BASE_PREFIX}/${slug}`), "Failed to fetch user details"),

    // Create a user (Triggers Laravel Phone Validation)
    create: (data: any) => 
        handleRequest(AxiosInstance.post(`/${BASE_PREFIX}`, data), "Failed to create user"),

    // Update user
    update: (slug: string, data: any) => 
        handleRequest(AxiosInstance.put(`/${BASE_PREFIX}/${slug}`, data), "Failed to update user"),

    // Delete user
    delete: (slug: string) => 
        handleRequest(AxiosInstance.delete(`/${BASE_PREFIX}/${slug}`), "Failed to delete user"),

    switchTheme: (theme: 'dark' | 'light') => 
        handleRequest(AxiosInstance.post(`/${BASE_PREFIX}/switch-theme`, { theme }), "Failed to sync theme"),
};

export default UserService;