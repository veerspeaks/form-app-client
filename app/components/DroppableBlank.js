// frontend/app/components/DroppableBlank.js
import React from 'react';
import { useDroppable } from '@dnd-kit/core';

export default function DroppableBlank({ id, children }) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  const style = {
    padding: '4px',
    backgroundColor: isOver ? '#e2e8f0' : undefined,
    minWidth: '2rem',
    minHeight: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div ref={setNodeRef} style={style} className="mx-1">
      {children}
    </div>
  );
}