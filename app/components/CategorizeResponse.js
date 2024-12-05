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
    unassigned: [...question.categorize.options], // copy the options array to the unassigned category
  };

  question.categorize.categories.forEach((category) => {
    initialCategories[category] = []; // create an empty array for each category
  });

  const [categories, setCategories] = useState(initialCategories); // initialize the categories state with the initialCategories
  const [activeId, setActiveId] = useState(null); // initialize the activeId state with null

  // Initialize sensors
  const sensors = useSensors( // initialize the sensors with the PointerSensor and KeyboardSensor
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Helper function to find the container an item belongs to
  const findContainer = (id) => {
    for (const [containerId, items] of Object.entries(categories)) { // iterate over the categories object
      if (items.includes(id)) { // check if the item is in the category
        return containerId; // return the containerId if the item is in the category
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
      const activeItems = prev[activeContainer].filter( // filter the active items in the active container
        (item) => item !== active.id
      );
      const overItems = [...prev[overContainer], active.id]; // add the active item to the over container

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

    const activeContainer = findContainer(active.id); // find the container the active item belongs to
    const overId = over.id; // get the id of the over item
    const overContainer = categories[overId] ? overId : findContainer(overId); // get the container the over item belongs to

    if (!activeContainer || !overContainer) {
      return;
    }

    if (activeContainer !== overContainer) {
      // Item moved to a different container
      setCategories((prev) => {
        const activeItems = prev[activeContainer].filter( // filter the active items in the active container
          (item) => item !== active.id
        );
        const overItems = [...prev[overContainer], active.id]; // add the active item to the over container

        return {
          ...prev,
          [activeContainer]: activeItems,
          [overContainer]: overItems,
        };
      });
    } else {
      // Item moved within the same container
      const items = categories[activeContainer];
      const oldIndex = items.indexOf(active.id); // get the index of the active item
      const newIndex = items.indexOf(over.id); // get the index of the over item

      if (oldIndex !== newIndex) {
        setCategories((prev) => ({
          ...prev,
          [activeContainer]: arrayMove(items, oldIndex, newIndex), // move the active item to the new index
        }));
      }
    }

    // Update the answer state based on the categories
    const newAnswer = {};
    Object.keys(categories).forEach((category) => {
      if (category !== 'unassigned') {
        categories[category].forEach((item) => {
          newAnswer[item] = category; // add the item to the new answer object with the category as the value
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
          items={categories['unassigned']} // get the unassigned items
          strategy={horizontalListSortingStrategy} // use the horizontal list sorting strategy
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
            items={categories[category]} // get the items in the category
            strategy={verticalListSortingStrategy} // use the vertical list sorting strategy
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