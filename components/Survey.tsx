
import React, { useState } from 'react';
import { SurveyAnswers, LikertScore } from '../types';

interface SurveyProps {
  questions: string[];
  title: string;
  onComplete: (answers: SurveyAnswers) => void;
}

const Survey: React.FC<SurveyProps> = ({ questions, title, onComplete }) => {
  const [answers, setAnswers] = useState<Record<string, LikertScore>>({});
  const [comment, setComment] = useState('');

  const handleScoreChange = (question: string, score: LikertScore) => {
    setAnswers(prev => ({ ...prev, [question]: score }));
  };
  
  const isComplete = questions.every(q => answers[q] !== undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isComplete) {
      onComplete({ scores: answers, comment });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg animate-fade-in">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">{title}</h1>
      <p className="text-slate-600 mb-6">Please rate your agreement with the following statements on a scale of 1 (Strongly Disagree) to 5 (Strongly Agree).</p>
      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {questions.map((q, qIndex) => (
            <div key={qIndex}>
              <p className="font-semibold text-slate-700 mb-3">{qIndex + 1}. {q}</p>
              <div className="flex justify-between items-center text-sm text-slate-500 px-1">
                  <span>Strongly Disagree</span>
                  <span>Neutral</span>
                  <span>Strongly Agree</span>
              </div>
              <div className="flex justify-between items-center space-x-2 bg-slate-50 p-3 rounded-lg">
                {[1, 2, 3, 4, 5].map(score => (
                  <label key={score} className="flex flex-col items-center cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${qIndex}`}
                      value={score}
                      checked={answers[q] === score}
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
