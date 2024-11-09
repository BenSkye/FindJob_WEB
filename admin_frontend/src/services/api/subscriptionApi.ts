import apiClient from "./apiClient";

export const getSubscriptionStats = async () => {
   const response = await apiClient.get('/subscription/stats');
   return response.data;
}
