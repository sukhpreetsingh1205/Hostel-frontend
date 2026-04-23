import axiosInstance from './axiosConfig';

export const leaveApi = {
  getAll: (params) => axiosInstance.get('/leaves', { params }),
  getById: (id) => axiosInstance.get(`/leaves/${id}`),
  getStudentLeaves: (studentId) => axiosInstance.get(`/leaves/student/${studentId}`),
  create: (data) => axiosInstance.post('/leaves', data),
  update: (id, data) => axiosInstance.put(`/leaves/${id}`, data),
  approve: (id, remarks) => axiosInstance.put(`/leaves/${id}/approve`, { remarks }),
  reject: (id, rejectionReason) => axiosInstance.put(`/leaves/${id}/reject`, { rejectionReason }),
  cancel: (id) => axiosInstance.put(`/leaves/${id}/cancel`),
  getPending: () => axiosInstance.get('/leaves/pending'),
  getStats: () => axiosInstance.get('/leaves/stats'),
};
