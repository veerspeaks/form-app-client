// frontend/app/components/ClozeResponse.js
import React, { useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import DraggableOption from './DraggableOption';
import DroppableBlank from './DroppableBlank';
import { motion } from 'framer-motion';

/**
 * Component for answering Cloze type questions
 * Displays a sentence with blanks and draggable options
 */
export default function ClozeResponse({ question, answer, setAnswer }) {
  const clozeData = question.cloze.cloze[0];
  const { sentence, options } = clozeData;

  const blanksCount = sentence.split('_____').length - 1;
  const [blanks, setBlanks] = useState(Array(blanksCount).fill(null));
  const [availableOptions, setAvailableOptions] = useState(
    options.map((option, index) => ({ id: `option-${index}`, content: option }))
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const newBlanks = [...blanks];
    let newAvailableOptions = [...availableOptions];

    // If dropping onto a blank
    if (over.id.startsWith('blank-')) {
      const blankIndex = parseInt(over.id.replace('blank-', ''));

      // Find the option being dragged
      const optionIndex = newAvailableOptions.findIndex(
        (option) => option.id === active.id
      );

      // If the option was from availableOptions
      if (optionIndex !== -1) {
        // If there's already an option in the blank, move it back to available options
        if (newBlanks[blankIndex]) {
          newAvailableOptions.push(newBlanks[blankIndex]);
        }

        // Place the new option in the blank
        newBlanks[blankIndex] = newAvailableOptions[optionIndex];

        // Remove it from availableOptions
        newAvailableOptions.splice(optionIndex, 1);
      }
      // Else, the option was from another blank
      else {
        const fromBlankIndex = blanks.findIndex(
          (option) => option && option.id === active.id
        );

        if (fromBlankIndex !== -1) {
          // Swap the options between blanks
          const temp = newBlanks[blankIndex];
          newBlanks[blankIndex] = newBlanks[fromBlankIndex];
          newBlanks[fromBlankIndex] = temp;
        }
      }
    }
    // If moving back to options
    else if (over.id === 'options') {
      // Find if the active draggable is in blanks
      const blankIndex = newBlanks.findIndex(
        (option) => option && option.id === active.id
      );

      if (blankIndex !== -1) {
        // Move option back to availableOptions
        newAvailableOptions.push(newBlanks[blankIndex]);
        newBlanks[blankIndex] = null;
      }
    }

    setBlanks(newBlanks);
    setAvailableOptions(newAvailableOptions);
    setAnswer(newBlanks.map((blank) => (blank ? blank.content : null)));
  };

  const sentenceParts = sentence.split('_____');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <DndContext onDragEnd={handleDragEnd}>
        <motion.div
          className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
        >
          <div className="flex flex-wrap items-center gap-3 text-lg">
            {sentenceParts.map((part, index) => (
              <React.Fragment key={index}>
                <span className="text-gray-800">{part}</span>
                {index < blanksCount && (
                  <DroppableBlank id={`blank-${index}`}>
                    {blanks[index] ? (
                      <DraggableOption id={blanks[index].id}>
                        {blanks[index].content}
                      </DraggableOption>
                    ) : (
                      <span className="text-gray-400">Drop here</span>
                    )}
                  </DroppableBlank>
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        <div className="p-6 bg-gray-50 rounded-xl shadow-lg">
          <div id="options" className="flex flex-wrap items-center gap-3">
            {availableOptions.map((option) => (
              <DraggableOption key={option.id} id={option.id}>
                {option.content}
              </DraggableOption>
            ))}
          </div>
        </div>
      </DndContext>
    </motion.div>
  );
}