import React from 'react';
import { Link } from 'react-router-dom';

const RoomForm = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold text-gray-900">Room Form</h1>
      <p className="text-gray-600 mt-2">
        This page is a placeholder. Tell me the fields in your Room model you want on the UI and I’ll wire up the full create/edit form.
      </p>
      <div className="mt-4">
        <Link to="/admin/rooms" className="btn btn-outline btn-sm">
          Back to Rooms
        </Link>
      </div>
    </div>
  );
};

export default RoomForm;
