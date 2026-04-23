import axiosInstance from './axiosConfig';

export const feeApi = {
  getAll: (params) => axiosInstance.get('/fees', { params }),
  getById: (id) => axiosInstance.get(`/fees/${id}`),
  getStudentFees: (studentId) => axiosInstance.get(`/fees/student/${studentId}`),
  generateMonthly: (data) => axiosInstance.post('/fees/generate-monthly', data),
  makePayment: (id, paymentData) => axiosInstance.post(`/fees/${id}/payment`, paymentData),
  update: (id, data) => axiosInstance.put(`/fees/${id}`, data),
  delete: (id) => axiosInstance.delete(`/fees/${id}`),
  getStats: () => axiosInstance.get('/fees/stats/summary'),
  sendReminders: () => axiosInstance.post('/fees/send-reminders'),
};
