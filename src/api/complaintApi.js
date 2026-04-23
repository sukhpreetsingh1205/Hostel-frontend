import axiosInstance from './axiosConfig';

export const complaintApi = {
  getAll: (params) => axiosInstance.get('/complaints', { params }),
  getById: (id) => axiosInstance.get(`/complaints/${id}`),
  getStudentComplaints: (studentId) => axiosInstance.get(`/complaints/student/${studentId}`),
  create: (data) => axiosInstance.post('/complaints', data),
  update: (id, data) => axiosInstance.put(`/complaints/${id}`, data),
  assign: (id, assignedTo) => axiosInstance.put(`/complaints/${id}/assign`, { assignedTo }),
  resolve: (id, data) => axiosInstance.put(`/complaints/${id}/resolve`, data),
  close: (id, data) => axiosInstance.put(`/complaints/${id}/close`, data),
  addComment: (id, comment) => axiosInstance.post(`/complaints/${id}/comments`, { comment }),
  getStats: () => axiosInstance.get('/complaints/stats'),
};
