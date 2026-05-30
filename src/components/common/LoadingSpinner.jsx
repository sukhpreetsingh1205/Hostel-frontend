import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ text = 'Loading...', fullScreen = false }) => {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-surface-200 dark:border-surface-700" />
        <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-t-brand-500 animate-spin" />
      </div>
      {text && <p className="text-sm text-surface-500 dark:text-surface-400 animate-pulse">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-50/80 dark:bg-surface-950/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center py-16">{spinner}</div>;
};

export default LoadingSpinner;
