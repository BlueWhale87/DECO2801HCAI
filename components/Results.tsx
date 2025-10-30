
import React from 'react';
import { StudyResults, ConditionType } from '../types';
import { LIKERT_QUESTIONS } from '../constants';
import { ExportIcon } from './icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ResultsProps {
  results: StudyResults;
}

const calculateAverage = (scores: Record<string, number> | undefined) => {
    if (!scores) return 0;
    const values = Object.values(scores);
    if (values.length === 0) return 0;
    return values.reduce((sum, score) => sum + score, 0) / values.length;
};


const Results: React.FC<ResultsProps> = ({ results }) => {

  const handleExport = () => {
    const jsonString = JSON.stringify(results, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `study-results-${results.participantId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const transparentAvg = calculateAverage(results.transparentScores?.scores);
  const opaqueAvg = calculateAverage(results.opaqueScores?.scores);

  const chartData = [
    {
      name: 'Transparent AI',
      'Average Score': transparentAvg,
    },
    {
      name: 'Opaque AI',
      'Average Score': opaqueAvg,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-800 mb-4">Thank You!</h1>
      <p className="text-lg text-slate-600 mb-6">
        Your participation has been recorded. Your feedback is invaluable for our research on AI transparency and user trust.
      </p>

      <div className="bg-slate-50 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold text-slate-700 mb-4">Your Results Summary</h2>
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 5]} ticks={[1,2,3,4,5]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Average Score" fill="#4f46e5" />
                </BarChart>
            </ResponsiveContainer>
        </div>
        <div className="mt-4 text-center text-slate-500">
            Average trust and confidence scores (out of 5).
        </div>
      </div>
      
      <div className="text-center">
        <button
          onClick={handleExport}
          className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
        >
          <ExportIcon />
          Export Study Data (.json)
        </button>
      </div>
    </div>
  );
};

export default Results;
