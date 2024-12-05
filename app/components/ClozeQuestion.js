import React, { useState, useEffect } from 'react';

/**
 * Component for creating Cloze (fill-in-the-blank) type questions
 * Allows creating sentences with blanks and providing options for those blanks
 * 
 */
export default function ClozeQuestion({ question, updateQuestion }) {
  // State for managing the sentence building process
  const [sentence, setSentence] = useState('');
  const [preview, setPreview] = useState('');
  const [blankCount, setBlankCount] = useState(0);
  const [options, setOptions] = useState([]);
  const [committedText, setCommittedText] = useState('');

  // Update parent component whenever preview or options change
  useEffect(() => {
    updateQuestion('cloze', {
      cloze: [{ sentence: preview, options: options }]
    });
  }, [preview, options]);

  /**
   * Handles adding a blank to the sentence
   * Adds current text plus a blank placeholder
   */
  const handleAddBlank = () => {
    const newCommittedText = committedText + sentence + ' _____ ';
    setCommittedText(newCommittedText);
    setPreview(newCommittedText);
    setBlankCount(prev => prev + 1);
    setSentence('');
  };

  /**
   * Handles changes to the sentence input
   * Updates both the current sentence and preview
   */
  const handleTypeChange = (e) => {
    const newSentence = e.target.value;
    setSentence(newSentence);
    setPreview(committedText + newSentence);
  };

  /**
   * Handles adding a new option for blanks
   * Only allows adding options up to the number of blanks
   */
  const handleAddOption = () => {
    if (options.length < blankCount) {
      setOptions([...options, '']);
    }
  };

  /**
   * Handles changes to option inputs
   */
  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  /**
   * Handles removing an option
   */
  const handleRemoveOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  return (
    <div className="space-y-6">
      {/* Sentence Creation Section */}
      <div className="space-y-2">
        <h3 className="font-medium text-black">Create Sentence with Blanks</h3>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={sentence}
            onChange={handleTypeChange}
            placeholder="Type your sentence"
            className="text-black border p-2 flex-grow rounded-md"
          />
          <button
            onClick={handleAddBlank}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add Blank
          </button>
        </div>
      </div>

      {/* Live Preview Section */}
      <div className="space-y-2">
        <h3 className="font-medium text-black">Preview:</h3>
        <div className="text-black p-4 bg-gray-50 rounded-md min-h-[60px]">
          {preview || 'Start typing your sentence...'}
        </div>
      </div>

      {/* Options Section */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-black">Options for Blanks</h3>
          <span className="text-sm text-gray-500">
            {options.length}/{blankCount} options added
          </span>
        </div>
        
        <div className="space-y-2">
          {/* Option Input Fields */}
          {options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="text-black border p-2 flex-grow rounded-md"
              />
              <button
                onClick={() => handleRemoveOption(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
          
          {/* Add Option Button - Only shown if more options can be added */}
          {options.length < blankCount && (
            <button
              onClick={handleAddOption}
              className="text-blue-500 hover:text-blue-600"
            >
              + Add Option
            </button>
          )}
        </div>
      </div>
    </div>
  );
}