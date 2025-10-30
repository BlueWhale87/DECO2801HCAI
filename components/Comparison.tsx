

import React, { useState } from 'react';
import { FINAL_QUESTIONS } from '../constants';
import { FinalAnswers, FinalPreference } from '../types';

interface ComparisonProps {
  onComplete: (answers: FinalAnswers) => void;
}

/**
 * This component renders the final set of questions where the user compares the two AI systems.
 * Like the Survey component, it's a controlled form that manages its own state and reports
 * the final answers to its parent via the `onComplete` prop.
 */
const Comparison: React.FC<ComparisonProps> = ({ onComplete }) => {
  // State to hold the answers for the final questions.
  // Using Partial<FinalAnswers> allows us to build the object property by property.
  const [answers, setAnswers] = useState<Partial<FinalAnswers>>({});

  // A generic handler to update a specific property in the `answers` state.
  // This is a reusable pattern that avoids writing a separate handler for each question.
  // Using generics (<K extends keyof FinalAnswers>) ensures type safety.
  const handleSelection = <K extends keyof FinalAnswers,>(key: K, value: FinalAnswers[K]) => {
    setAnswers(prev => ({...prev, [key]: value}));
  };

  // Check if all three questions have been answered.
  const isComplete = answers.preferred && answers.trustworthy && answers.reasoning;

  // Handles form submission.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(isComplete) {
        // We can safely cast `answers` to `FinalAnswers` because `isComplete` is true.
        onComplete(answers as FinalAnswers);
    }
  };

  // Define the options for the radio buttons to avoid repetition in the JSX.
  const options: {label: string; value: FinalPreference}[] = [
    { label: 'Transparent AI (with explanations)', value: 'transparent' },
    { label: 'Opaque AI (without explanations)', value: 'opaque' },
    { label: 'No Preference', value: 'no_preference' },
  ];
  
  const reasoningOptions = [
    { label: 'Shows reasoning', value: 'shows_reasoning' },
    { label: 'Just gives decisions', value: 'just_decisions' },
    { label: 'No Preference', value: 'no_preference' },
  ];

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-800 mb-4">Final Comparison</h1>
      <p className="text-slate-600 mb-8">Please answer a few final questions about your experience.</p>
      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
            {/* Preferred System Question */}
            <div>
              <p className="font-semibold text-slate-700 mb-3">{FINAL_QUESTIONS.preferred}</p>
              <div className="space-y-2">
                {options.map(opt => (
                  <label key={opt.value} className="flex items-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer">
                    <input type="radio" name="preferred" value={opt.value} checked={answers.preferred === opt.value} onChange={() => handleSelection('preferred', opt.value)} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
                    <span className="ml-3 text-slate-800">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Trustworthy System Question */}
            <div>
              <p className="font-semibold text-slate-700 mb-3">{FINAL_QUESTIONS.trustworthy}</p>
              <div className="space-y-2">
                {options.map(opt => (
                  <label key={opt.value} className="flex items-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer">
                    <input type="radio" name="trustworthy" value={opt.value} checked={answers.trustworthy === opt.value} onChange={() => handleSelection('trustworthy', opt.value)} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
                    <span className="ml-3 text-slate-800">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Reasoning Preference Question */}
            <div>
              <p className="font-semibold text-slate-700 mb-3">{FINAL_QUESTIONS.reasoning}</p>
              <div className="space-y-2">
                {reasoningOptions.map(opt => (
                  <label key={opt.value} className="flex items-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer">
                    <input type="radio" name="reasoning" value={opt.value} checked={answers.reasoning === opt.value} onChange={() => handleSelection('reasoning', opt.value as any)} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
                    <span className="ml-3 text-slate-800">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
        </div>
        <div className="mt-10 text-center">
            {/* Submit button is disabled until the form is complete. */}
            <button type="submit" disabled={!isComplete} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300">
                Finish Study
            </button>
        </div>
      </form>
    </div>
  );
};

export default Comparison;
