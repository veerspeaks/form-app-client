import React from 'react';

/**
 * Component for creating Comprehension type questions
 * Allows adding a passage and creating multiple MCQ questions based on it
 * 
 * 
 */
export default function ComprehensionQuestion({ question, updateQuestion }) {
  /**
   * Handles changes to individual MCQ questions
   * @param {number} index - Index of the question being modified
   * @param {string} value - New question text
   */
  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...question.comprehension.comprehension_questions];
    updatedQuestions[index] = value;
    updateQuestion('comprehension', {
      ...question.comprehension,
      comprehension_questions: updatedQuestions
    });
  };

  /**
   * Handles changes to MCQ options for each question
   * @param {number} qIndex - Index of the parent question
   * @param {number} optIndex - Index of the option being modified
   * @param {string} value - New option text
   */
  const handleOptionChange = (qIndex, optIndex, value) => {
    const updatedOptions = [...question.comprehension.comprehension_options];
    updatedOptions[qIndex] = updatedOptions[qIndex] || [];
    updatedOptions[qIndex][optIndex] = value;
    updateQuestion('comprehension', {
      ...question.comprehension,
      comprehension_options: updatedOptions
    });
  };

  return (
    <div className="space-y-4">
      {/* Main Comprehension Passage */}
      <div>
        <h3 className="font-medium mb-2 text-black">Comprehension Text</h3>
        <textarea
          value={question.comprehension.comprehension}
          onChange={(e) => {
            updateQuestion('comprehension', {
              ...question.comprehension,
              comprehension: e.target.value
            });
          }}
          placeholder="Enter the comprehension passage"
          className="border p-2 w-full h-32 text-black"
        />
      </div>

      {/* MCQ Questions Section */}
      <div>
        <h3 className="font-medium mb-2 text-black">Questions</h3>
        <div className="space-y-4">
          {/* Individual Questions with Options */}
          {question.comprehension.comprehension_questions.map((mcq, index) => (
            <div key={index} className="border p-4">
              {/* Question Input */}
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={mcq}
                  onChange={(e) => handleQuestionChange(index, e.target.value)}
                  placeholder="Enter question"
                  className="border p-2 flex-grow text-black"
                />
                <button
                  onClick={() => {
                    const updatedQuestions = question.comprehension.comprehension_questions.filter((_, i) => i !== index);
                    const updatedOptions = question.comprehension.comprehension_options.filter((_, i) => i !== index);
                    updateQuestion('comprehension', {
                      ...question.comprehension,
                      comprehension_questions: updatedQuestions,
                      comprehension_options: updatedOptions
                    });
                  }}
                  className="text-red-500"
                >
                  Remove Question
                </button>
              </div>

              {/* MCQ Options for Current Question */}
              <div className="ml-4">
                {(question.comprehension.comprehension_options[index] || []).map((option, optIndex) => (
                  <div key={optIndex} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
                      placeholder="Enter option"
                      className="border p-2 flex-grow text-black"
                    />
                    <button
                      onClick={() => {
                        const updatedOptions = [...question.comprehension.comprehension_options];
                        updatedOptions[index] = updatedOptions[index].filter((_, i) => i !== optIndex);
                        updateQuestion('comprehension', {
                          ...question.comprehension,
                          comprehension_options: updatedOptions
                        });
                      }}
                      className="text-red-500"
                    >
                      Remove Option
                    </button>
                  </div>
                ))}
                {/* Add Option Button */}
                <button
                  onClick={() => {
                    const updatedOptions = [...question.comprehension.comprehension_options];
                    updatedOptions[index] = updatedOptions[index] || [];
                    updatedOptions[index].push('');
                    updateQuestion('comprehension', {
                      ...question.comprehension,
                      comprehension_options: updatedOptions
                    });
                  }}
                  className="text-blue-500"
                >
                  Add Option
                </button>
              </div>
            </div>
          ))}
          {/* Add New Question Button */}
          <button
            onClick={() => {
              const updatedQuestions = [...question.comprehension.comprehension_questions, ''];
              const updatedOptions = [...question.comprehension.comprehension_options, []];
              updateQuestion('comprehension', {
                ...question.comprehension,
                comprehension_questions: updatedQuestions,
                comprehension_options: updatedOptions
              });
            }}
            className="bg-blue-500 text-white px-4 py-2"
          >
            Add Question
          </button>
        </div>
      </div>
    </div>
  );
}