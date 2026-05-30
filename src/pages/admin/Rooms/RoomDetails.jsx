import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchRoomById, clearCurrentRoom, vacateRoom } from '../../../features/room/roomSlice';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { FiArrowLeft, FiUserPlus, FiTrash2 } from 'react-icons/fi';

const RoomDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { currentRoom, loading, error } = useSelector((state) => state.room);
  const [studentToRemove, setStudentToRemove] = useState(null);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchRoomById(id));
    return () => dispatch(clearCurrentRoom());
  }, [dispatch, id]);

  const availableBeds = (currentRoom?.capacity || 0) - (currentRoom?.currentOccupancy || 0);
  const occupants = useMemo(
    () => currentRoom?.currentStudents || currentRoom?.occupants || currentRoom?.students || [],
    [currentRoom]
  );

  const handleRemoveStudent = async () => {
    if (!studentToRemove) return;

    setRemoving(true);
    try {
      await dispatch(vacateRoom({ roomId: id, studentId: studentToRemove._id })).unwrap();
      toast.success('Student removed from allotted room');
      setStudentToRemove(null);
      dispatch(fetchRoomById(id));
    } catch (err) {
      toast.error(err || 'Failed to remove student from room');
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/rooms" className="btn-secondary btn-sm">
            <FiArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">Room Details</h1>
            <p className="text-surface-500 dark:text-surface-400 mt-1">View room info and occupancy</p>
          </div>
        </div>
        {availableBeds > 0 && (
          <Link to={`/admin/rooms/${id}/assign`} className="btn-primary">
            <FiUserPlus className="w-4 h-4" />
            Assign Student
          </Link>
        )}
      </div>

      <div className="glass-card p-6">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
          </div>
        ) : error ? (
          <div className="text-red-700 bg-red-50 border border-red-200 rounded-lg p-4">{error}</div>
        ) : !currentRoom ? (
          <div className="text-surface-600 dark:text-surface-400">Room not found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-xs text-surface-500 dark:text-surface-400">Room Number</div>
              <div className="font-semibold text-surface-900 dark:text-surface-100">{currentRoom.roomNumber}</div>
            </div>
            <div>
              <div className="text-xs text-surface-500 dark:text-surface-400">Block</div>
              <div className="font-semibold text-surface-900 dark:text-surface-100">{currentRoom.block || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-surface-500 dark:text-surface-400">Type</div>
              <div className="font-semibold text-surface-900 dark:text-surface-100 capitalize">{currentRoom.type || '-'}</div>
            </div>
            <div>
              <div className="text-xs text-surface-500 dark:text-surface-400">Capacity</div>
              <div className="font-semibold text-surface-900 dark:text-surface-100">
                {currentRoom.currentOccupancy || 0}/{currentRoom.capacity || 0}
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="text-xs text-surface-500 dark:text-surface-400">Occupants</div>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {occupants.length ? (
                  occupants.map((student) => (
                    <div
                      key={student?._id || student?.studentId}
                      className="flex items-center justify-between gap-3 border border-surface-200 dark:border-surface-700 rounded-lg p-3"
                    >
                      <div>
                        <div className="font-semibold text-surface-900 dark:text-surface-100">
                          {student?.userId?.name || student?.name || 'Student'}
                        </div>
                        <div className="text-xs text-surface-500 dark:text-surface-400">
                          {student?.studentId || ''} {student?.rollNumber ? `- ${student.rollNumber}` : ''}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStudentToRemove(student)}
                        className="btn-icon text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                        title="Remove from room"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-surface-600 dark:text-surface-400">No occupants.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!studentToRemove}
        onClose={() => setStudentToRemove(null)}
        onConfirm={handleRemoveStudent}
        title="Remove Student"
        message={`Remove ${studentToRemove?.userId?.name || studentToRemove?.name || 'this student'} from room ${currentRoom?.roomNumber}?`}
        confirmText="Remove"
        danger
        loading={removing}
      />
    </div>
  );
};

export default RoomDetails;
