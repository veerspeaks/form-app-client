import React from 'react';
import { motion } from 'framer-motion';

/**
 * Component for answering Comprehension type questions
 * Displays a passage followed by multiple choice questions
 * 
 *
 */
export default function ComprehensionResponse({ question, answer, setAnswer }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <motion.div 
        className="bg-gradient-to-r from-purple-500 to-indigo-600 p-8 rounded-xl shadow-xl"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
      >
        <p className="text-white text-lg leading-relaxed font-medium whitespace-pre-wrap">
          {question.comprehension.comprehension}
        </p>
      </motion.div>

      <div className="space-y-6">
        {question.comprehension.comprehension_questions.map((q, index) => (
          <motion.div
            key={index}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
          >
            <h3 className="text-gray-800 font-semibold mb-4 flex items-center gap-2">
              <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm">
                Question {index + 1}
              </span>
              {q}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {question.comprehension.comprehension_options[index].map((option, optIndex) => (
                <motion.label
                  key={optIndex}
                  className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all ${
                    answer[index] === option
                      ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200'
                      : 'bg-gray-50 border-2 border-transparent hover:border-gray-200'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option}
                    checked={answer[index] === option}
                    onChange={(e) => {
                      const newAnswer = [...answer];
                      newAnswer[index] = e.target.value;
                      setAnswer(newAnswer);
                    }}
                    className="hidden"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    answer[index] === option
                      ? 'border-indigo-500 bg-indigo-500'
                      : 'border-gray-300'
                  }`}>
                    {answer[index] === option && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span className="text-gray-800">{option}</span>
                </motion.label>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}