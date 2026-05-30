import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchRoomById, fetchAvailableRooms, allotRoom, clearCurrentRoom } from '../../../features/room/roomSlice';
import { fetchStudentsWithoutRoom } from '../../../features/student/studentSlice';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorAlert from '../../../components/common/ErrorAlert';
import { FiArrowLeft, FiUserPlus, FiCheck, FiX, FiSearch } from 'react-icons/fi';

const RoomAssign = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: roomId } = useParams();

  const { currentRoom, loading: roomLoading } = useSelector((state) => state.room);
  const { students: unassignedStudents, loading: studentsLoading } = useSelector((state) => state.student);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const labelClass = 'text-xs text-surface-500 dark:text-surface-400 uppercase tracking-wider';
  const valueClass = 'font-semibold text-surface-900 dark:text-surface-100';
  const availableBeds = (currentRoom?.capacity || 0) - (currentRoom?.currentOccupancy || 0);

  useEffect(() => {
    if (roomId) {
      dispatch(fetchRoomById(roomId));
      dispatch(fetchAvailableRooms());
      dispatch(fetchStudentsWithoutRoom());
    }
    return () => dispatch(clearCurrentRoom());
  }, [dispatch, roomId]);

  const handleAssign = async () => {
    if (!selectedStudent) return;

    setAssigning(true);
    setError(null);
    setSuccess(null);

    try {
      await dispatch(allotRoom({ roomId, studentId: selectedStudent._id })).unwrap();
      setSuccess(`${selectedStudent.name} assigned to room ${currentRoom?.roomNumber}. Email notification sent if SMTP is configured.`);
      setSelectedStudent(null);
      dispatch(fetchRoomById(roomId));
      dispatch(fetchStudentsWithoutRoom());
    } catch (err) {
      setError(err || 'Failed to assign room');
    } finally {
      setAssigning(false);
    }
  };

  const filteredStudents = unassignedStudents?.filter((student) => {
    const search = searchTerm.toLowerCase();
    return (
      student.name?.toLowerCase().includes(search) ||
      student.studentId?.toLowerCase().includes(search) ||
      student.rollNumber?.toLowerCase().includes(search)
    );
  }) || [];

  if (roomLoading && !currentRoom) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(`/admin/rooms/${roomId}`)} className="btn-secondary btn-sm">
            <FiArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">Assign Student to Room</h1>
            <p className="text-surface-500 dark:text-surface-400 mt-1">
              Room {currentRoom?.roomNumber} - Block {currentRoom?.block} - Floor {currentRoom?.floor}
            </p>
          </div>
        </div>
        <div className="badge badge-info self-start sm:self-auto">
          {currentRoom?.currentOccupancy || 0}/{currentRoom?.capacity || 0} Occupied
        </div>
      </div>

      <div className="glass-card p-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className={labelClass}>Room Type</div>
            <div className={`${valueClass} capitalize`}>{currentRoom?.type}</div>
          </div>
          <div>
            <div className={labelClass}>Rent</div>
            <div className={valueClass}>Rs. {currentRoom?.rent?.toLocaleString()}</div>
          </div>
          <div>
            <div className={labelClass}>Status</div>
            <div className={`badge ${currentRoom?.status === 'available' ? 'badge-success' : 'badge-warning'}`}>
              {currentRoom?.status}
            </div>
          </div>
          <div>
            <div className={labelClass}>Available Beds</div>
            <div className={valueClass}>{availableBeds}</div>
          </div>
        </div>
      </div>

      {success && (
        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 dark:bg-green-950/30 dark:border-green-900 dark:text-green-300">
          <FiCheck className="w-5 h-5" />
          {success}
        </div>
      )}
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

      {currentRoom?.currentStudents?.length > 0 && (
        <div className="glass-card p-5">
          <h3 className="font-semibold text-surface-900 dark:text-surface-100 mb-3">Current Occupants</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {currentRoom.currentStudents.map((student) => (
              <div key={student._id} className="flex items-center gap-3 p-3 bg-surface-50 dark:bg-surface-800 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center">
                  <span className="text-brand-600 dark:text-brand-400 font-semibold">
                    {student.userId?.name?.charAt(0) || 'S'}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-surface-900 dark:text-surface-100">{student.userId?.name || 'Student'}</div>
                  <div className="text-xs text-surface-500 dark:text-surface-400">{student.studentId} - {student.rollNumber}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {availableBeds > 0 ? (
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <FiUserPlus className="w-5 h-5 text-brand-500" />
            <h3 className="font-semibold text-surface-900 dark:text-surface-100">Assign New Student</h3>
          </div>

          <div className="relative mb-4">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input
              type="text"
              placeholder="Search by name, student ID, or roll number..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="input-field pl-10"
            />
          </div>

          {studentsLoading ? (
            <LoadingSpinner />
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-8 text-surface-500 dark:text-surface-400">
              {searchTerm ? 'No students match your search' : 'No unassigned students available'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
              {filteredStudents.map((student) => (
                <div
                  key={student._id}
                  onClick={() => setSelectedStudent(student)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedStudent?._id === student._id
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/30'
                      : 'border-surface-200 dark:border-surface-700 hover:border-brand-300 bg-white/70 dark:bg-surface-900/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-surface-900 dark:text-surface-100">{student.name}</div>
                      <div className="text-sm text-surface-500 dark:text-surface-400">{student.studentId}</div>
                      <div className="text-xs text-surface-400 dark:text-surface-500">{student.rollNumber}</div>
                    </div>
                    {selectedStudent?._id === student._id && <FiCheck className="w-5 h-5 text-brand-500" />}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <span className="text-xs bg-surface-100 dark:bg-surface-800 px-2 py-1 rounded">{student.course}</span>
                    <span className="text-xs bg-surface-100 dark:bg-surface-800 px-2 py-1 rounded">Year {student.year}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedStudent && (
            <div className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-700">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm text-surface-500 dark:text-surface-400">Selected</div>
                  <div className="font-semibold text-surface-900 dark:text-surface-100">{selectedStudent.name}</div>
                  <div className="text-sm text-surface-500 dark:text-surface-400">{selectedStudent.studentId}</div>
                </div>
                <button onClick={handleAssign} disabled={assigning} className="btn-primary">
                  {assigning ? (
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      Assigning...
                    </>
                  ) : (
                    <>
                      <FiUserPlus className="w-4 h-4" />
                      Assign to Room
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="glass-card p-5 text-center">
          <FiX className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h3 className="font-semibold text-surface-900 dark:text-surface-100">Room is Full</h3>
          <p className="text-surface-500 dark:text-surface-400 mt-1">This room has no available beds.</p>
        </div>
      )}
    </div>
  );
};

export default RoomAssign;
