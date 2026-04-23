import React from 'react';

const ChartCard = ({ title, children, right }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {right ? <div>{right}</div> : null}
      </div>
      {children}
    </div>
  );
};

export default ChartCard;
