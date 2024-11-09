import apiClient from "./apiClient";

export const getJobStats = async () => {
  const response = await apiClient.get('/job/job-stats');
  return response.data;
}