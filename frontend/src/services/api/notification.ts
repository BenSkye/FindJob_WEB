import type Notification from "../types/notification";
import apiClient from "./apiClient";

const getNotificationsByUserId = async ({ userId }: { userId: string }) => {
    const response = await apiClient.get(`/notification/${userId}`);
    return response.data.metadata;
}

export { getNotificationsByUserId };

