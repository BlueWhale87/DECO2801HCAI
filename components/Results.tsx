

import React from 'react';
import { StudyResults, ConditionType } from '../types';
import { LIKERT_QUESTIONS } from '../constants';
import { ExportIcon } from './icons';
// Import components from the 'recharts' library for data visualization.
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ResultsProps {
  results: StudyResults;
}

/**
 * A helper function to calculate the average score from a survey's results.
 * It handles cases where scores might be undefined or empty.
 */
const calculateAverage = (scores: Record<string, number> | undefined) => {
    if (!scores) return 0;
    const values = Object.values(scores);
    if (values.length === 0) return 0;
    // Use reduce to sum up the scores and then divide by the number of scores.
    return values.reduce((sum, score) => sum + score, 0) / values.length;
};


/**
 * The final component shown to the user, displaying a summary of their results
 * and providing an option to export their data.
 */
const Results: React.FC<ResultsProps> = ({ results }) => {

  /**
   * Handles the export of study data. This is a common web development pattern.
   * 1. Stringify the `results` object into a JSON formatted string.
   * 2. Create a `Blob` (Binary Large Object) from the string.
   * 3. Create a temporary URL for the Blob.
   * 4. Create a hidden anchor (`<a>`) element, set its `href` to the blob URL and `download` attribute.
   * 5. Programmatically click the anchor to trigger the browser's download prompt.
   * 6. Clean up by removing the anchor and revoking the object URL.
   */
  const handleExport = () => {
    const jsonString = JSON.stringify(results, null, 2); // The `null, 2` part formats the JSON nicely.
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
  
  // Calculate average scores for both conditions to be used in the chart.
  const transparentAvg = calculateAverage(results.transparentScores?.scores);
  const opaqueAvg = calculateAverage(results.opaqueScores?.scores);

  // Prepare the data in the format required by the 'recharts' library.
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
        {/* The ResponsiveContainer makes the chart adapt to the width of its parent container. */}
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    {/* Define the Y-axis with a domain from 0 to 5 and specific ticks. */}
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
