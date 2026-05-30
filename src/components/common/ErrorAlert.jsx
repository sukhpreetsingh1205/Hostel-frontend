import React from 'react';
import { motion } from 'framer-motion';
import { FiAlertCircle, FiX } from 'react-icons/fi';

const ErrorAlert = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800"
    >
      <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
      <p className="flex-1 text-sm text-red-600 dark:text-red-400">{message}</p>
      {onClose && (
        <button onClick={onClose} className="text-red-400 hover:text-red-600">
          <FiX className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
};

export default ErrorAlert;
