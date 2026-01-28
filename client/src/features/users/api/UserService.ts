import AxiosInstance from "../../../api/AxiosInstance";
import { handleRequest } from "../../../api/apiHandler";

const BASE_PREFIX = 'users';

const UserService = {

    getAll: () => 
        handleRequest(AxiosInstance.get(`/${BASE_PREFIX}`), "Failed to fetch users"),

    getOne: (slug: string) => 
        handleRequest(AxiosInstance.get(`/${BASE_PREFIX}/${slug}`), "Failed to fetch user details"),

    create: (data: any) => 
        handleRequest(AxiosInstance.post(`/${BASE_PREFIX}/store`, data), "Failed to create user"),

    update: (id: string, data: FormData, onProgress?: (percent: number) => void) => 
        handleRequest(
            AxiosInstance.post(`/${BASE_PREFIX}/${id}/update`, data, {
                onUploadProgress: (progressEvent) => {
                    if (onProgress && progressEvent.total) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        onProgress(percentCompleted);
                    }
                }
            }), 
            "Failed to synchronize profile"
        ),

    delete: (slug: string) => 
        handleRequest(AxiosInstance.delete(`/${BASE_PREFIX}/${slug}/delete`), "Failed to delete user"),

    switchTheme: (theme: 'dark' | 'light' | 'system') => 
        handleRequest(AxiosInstance.post(`/${BASE_PREFIX}/switch-theme`, { theme }), "Failed to sync theme"),
};

export default UserService;