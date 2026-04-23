import React from 'react';

const RecentActivity = ({ title, time, icon: Icon, color = 'bg-gray-100', iconColor = 'text-gray-700' }) => {
  return (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0">
        <div className={`h-8 w-8 rounded-full ${color} flex items-center justify-center`}>
          {Icon ? <Icon className={`h-4 w-4 ${iconColor}`} /> : null}
        </div>
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  );
};

export default RecentActivity;
