import AxiosInstance from "../../../api/AxiosInstance";
import { handleRequest } from "../../../api/apiHandler";

const BASE_PREFIX = 'notifications';

const NotificationService = {
    // Get all notifications for the user
    getAll: () => 
        handleRequest(AxiosInstance.get(`/${BASE_PREFIX}`), "Failed to fetch notifications"),

    // Get only unread notifications (useful for the Navbar badge)
    getUnread: () => 
        handleRequest(AxiosInstance.get(`/${BASE_PREFIX}/unread`), "Failed to fetch unread alerts"),

    // Mark a specific notification as read
    markAsRead: (id: number) => 
        handleRequest(AxiosInstance.patch(`/${BASE_PREFIX}/${id}/read`), "Failed to update notification"),

    // Mark all notifications as read at once
    markAllAsRead: () => 
        handleRequest(AxiosInstance.post(`/${BASE_PREFIX}/read-all`), "Failed to clear notifications"),

    // Delete a notification record
    delete: (id: number) => 
        handleRequest(AxiosInstance.delete(`/${BASE_PREFIX}/${id}`), "Failed to remove notification"),
};

export default NotificationService;