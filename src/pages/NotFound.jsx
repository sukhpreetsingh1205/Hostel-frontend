import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome } from 'react-icons/fi';

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-950 p-4">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
      <div className="text-8xl font-black text-gradient mb-4">404</div>
      <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">Page Not Found</h1>
      <p className="text-surface-500 dark:text-surface-400 mb-8 max-w-sm mx-auto">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link to="/" className="btn-primary">
        <FiHome className="w-4 h-4" /> Go Home
      </Link>
    </motion.div>
  </div>
);

export default NotFound;
