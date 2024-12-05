// frontend/app/components/CategorizeResponse.js
import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import DraggableItem from './DraggableItem';
import DroppableContainer from './DroppableContainer';

export default function CategorizeResponse({ question, answer, setAnswer }) {
  // Initialize state for categories
  const initialCategories = {
    unassigned: [...question.categorize.options],
  };

  question.categorize.categories.forEach((category) => {
    initialCategories[category] = [];
  });

  const [categories, setCategories] = useState(initialCategories);
  const [activeId, setActiveId] = useState(null);

  // Initialize sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Helper function to find the container an item belongs to
  const findContainer = (id) => {
    for (const [containerId, items] of Object.entries(categories)) {
      if (items.includes(id)) {
        return containerId;
      }
    }
    return null;
  };

  const handleDragStart = ({ active }) => {
    setActiveId(active.id);
  };

  const handleDragOver = ({ active, over }) => {
    if (!over) return;

    const activeContainer = findContainer(active.id);
    const overId = over.id;

    // Check if over an item or a container
    const overContainer = categories[overId] ? overId : findContainer(overId);

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    setCategories((prev) => {
      const activeItems = prev[activeContainer].filter(
        (item) => item !== active.id
      );
      const overItems = [...prev[overContainer], active.id];

      return {
        ...prev,
        [activeContainer]: activeItems,
        [overContainer]: overItems,
      };
    });
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);

    if (!over) return;

    const activeContainer = findContainer(active.id);
    const overId = over.id;
    const overContainer = categories[overId] ? overId : findContainer(overId);

    if (!activeContainer || !overContainer) {
      return;
    }

    if (activeContainer !== overContainer) {
      // Item moved to a different container
      setCategories((prev) => {
        const activeItems = prev[activeContainer].filter(
          (item) => item !== active.id
        );
        const overItems = [...prev[overContainer], active.id];

        return {
          ...prev,
          [activeContainer]: activeItems,
          [overContainer]: overItems,
        };
      });
    } else {
      // Item moved within the same container
      const items = categories[activeContainer];
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);

      if (oldIndex !== newIndex) {
        setCategories((prev) => ({
          ...prev,
          [activeContainer]: arrayMove(items, oldIndex, newIndex),
        }));
      }
    }

    // Update the answer state based on the categories
    const newAnswer = {};
    Object.keys(categories).forEach((category) => {
      if (category !== 'unassigned') {
        categories[category].forEach((item) => {
          newAnswer[item] = category;
        });
      }
    });
    setAnswer(newAnswer);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {/* Unassigned Options */}
      <div className="flex mb-6 justify-center">
        <SortableContext
          items={categories['unassigned']}
          strategy={horizontalListSortingStrategy}
        >
          <DroppableContainer id="unassigned" title="Unassigned Options">
            <div className="flex flex-wrap gap-2">
              {categories['unassigned'].map((item) => (
                <DraggableItem key={item} id={item}>
                  {item}
                </DraggableItem>
              ))}
            </div>
          </DroppableContainer>
        </SortableContext>
      </div>

      {/* Categories */}
      <div className="flex gap-4 justify-center ">
        {question.categorize.categories.map((category) => (
          <SortableContext
            key={category}
            items={categories[category]}
            strategy={verticalListSortingStrategy}
          >
            <DroppableContainer id={category} title={category}>
              {categories[category].map((item) => (
                <DraggableItem key={item} id={item}>
                  {item}
                </DraggableItem>
              ))}
            </DroppableContainer>
          </SortableContext>
        ))}
      </div>

      <DragOverlay>
        {activeId ? (
          <div className="bg-white p-3 rounded-lg shadow-lg">{activeId}</div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}