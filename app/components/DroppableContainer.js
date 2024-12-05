// frontend/app/components/DroppableContainer.js
import React from 'react';
import { useDroppable } from '@dnd-kit/core';

export default function DroppableContainer({ id, title, children }) {
  const { isOver, setNodeRef } = useDroppable({ id });
  const style = {
    backgroundColor: isOver ? '#e2e8f0' : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-100 p-6 rounded-xl shadow-lg min-h-[150px]"
    >
      <h3 className="text-gray-800 text-lg font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}