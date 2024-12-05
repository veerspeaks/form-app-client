// frontend/app/components/DraggableOption.js
import React from 'react';
import { useDraggable } from '@dnd-kit/core';

export default function DraggableOption({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
  });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className=" text-gray-800 bg-white px-3 py-1 rounded-md shadow-sm border border-gray-300"
    >
      {children}
    </div>
  );
}