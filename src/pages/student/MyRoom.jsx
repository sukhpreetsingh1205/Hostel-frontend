import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FaBed, FaWifi, FaFan, FaSnowflake, FaToilet, FaClipboardList } from 'react-icons/fa';

const MyRoom = () => {
  const { currentStudent } = useSelector((state) => state.student);
  const room = currentStudent?.roomId;
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestData, setRequestData] = useState({
    type: 'maintenance',
    description: '',
  });

  if (!room) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="text-gray-400 mb-4">
          <FaBed className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Room Allotted</h3>
        <p className="text-gray-600">You haven't been assigned a room yet. Please contact the admin.</p>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle room change/maintenance request
    console.log('Request submitted:', requestData);
    setShowRequestForm(false);
    alert('Request submitted successfully');
  };

  return (
    <div className="space-y-6">
      {/* Room Details */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">Room {room.roomNumber}</h1>
            <p className="text-lg mt-1">Block {room.block}, Floor {room.floor}</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Room Type</p>
            <p className="text-xl font-semibold capitalize">{room.type} Seater</p>
          </div>
        </div>
      </div>

      {/* Room Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Monthly Rent</p>
              <p className="text-2xl font-bold text-gray-900">₹{room.rent}</p>
            </div>
            <FaBed className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Capacity</p>
              <p className="text-2xl font-bold text-gray-900">{room.capacity}</p>
            </div>
            <FaBed className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Occupancy</p>
              <p className="text-2xl font-bold text-gray-900">{room.currentOccupancy}/{room.capacity}</p>
            </div>
            <FaBed className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Room Amenities</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {room.amenities?.map((amenity, index) => (
            <div key={index} className="flex items-center space-x-2">
              {amenity === 'ac' && <FaSnowflake className="h-5 w-5 text-blue-500" />}
              {amenity === 'fan' && <FaFan className="h-5 w-5 text-gray-500" />}
              {amenity === 'wifi' && <FaWifi className="h-5 w-5 text-green-500" />}
              {amenity === 'attached washroom' && <FaToilet className="h-5 w-5 text-purple-500" />}
              <span className="text-gray-700 capitalize">{amenity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Roommates (if double/triple) */}
      {room.currentStudents?.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Roommates</h2>
          <div className="space-y-3">
            {room.currentStudents.map((student, index) => (
              student._id !== currentStudent?._id && (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-medium">{student.name?.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-500">{student.course} - Year {student.year}</p>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {/* Request Form */}
      {!showRequestForm ? (
        <button
          onClick={() => setShowRequestForm(true)}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <FaClipboardList />
          <span>Raise Room Request (Maintenance/Room Change)</span>
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Raise Request</h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Request Type</label>
                <select
                  value={requestData.type}
                  onChange={(e) => setRequestData({ ...requestData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="maintenance">Maintenance Issue</option>
                  <option value="room_change">Room Change Request</option>
                  <option value="complaint">Other Complaint</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={requestData.description}
                  onChange={(e) => setRequestData({ ...requestData, description: e.target.value })}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Please describe your issue in detail..."
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowRequestForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Submit Request
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MyRoom;