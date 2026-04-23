import React from 'react';

const StatsCard = ({ title, value, icon: Icon, color = 'bg-indigo-600', change }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${color}`}>
          {Icon ? <Icon className="h-6 w-6 text-white" /> : null}
        </div>
      </div>
      {change ? <p className="text-xs text-gray-500 mt-3">Change: {change}</p> : null}
    </div>
  );
};

export default StatsCard;
