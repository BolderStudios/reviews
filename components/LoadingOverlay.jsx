// components/LoadingOverlay.js
'use client'

import React from 'react';

const LoadingOverlay = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-md shadow-lg">
        <p className="text-lg font-semibold">Loading...</p>
        {/* You can add a spinner or any other loading animation here */}
      </div>
    </div>
  );
};

export default LoadingOverlay;