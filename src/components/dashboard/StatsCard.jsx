import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon: Icon, color = 'bg-brand-500', change, subtitle, delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === 'number' ? value : parseInt(value?.toString().replace(/[^0-9]/g, ''), 10);
  const isNumeric = !isNaN(numericValue) && typeof value === 'number';

  useEffect(() => {
    if (!isNumeric) return;
    let start = 0;
    const duration = 1200;
    const increment = numericValue / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= numericValue) {
        setDisplayValue(numericValue);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [numericValue, isNumeric]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.4 }}
      className="stat-card group"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-surface-900 dark:text-white mt-1">
            {isNumeric ? displayValue.toLocaleString() : value}
          </p>
          {(change || subtitle) && (
            <p className="text-xs mt-1.5">
              {change && (
                <span className={`font-semibold ${change.startsWith('+') ? 'text-emerald-500' : change.startsWith('-') ? 'text-red-500' : 'text-surface-500'}`}>
                  {change}
                </span>
              )}
              {subtitle && <span className="text-surface-400 ml-1">{subtitle}</span>}
            </p>
          )}
        </div>
        <div className={`w-11 h-11 rounded-xl ${color} bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center`}>
          {Icon && <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />}
        </div>
      </div>
      <div className={`stat-icon ${color}`} />
    </motion.div>
  );
};

export default StatsCard;
