import axiosInstance from './axiosConfig';

export const noticeApi = {
  getAll: (params) => axiosInstance.get('/notices', { params }),
  getActive: () => axiosInstance.get('/notices/active'),
  getById: (id) => axiosInstance.get(`/notices/${id}`),
  create: (data) => axiosInstance.post('/notices', data),
  update: (id, data) => axiosInstance.put(`/notices/${id}`, data),
  delete: (id) => axiosInstance.delete(`/notices/${id}`),
  togglePin: (id) => axiosInstance.put(`/notices/${id}/pin`),
  getStats: () => axiosInstance.get('/notices/stats/summary'),
  archive: () => axiosInstance.post('/notices/archive'),
};
