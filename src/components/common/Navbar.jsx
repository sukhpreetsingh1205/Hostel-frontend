import React from 'react';

const Navbar = ({ title = 'Hostel MS', right }) => {
  return (
    <div className="navbar bg-white border-b border-gray-200 px-4">
      <div className="flex-1">
        <div className="text-lg font-semibold text-gray-900">{title}</div>
      </div>
      <div className="flex-none">{right}</div>
    </div>
  );
};

export default Navbar;
