

import React, { useState } from 'react';
import { SurveyAnswers, LikertScore } from '../types';

interface SurveyProps {
  questions: string[];
  title: string;
  onComplete: (answers: SurveyAnswers) => void;
}

/**
 * A reusable survey component that displays a list of questions with a 5-point Likert scale.
 * It manages its own internal state for answers and calls an onComplete callback when submitted.
 * This is a good example of a controlled component in React.
 */
const Survey: React.FC<SurveyProps> = ({ questions, title, onComplete }) => {
  // State to store the user's Likert score for each question.
  // The key is the question text, and the value is the LikertScore (1-5).
  const [answers, setAnswers] = useState<Record<string, LikertScore>>({});
  // State for the optional comments text area.
  const [comment, setComment] = useState('');

  // Handler function for when a user selects a radio button.
  // It updates the `answers` state with the new score for the given question.
  const handleScoreChange = (question: string, score: LikertScore) => {
    setAnswers(prev => ({ ...prev, [question]: score }));
  };
  
  // A simple validation check to see if all questions have been answered.
  // This is used to enable/disable the submit button.
  const isComplete = questions.every(q => answers[q] !== undefined);

  // Handler for the form submission.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the default browser form submission behavior.
    if (isComplete) {
      // Calls the onComplete callback prop, passing the collected data up to the parent component (App.tsx).
      onComplete({ scores: answers, comment });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg animate-fade-in">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">{title}</h1>
      <p className="text-slate-600 mb-6">Please rate your agreement with the following statements on a scale of 1 (Strongly Disagree) to 5 (Strongly Agree).</p>
      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {/* Map over the questions array to render each question block. */}
          {questions.map((q, qIndex) => (
            <div key={qIndex}>
              <p className="font-semibold text-slate-700 mb-3">{qIndex + 1}. {q}</p>
              <div className="flex justify-between items-center text-sm text-slate-500 px-1">
                  <span>Strongly Disagree</span>
                  <span>Neutral</span>
                  <span>Strongly Agree</span>
              </div>
              <div className="flex justify-between items-center space-x-2 bg-slate-50 p-3 rounded-lg">
                {/* Render the 5 radio buttons for the Likert scale. */}
                {[1, 2, 3, 4, 5].map(score => (
                  <label key={score} className="flex flex-col items-center cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${qIndex}`} // `name` groups the radio buttons, so only one can be selected.
                      value={score}
                      checked={answers[q] === score} // The input is "controlled" by the component's state.
                      onChange={() => handleScoreChange(q, score as LikertScore)}
                      className="h-6 w-6 text-indigo-600 border-gray-300 focus:ring-indigo-500 mb-1"
                    />
                    <span className="text-sm font-medium">{score}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* The optional comments text area, also a controlled component. */}
        <div className="mt-8">
          <label htmlFor="comment" className="block font-semibold text-slate-700 mb-2">Optional comments:</label>
          <textarea
            id="comment"
            value={comment}
            onChange={e => setComment(e.target.value)}
            rows={3}
            className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Any additional feedback?"
          />
        </div>

        {/* The submit button is disabled until all questions are answered. */}
        <div className="mt-8 text-center">
          <button
            type="submit"
            disabled={!isComplete}
            className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300"
          >
            Submit Answers
          </button>
        </div>
      </form>
    </div>
  );
};

export default Survey;
