import axiosInstance from './axiosConfig';

export const attendanceApi = {
  getAll: (params) => axiosInstance.get('/attendance', { params }),
  getStudentAttendance: (studentId, params) =>
    axiosInstance.get(`/attendance/student/${studentId}`, { params }),
  getByDate: (date) => axiosInstance.get(`/attendance/date/${date}`),
  markAttendance: (data) => axiosInstance.post('/attendance/mark', data),
  update: (id, data) => axiosInstance.put(`/attendance/${id}`, data),
  getStats: (params) => axiosInstance.get('/attendance/stats', { params }),
  getTodaySummary: () => axiosInstance.get('/attendance/today/summary'),
};
