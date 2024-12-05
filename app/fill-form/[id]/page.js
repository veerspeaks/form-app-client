'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import CategorizeResponse from '../../components/CategorizeResponse';
import ClozeResponse from '../../components/ClozeResponse';
import ComprehensionResponse from '../../components/ComprehensionResponse';

export default function FillForm() {
  const params = useParams();
  const formId = params.id;

  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/forms/${formId}`)
      .then((res) => {
        setForm(res.data);
        setAnswers(new Array(res.data.questions.length).fill([]));
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [formId]);

  const handleSubmit = async () => {
    try {
      await axios.post(`http://localhost:4000/api/forms/${formId}/responses`, {
        answers,
      });
      setSubmitted(true);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error(error);
      alert('Error submitting form');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-black text-xl">Loading...</div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-black text-xl">Form not found</div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black mb-4">Thank you for submitting!</h2>
          <p className="text-gray-700">Your responses have been recorded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen ">
      {/* Form Header */}
      <div className="max-w-4xl mx-auto p-4 sm:p-8">
        <div className="text-center bg-white rounded-lg shadow-lg p-8 mb-8">
          {form.headerImage && (
            <div className="mb-6 rounded-lg overflow-hidden">
              <Image
                src={form.headerImage}
                alt="Header"
                width={800}
                height={400}
                className="w-full h-auto object-cover"
              />
            </div>
          )}
          <h1 className="text-4xl font-bold text-black">{form.title}</h1>
          <p className="text-gray-800 mt-4">{form.description}</p>
        </div>

        {/* Questions */}
        <div className="space-y-8">
          {form.questions.map((question, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-lg">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-blue-100 text-blue-900 text-sm font-medium px-3 py-1 rounded">
                    Question {index + 1}
                  </span>
                  <span className="bg-gray-200 text-gray-900 text-sm font-medium px-3 py-1 rounded">
                    {question.type}
                  </span>
                </div>
                
                <h2 className="text-gray-800 text-xl font-semibold mb-4">{question.prompt}</h2>
                
                {question.image && (
                  <Image
                    src={question.image}
                    alt="Question"
                    width={600}
                    height={300}
                    className="w-full h-[200px] object-cover rounded-lg mb-4"
                  />
                )}
              </div>

              <div className="bg-gray-100 p-6 rounded-lg ">
                {question.type === 'Categorize' && (
                  <CategorizeResponse
                    question={question}
                    answer={answers[index]}
                    setAnswer={(newAnswer) => {
                      const newAnswers = [...answers];
                      newAnswers[index] = newAnswer;
                      setAnswers(newAnswers);
                    }}
                  />
                )}

                {question.type === 'Cloze' && (
                  <ClozeResponse
                    question={question}
                    answer={answers[index]}
                    setAnswer={(newAnswer) => {
                      const newAnswers = [...answers];
                      newAnswers[index] = newAnswer;
                      setAnswers(newAnswers);
                    }}
                  />
                )}

                {question.type === 'Comprehension' && (
                  <ComprehensionResponse
                    question={question}
                    answer={answers[index]}
                    setAnswer={(newAnswer) => {
                      const newAnswers = [...answers];
                      newAnswers[index] = newAnswer;
                      setAnswers(newAnswers);
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-12 flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-12 py-4 rounded-full hover:shadow-xl transform hover:scale-105 transition-all font-bold text-lg"
          >
            Submit Form
          </button>
        </div>
      </div>
    </div>
  );
}