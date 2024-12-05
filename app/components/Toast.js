// frontend/app/components/Toast.js
import React from 'react';

export default function Toast({ message, link, onClose }) {
  return (
    <div className="fixed top-4 right-4 z-50 bg-white border border-gray-300 shadow-lg rounded-lg p-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-900 font-medium">{message}</p>
          {link && (
            <a href={link} className="text-blue-500 hover:underline">
              View Form
            </a>
          )}
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          &times;
        </button>
      </div>
    </div>
  );
}