import React from 'react';
import { Toaster } from 'react-hot-toast';

const ToastNotification = (props) => {
  return <Toaster position="top-right" {...props} />;
};

export default ToastNotification;
