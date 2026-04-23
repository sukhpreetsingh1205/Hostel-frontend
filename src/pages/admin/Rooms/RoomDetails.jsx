import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchRoomById, clearCurrentRoom } from '../../../features/room/roomSlice';

const RoomDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { currentRoom, loading, error } = useSelector((state) => state.room);

  useEffect(() => {
    if (id) dispatch(fetchRoomById(id));
    return () => dispatch(clearCurrentRoom());
  }, [dispatch, id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Room Details</h1>
          <p className="text-gray-600 mt-1">View room info and occupancy</p>
        </div>
        <Link to="/admin/rooms" className="btn btn-outline btn-sm">
          Back
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
          </div>
        ) : error ? (
          <div className="text-red-700 bg-red-50 border border-red-200 rounded-lg p-4">{error}</div>
        ) : !currentRoom ? (
          <div className="text-gray-600">Room not found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-xs text-gray-500">Room Number</div>
              <div className="font-semibold text-gray-900">{currentRoom.roomNumber}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Block</div>
              <div className="font-semibold text-gray-900">{currentRoom.block || '—'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Type</div>
              <div className="font-semibold text-gray-900">{currentRoom.type || '—'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Capacity</div>
              <div className="font-semibold text-gray-900">{currentRoom.capacity || '—'}</div>
            </div>
            <div className="md:col-span-2">
              <div className="text-xs text-gray-500">Occupants</div>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(currentRoom.occupants || currentRoom.students || []).length ? (
                  (currentRoom.occupants || currentRoom.students).map((s) => (
                    <div key={s?._id || s?.studentId} className="border rounded-lg p-3">
                      <div className="font-semibold text-gray-900">{s?.userId?.name || s?.name || 'Student'}</div>
                      <div className="text-xs text-gray-500">{s?.rollNumber || ''}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-600">No occupants.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomDetails;
