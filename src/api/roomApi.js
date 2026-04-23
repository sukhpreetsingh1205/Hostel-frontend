import axiosInstance from './axiosConfig';

export const roomApi = {
  getAll: (params) => axiosInstance.get('/rooms', { params }),
  getById: (id) => axiosInstance.get(`/rooms/${id}`),
  create: (data) => axiosInstance.post('/rooms', data),
  update: (id, data) => axiosInstance.put(`/rooms/${id}`, data),
  delete: (id) => axiosInstance.delete(`/rooms/${id}`),
  getAvailable: () => axiosInstance.get('/rooms/available'),
  getStats: () => axiosInstance.get('/rooms/stats/occupancy'),
  getByBlock: (block) => axiosInstance.get(`/rooms/block/${block}`),
  allotRoom: (roomId, studentId) => axiosInstance.post(`/rooms/${roomId}/allot/${studentId}`),
  vacateRoom: (roomId, studentId) => axiosInstance.post(`/rooms/${roomId}/vacate/${studentId}`),
};
