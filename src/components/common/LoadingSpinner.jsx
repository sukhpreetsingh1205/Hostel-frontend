import React from 'react';

const LoadingSpinner = ({ label = 'Loading...' }) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex items-center gap-3 text-gray-700">
        <span className="loading loading-spinner loading-md text-indigo-600" />
        <span className="text-sm">{label}</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
