import AxiosInstance from "../../../api/AxiosInstance";
import { handleRequest } from "../../../api/apiHandler";

const BASE_PREFIX = 'user-searches';

const SearchService = {
    // Delete a specific keyword within a specific context (e.g., 'App\\Models\\User')
    deleteKeyword: (keyword: string, type: string) => 
        handleRequest(
            AxiosInstance.delete(`${BASE_PREFIX}/${encodeURIComponent(keyword)}`, {
                params: { type }
            }), 
            "Failed to remove search item"
        ),

    // Clear history for a specific context
    clearHistory: (type: string) => 
        handleRequest(
            AxiosInstance.delete(`${BASE_PREFIX}/clear`, {
                params: { type }
            }), 
            "Failed to clear search history"
        ),
};

export default SearchService;