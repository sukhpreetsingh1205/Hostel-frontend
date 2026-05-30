import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchStudents } from '../../features/student/studentSlice';
import { FiEye, FiSearch } from 'react-icons/fi';

const Students = () => {
  const dispatch = useDispatch();
  const { students, pagination, loading, error } = useSelector((state) => state.student);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(
      fetchStudents({
        page: currentPage,
        search: searchTerm,
        year: filterYear,
        course: filterCourse,
      })
    );
  }, [dispatch, currentPage, searchTerm, filterYear, filterCourse]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Students</h1>
        <p className="text-gray-600 mt-1">View student list</p>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">{error}</div>
      ) : null}

      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, roll number..."
              value={searchTerm}
              onChange={(e) => {
                setCurrentPage(1);
                setSearchTerm(e.target.value);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <select
            value={filterYear}
            onChange={(e) => {
              setCurrentPage(1);
              setFilterYear(e.target.value);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Years</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>

          <select
            value={filterCourse}
            onChange={(e) => {
              setCurrentPage(1);
              setFilterCourse(e.target.value);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Courses</option>
            <option value="B.Tech">B.Tech</option>
            <option value="M.Tech">M.Tech</option>
            <option value="BCA">BCA</option>
            <option value="MCA">MCA</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Roll / Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Room
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      View
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {students.length ? (
                    students.map((student) => (
                      <tr key={student._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-gray-900">{student.userId?.name || '—'}</div>
                          <div className="text-xs text-gray-500">{student.userId?.email || ''}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{student.rollNumber || '—'}</div>
                          <div className="text-xs text-gray-500">
                            {student.course || '—'} {student.year ? `• Year ${student.year}` : ''}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{student.roomId?.roomNumber || '—'}</td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            to={`/warden/students/${student._id}`}
                            className="inline-flex p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                          >
                            <FiEye className="h-5 w-5" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-600">
                        No students found. If you registered “student” users earlier (without full student details),
                        they won’t appear here until a Student profile exists.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {pagination?.pages > 1 ? (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="btn btn-sm btn-outline"
                  >
                    Previous
                  </button>
                  <div className="text-sm text-gray-600 self-center">
                    Page {currentPage} / {pagination.pages}
                  </div>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(pagination.pages, p + 1))}
                    disabled={currentPage === pagination.pages}
                    className="btn btn-sm btn-outline"
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};

export default Students;
