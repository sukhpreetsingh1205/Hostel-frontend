import React from 'react';

const AttendanceReport = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold text-gray-900">Attendance Report</h1>
      <p className="text-gray-600 mt-2">
        Report UI coming next (filters, export, month-wise summary). The backend endpoint is available under `/api/v1/attendance/stats`.
      </p>
    </div>
  );
};

export default AttendanceReport;
