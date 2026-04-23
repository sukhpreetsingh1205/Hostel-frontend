import React from 'react';

const ErrorAlert = ({ title = 'Error', message, onClose, className = '' }) => {
  if (!message) return null;

  return (
    <div className={`alert alert-error shadow-sm ${className}`}>
      <div className="flex-1">
        <h3 className="font-semibold">{title}</h3>
        <div className="text-sm opacity-90">{message}</div>
      </div>
      {onClose ? (
        <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
          Close
        </button>
      ) : null}
    </div>
  );
};

export default ErrorAlert;
