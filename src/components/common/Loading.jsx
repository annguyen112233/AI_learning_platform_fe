import React from 'react';

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-full w-full p-4">
      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );
}