import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchRooms, deleteRoom } from '../../../features/room/roomSlice';
import { FiPlus, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const RoomList = () => {
  const dispatch = useDispatch();
  const { rooms, loading } = useSelector((state) => state.room);
  const [filterBlock, setFilterBlock] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    dispatch(fetchRooms({ block: filterBlock, type: filterType }));
  }, [dispatch, filterBlock, filterType]);

  const handleDelete = async (id, roomNumber) => {
    if (window.confirm(`Are you sure you want to delete room ${roomNumber}?`)) {
      const result = await dispatch(deleteRoom(id));
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success('Room deleted successfully');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'full': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Room Management</h1>
          <p className="text-gray-600 mt-1">Manage hostel rooms and allocations</p>
        </div>
        <Link
          to="/admin/rooms/new"
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <FiPlus />
          <span>Add Room</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filterBlock}
            onChange={(e) => setFilterBlock(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Blocks</option>
            <option value="A">Block A</option>
            <option value="B">Block B</option>
            <option value="C">Block C</option>
          </select>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Types</option>
            <option value="single">Single Seater</option>
            <option value="double">Double Seater</option>
            <option value="triple">Triple Seater</option>
          </select>
        </div>
      </div>

      {/* Rooms Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div key={room._id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{room.roomNumber}</h3>
                    <p className="text-sm text-gray-500">Block {room.block}, Floor {room.floor}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(room.status)}`}>
                    {room.status}
                  </span>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Type:</span>
                    <span className="font-medium capitalize">{room.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Capacity:</span>
                    <span className="font-medium">{room.currentOccupancy}/{room.capacity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Rent:</span>
                    <span className="font-medium">₹{room.rent}/month</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Amenities:</span>
                    <span className="font-medium">{room.amenities?.length || 0} items</span>
                  </div>
                </div>

                {room.currentStudents?.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700">Current Occupants:</p>
                    <div className="mt-1 space-y-1">
                      {room.currentStudents.map((student, idx) => (
                        <p key={idx} className="text-sm text-gray-600">{student.name}</p>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-end space-x-2">
                  <Link
                    to={`/admin/rooms/${room._id}`}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <FiEye className="h-5 w-5" />
                  </Link>
                  <Link
                    to={`/admin/rooms/${room._id}/edit`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <FiEdit2 className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(room._id, room.roomNumber)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomList;