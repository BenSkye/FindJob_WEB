import axios from 'axios';
import Cookies from 'js-cookie';

const apiClient = axios.create({
  baseURL: 'http://localhost:2024/v1/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(function (config) {
  config.headers['x-api-key'] = Cookies.get('x-api-key') || '';
  config.headers['x-client-id'] = Cookies.get('x-client-id') || '';
  config.headers['authorization'] = Cookies.get('authorization') || '';

  return config;
}, function (error) {
  return Promise.reject(error);
});



const handleLogout = () => {
  // Xóa tất cả cookies
  Cookies.remove('authorization');
  Cookies.remove('x-refresh-token');
  Cookies.remove('x-client-id');
  Cookies.remove('x-api-key');

  // Redirect về trang chủ
  window.location.href = '/';
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response) {
      const { status, data } = error.response;

      // Xử lý refresh token
      if ((status === 401 || status === 403 || data.message === "jwt expired")
        && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = Cookies.get('x-refresh-token');

        if (!refreshToken) {
          return Promise.reject(error);
        }

        try {
          const response = await apiClient.post('/user/handleRefreshToken', {}, {
            headers: {
              'x-client-id': Cookies.get('x-client-id') || '',
              'x-api-key': Cookies.get('x-api-key') || '',
              'x-refresh-token': refreshToken
            }
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data.metadata.tokens;
          Cookies.set('authorization', accessToken);
          Cookies.set('x-refresh-token', newRefreshToken);
          originalRequest.headers['authorization'] = accessToken;
          return apiClient(originalRequest);

        } catch (refreshError) {
          handleLogout();
          return Promise.reject(refreshError);
        }
      }

      // Xử lý Invalid Signature hoặc Not found keyStore
      if (status === 406 ||
        data.message === "Invalid Signature" ||
        data.message === "Not found keyStore") {
        handleLogout();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
export default apiClient;