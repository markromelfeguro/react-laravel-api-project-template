import { useState, useCallback } from "react";
import SearchService from "../features/search/api/SearchService";
import { notify } from "../utils/notify";

export const useSearchHistory = (searchableType: string) => {
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const deleteSearch = useCallback(async (keyword: string) => {
        const previous = [...suggestions];
        setSuggestions(prev => prev.filter(s => s !== keyword));

        const response = await SearchService.deleteKeyword(keyword, searchableType);
        
        if (response.error) {
            setSuggestions(previous);
            notify.error(response.error);
        }
    }, [suggestions, searchableType]);

    const clearHistory = useCallback(async () => {
        const response = await SearchService.clearHistory(searchableType);
        if (!response.error) {
            setSuggestions([]);
            notify.success("History cleared");
        }
    }, [searchableType]);

    return { suggestions, setSuggestions, deleteSearch, clearHistory };
};