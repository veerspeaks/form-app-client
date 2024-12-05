'use client';

import { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import CategorizeQuestion from '../components/CategorizeQuestion'
import ClozeQuestion from '../components/ClozeQuestion';
import ComprehensionQuestion from '../components/ComprehensionQuestion';
import Toast from '../components/Toast';

// Reusable component for image upload with enhanced UI
function ImageUpload({ onUpload, label }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async (e) => {
    setIsLoading(true);
    await onUpload(e);
    setIsLoading(false);
  };

  return (
    <div className="mb-6">
      <label className="block mb-2 text-gray-700 font-medium">{label}</label>
      <div className="relative">
        <input
          type="file"
          onChange={handleUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          disabled={isLoading}
        />
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors duration-300">
          <div className="text-gray-500">
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2">Uploading...</span>
              </div>
            ) : (
              <>
                <svg className="mx-auto h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                <p>Drag and drop an image, or click to select</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreateForm() {
  const [title, setTitle] = useState('');
  const [headerImage, setHeaderImage] = useState('');
  const [questions, setQuestions] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', link: '' });
  const [errors, setErrors] = useState({ title: '', questions: [] });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { title: '', questions: [] };

    if (!title.trim()) {
      newErrors.title = 'Form title cannot be empty';
      isValid = false;
    }

    questions.forEach((question, index) => {
      if (!question.prompt.trim()) {
        newErrors.questions[index] = 'Question prompt cannot be empty';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const addQuestion = (type) => {
    const newQuestion = {
      type,
      prompt: '',
      image: ''
    };

    // Initialize specific question type fields
    switch (type) {
      case 'Categorize':
        newQuestion.categorize = {
          categories: [],
          options: []
        };
        break;
      case 'Cloze':
        newQuestion.cloze = {
          cloze: [{
            sentence: '',
            options: []
          }]
        };
        break;
      case 'Comprehension':
        newQuestion.comprehension = {
          comprehension: '',
          comprehension_questions: [],
          comprehension_options: []
        };
        break;
    }

    setQuestions([...questions, newQuestion]);
  };

  const handleSaveForm = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const form = { title, headerImage, questions };
      console.log(form);
      const res = await axios.post('https://form-app-server-dlxy.onrender.com/api/forms', form);
      const formLink = `https://form-app-client-woad.vercel.app/fill-form/${res.data.id}`;
      
      // Show toast with form link
      setToast({
        show: true,
        message: 'Form created successfully!',
        link: formLink
      });

      // Automatically hide toast after 5 seconds
      setTimeout(() => {
        setToast({ show: false, message: '', link: '' });
      }, 5000);

    } catch (error) {
      console.error('Error saving form:', error);
      alert('Error saving form');
    }
  };

  const handleImageUpload = async (e, setImage) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('image', file);

      const res = await axios.post('https://form-app-server-dlxy.onrender.com/api/forms/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImage(res.data.url);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    }
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    setQuestions(updatedQuestions);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-visible">
      {/* Toast notification */}
      {toast.show && (
        <Toast
          message={toast.message}
          link={toast.link}
          onClose={() => setToast({ show: false, message: '', link: '' })}
        />
      )}

      <div className="max-w-4xl mx-auto z-40">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 transform hover:scale-[1.01] transition-transform duration-300">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create a New Form
          </h1>

          {/* Form Title Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Form Title</label>
            <input
              type="text"
              placeholder="Enter an engaging title for your form"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border ${errors.title ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900`}
            />
            {errors.title && <span className="text-red-500 text-sm">{errors.title}</span>}
          </div>

          {/* Header Image Upload */}
          <ImageUpload
            onUpload={(e) => handleImageUpload(e, setHeaderImage)}
            label="Header Image"
          />
          {headerImage && (
            <div className="mt-4 relative rounded-lg overflow-hidden shadow-lg">
              <Image
                src={headerImage}
                alt="Header"
                width={400}
                height={200}
                className="w-full h-auto object-cover"
              />
            </div>
          )}
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {questions.map((question, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-[1.01] transition-all duration-300"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
                    {index + 1}
                  </span>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {question.type}
                  </h2>
                </div>
                <button
                  onClick={() => {
                    const updatedQuestions = questions.filter((_, i) => i !== index);
                    setQuestions(updatedQuestions);
                  }}
                  className="text-red-500 hover:text-red-700 flex items-center space-x-1 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                  <span>Delete</span>
                </button>
              </div>

              {/* Question Content */}
              <div className="space-y-6">
                {/* Question Prompt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Question Prompt</label>
                  <textarea
                    placeholder="Enter your question here..."
                    value={question.prompt}
                    onChange={(e) => updateQuestion(index, 'prompt', e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.questions[index] ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900`}
                    rows={3}
                  />
                  {errors.questions[index] && <span className="text-red-500 text-sm">{errors.questions[index]}</span>}
                </div>

                {/* Question Image */}
                <ImageUpload
                  onUpload={(e) => handleImageUpload(e, (url) => updateQuestion(index, 'image', url))}
                  label="Question Image (Optional)"
                />
                {question.image && (
                  <div className="mt-4 relative rounded-lg overflow-hidden shadow-md">
                    <Image
                      src={question.image}
                      alt="Question"
                      width={300}
                      height={200}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}

                {/* Question Type Specific Components */}
                <div className="bg-gray-50 rounded-xl p-6">
                  {question.type === 'Categorize' && (
                    <CategorizeQuestion
                      question={question}
                      updateQuestion={(field, value) => updateQuestion(index, field, value)}
                    />
                  )}
                  {question.type === 'Cloze' && (
                    <ClozeQuestion
                      question={question}
                      updateQuestion={(field, value) => updateQuestion(index, field, value)}
                    />
                  )}
                  {question.type === 'Comprehension' && (
                    <ComprehensionQuestion
                      question={question}
                      updateQuestion={(field, value) => updateQuestion(index, field, value)}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Question Buttons */}
        <div className="flex flex-wrap gap-4 my-8">
          {['Categorize', 'Cloze', 'Comprehension'].map((type) => (
            <button
              key={type}
              onClick={() => addQuestion(type)}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Add {type} Question
            </button>
          ))}
        </div>

        {/* Save Form Button */}
        <button
          onClick={handleSaveForm}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-medium text-lg hover:from-green-600 hover:to-emerald-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl mb-8"
        >
          Save Form
        </button>
      </div>
    </div>
  );
}