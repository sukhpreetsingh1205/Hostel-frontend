import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudents } from '../../../features/student/studentSlice';
import { markAttendance } from '../../../features/attendence/attendanceSlice';
import { toast } from 'react-hot-toast';

const AttendanceMarking = () => {
  const dispatch = useDispatch();
  const { students } = useSelector((state) => state.student);
  const [attendanceData, setAttendanceData] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchStudents({ status: 'active' }));
  }, [dispatch]);

  useEffect(() => {
    // Initialize attendance data for all students
    const initialData = {};
    students.forEach(student => {
      initialData[student._id] = 'present';
    });
    setAttendanceData(initialData);
  }, [students]);

  const handleStatusChange = (studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleMarkAll = (status) => {
    const updatedData = {};
    students.forEach(student => {
      updatedData[student._id] = status;
    });
    setAttendanceData(updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const records = Object.entries(attendanceData).map(([studentId, status]) => ({
      studentId,
      status,
      date: selectedDate,
    }));

    const result = await dispatch(markAttendance({ date: selectedDate, records }));
    setLoading(false);

    if (result.meta.requestStatus === 'fulfilled') {
      toast.success(`Marked attendance for ${result.payload.data.success.length} students`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mark Attendance</h1>
        <p className="text-gray-600 mt-1">Mark daily attendance for students</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => handleMarkAll('present')}
                    className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                  >
                    All Present
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMarkAll('absent')}
                    className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                  >
                    All Absent
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Attendance'}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-indigo-600 font-medium">
                              {student.userId?.name?.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{student.userId?.name}</div>
                          <div className="text-sm text-gray-500">{student.course} - Year {student.year}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.rollNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.roomId?.roomNumber || 'Not Allotted'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-3">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name={`attendance-${student._id}`}
                            value="present"
                            checked={attendanceData[student._id] === 'present'}
                            onChange={() => handleStatusChange(student._id, 'present')}
                            className="form-radio text-green-600"
                          />
                          <span className="ml-2 text-sm text-gray-700">Present</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name={`attendance-${student._id}`}
                            value="absent"
                            checked={attendanceData[student._id] === 'absent'}
                            onChange={() => handleStatusChange(student._id, 'absent')}
                            className="form-radio text-red-600"
                          />
                          <span className="ml-2 text-sm text-gray-700">Absent</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name={`attendance-${student._id}`}
                            value="late"
                            checked={attendanceData[student._id] === 'late'}
                            onChange={() => handleStatusChange(student._id, 'late')}
                            className="form-radio text-yellow-600"
                          />
                          <span className="ml-2 text-sm text-gray-700">Late</span>
                        </label>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AttendanceMarking;
