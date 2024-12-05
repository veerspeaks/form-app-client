import React from 'react';

/**
 * Component for creating Categorize type questions
 * Allows adding categories and items to be categorized
 * 
 * 
 */
export default function CategorizeQuestion({ question, updateQuestion }) {
  return (
    <div className="space-y-4">
      {/* Categories Section */}
      <div>
        <h3 className="text-gray-800 font-medium mb-2">Categories</h3>
        <div className="space-y-2">
          {/* Render existing categories with edit/remove functionality */}
          {question.categorize.categories.map((category, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={category}
                onChange={(e) => {
                  const updatedCategories = [...question.categorize.categories]; // Create a copy of the categories array
                  updatedCategories[index] = e.target.value; // add the new value to the array
                  updateQuestion('categorize', {
                    ...question.categorize,
                    categories: updatedCategories // update the categories array with the new value
                  });
                }}
                placeholder="Enter category"
                className="text-gray-800 border p-2 flex-grow"
              />
              <button
                onClick={() => {
                  const updatedCategories = question.categorize.categories.filter((_, i) => i !== index); // create a new array without the category that is being removed
                  updateQuestion('categorize', {
                    ...question.categorize,
                    categories: updatedCategories // update the categories array with the new array
                  });
                }}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
          {/* Add new category button */}
          <button
            onClick={() => {
              updateQuestion('categorize', {
                ...question.categorize,
                categories: [...question.categorize.categories, '']
              });
            }}
            className="text-blue-500"
          >
            Add Category
          </button>
        </div>
      </div>

      {/* Items to Categorize Section */}
      <div>
        <h3 className="text-gray-800 font-medium mb-2">Items to Categorize</h3>
        <div className="space-y-2">
          {/* Render items with edit/remove functionality */}
          {question.categorize.options.map((option, index) => (
            <div key={index} className="text-gray-800 flex items-center gap-2">
              <input
                type="text"
                value={option}
                onChange={(e) => {
                  const updatedOptions = [...question.categorize.options];
                  updatedOptions[index] = e.target.value;
                  updateQuestion('categorize', {
                    ...question.categorize,
                    options: updatedOptions // update the options array with the new array
                  });
                }}
                placeholder="Enter item"
                className="text-gray-800 border p-2 flex-grow"
              />
              <button
                onClick={() => {
                  const updatedOptions = question.categorize.options.filter((_, i) => i !== index); // create a new array without the option that is being removed
                  updateQuestion('categorize', {
                    ...question.categorize,
                    options: updatedOptions // update the options array with the new array
                  });
                }}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
          {/* Add new item button */}
          <button
            onClick={() => {
              updateQuestion('categorize', {
                ...question.categorize,
                options: [...question.categorize.options, '']
              });
            }}
            className="text-blue-500"
          >
            Add Item
          </button>
        </div>
      </div>
    </div>
  );
}