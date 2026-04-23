import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchStudentById, clearCurrentStudent } from '../../../features/student/studentSlice';

const StudentDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { currentStudent, loading, error } = useSelector((state) => state.student);

  useEffect(() => {
    if (id) dispatch(fetchStudentById(id));
    return () => dispatch(clearCurrentStudent());
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  if (!currentStudent) {
    return <div className="text-gray-600">Student not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Details</h1>
          <p className="text-gray-600 mt-1">View student profile and hostel details</p>
        </div>
        <Link
          to={`/admin/students/${currentStudent._id}/edit`}
          className="btn btn-primary"
        >
          Edit
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-gray-500">Name</p>
            <p className="font-semibold text-gray-900">{currentStudent.userId?.name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Email</p>
            <p className="font-semibold text-gray-900">{currentStudent.userId?.email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Roll Number</p>
            <p className="font-semibold text-gray-900">{currentStudent.rollNumber}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Course / Year</p>
            <p className="font-semibold text-gray-900">
              {currentStudent.course} / {currentStudent.year}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Room</p>
            <p className="font-semibold text-gray-900">{currentStudent.roomId?.roomNumber || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Phone</p>
            <p className="font-semibold text-gray-900">{currentStudent.userId?.phone || '—'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
