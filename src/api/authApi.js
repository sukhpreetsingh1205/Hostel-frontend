import axiosInstance from './axiosConfig';

export const authApi = {
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  getMe: () => axiosInstance.get('/auth/me'),
  logout: () => axiosInstance.post('/auth/logout'),
  updatePassword: (data) => axiosInstance.put('/auth/updatepassword', data),
  forgotPassword: (email) => axiosInstance.post('/auth/forgotpassword', { email }),
  resetPassword: (token, password) =>
    axiosInstance.put(`/auth/resetpassword/${token}`, { password }),
  refreshToken: (refreshToken) =>
    axiosInstance.post('/auth/refreshtoken', { refreshToken }),
};
