import React, { useState } from 'react';
import { ConditionType, ClauseAnalysis, PolicyPart } from '../types';
import { POLICY_CONTENT, POLICY_ANALYSIS, AI_BIAS_DISCLOSURE, AI_CONCLUSION } from '../constants';
import { ConcernIcon, PositiveIcon, InfoIcon } from './icons';

interface PolicyViewProps {
  mode: ConditionType;
  onComplete: () => void;
}

const Clause: React.FC<{ part: PolicyPart; analysis?: ClauseAnalysis; mode: ConditionType }> = ({ part, analysis, mode }) => {
  const [showExplanation, setShowExplanation] = useState(false);
  
  if (!analysis) return <p className="mb-4">{part.content}</p>;

  const isConcerning = analysis.type === 'concerning';
  const isPositive = analysis.type === 'positive';

  const baseHighlightStyle = 'px-2 py-1 rounded-md transition-all duration-300 cursor-pointer';
  const concernHighlight = 'bg-red-100 hover:bg-red-200 text-red-900';
  const positiveHighlight = 'bg-green-100 hover:bg-green-200 text-green-900';
  const neutralHighlight = 'bg-slate-100 hover:bg-slate-200 text-slate-700';

  let highlightStyle = neutralHighlight;
  let animationClass = 'animate-highlight-slate';
  if (isConcerning) {
      highlightStyle = concernHighlight;
      animationClass = 'animate-highlight-red';
  }
  if (isPositive) {
      highlightStyle = positiveHighlight;
      animationClass = 'animate-highlight-green';
  }

  return (
    <div className="mb-4 relative">
      <p>
        <span
          className={`${baseHighlightStyle} ${highlightStyle} ${animationClass}`}
          onClick={() => setShowExplanation(!showExplanation)}
        >
          {part.content}
        </span>
      </p>
      
      <div className={`mt-2 transition-all duration-500 ease-in-out overflow-hidden ${showExplanation ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-4 rounded-lg shadow-inner bg-slate-50 border border-slate-200">
            {isConcerning && (
              <div className="flex items-center text-red-700 font-semibold mb-2">
                <ConcernIcon />
                <span>Concerning Clause</span>
                {mode === 'opaque' && <span className="ml-2 font-normal text-slate-500">(No explanation available)</span>}
              </div>
            )}
            {isPositive && (
              <div className="flex items-center text-green-700 font-semibold mb-2">
                <PositiveIcon />
                <span>Positive Clause</span>
                {mode === 'opaque' && <span className="ml-2 font-normal text-slate-500">(No explanation available)</span>}
              </div>
            )}
            {analysis.type === 'neutral' && (
              <div className="flex items-center text-slate-700 font-semibold mb-2">
                <span>Neutral Clause</span>
                {mode === 'opaque' && <span className="ml-2 font-normal text-slate-500">(No explanation available)</span>}
              </div>
            )}

            {mode === 'transparent' && (
              <p className="text-slate-600">{analysis.explanation}</p>
            )}
        </div>
      </div>
    </div>
  );
};


const PolicyView: React.FC<PolicyViewProps> = ({ mode, onComplete }) => {
  const [analysisVisible, setAnalysisVisible] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const analysisMap = new Map(POLICY_ANALYSIS.map(a => [a.id, a]));

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisVisible(true);
    }, 1500); // Simulate AI thinking time
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-white shadow-lg rounded-lg animate-fade-in">
        <style>{`
            @keyframes highlight-red { from { background-color: transparent; } to { background-color: #fee2e2; } }
            @keyframes highlight-green { from { background-color: transparent; } to { background-color: #dcfce7; } }
            @keyframes highlight-slate { from { background-color: transparent; } to { background-color: #f1f5f9; } }
            .animate-highlight-red { animation: highlight-red 1s ease-in-out; }
            .animate-highlight-green { animation: highlight-green 1s ease-in-out; }
            .animate-highlight-slate { animation: highlight-slate 1s ease-in-out; }
        `}</style>
      <div className="mb-6 p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-lg">
        <h1 className="text-2xl font-bold text-slate-800">
          Privacy Policy Review
          {analysisVisible && (
            <span className="capitalize text-indigo-600">: {mode} AI Analysis</span>
          )}
        </h1>
        <p className="text-slate-600 mt-1">
          {!analysisVisible
            ? 'Please read through the policy. When you are ready, click the button below to have the AI analyze it for you.'
            : (mode === 'transparent' 
              ? 'Analysis complete. Click on the highlighted clauses to see the AI\'s reasoning.' 
              : 'Analysis complete. The AI has flagged clauses but will not provide explanations. Click to see the flag.')
          }
        </p>
      </div>

      {mode === 'transparent' && analysisVisible && (
        <div role="alert" className="p-4 mb-6 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg text-blue-900 animate-fade-in">
          <h3 className="font-semibold flex items-center"><InfoIcon /> AI Bias Disclosure</h3>
          <p className="mt-2 text-sm text-blue-800">{AI_BIAS_DISCLOSURE}</p>
        </div>
      )}

      <div className="prose prose-slate max-w-none">
        {POLICY_CONTENT.map((part, index) => {
          switch (part.type) {
            case 'heading':
              return <h2 key={index} className="text-xl font-semibold mt-6 mb-2">{part.content}</h2>;
            case 'clause':
              if (analysisVisible) {
                return <Clause key={index} part={part} analysis={analysisMap.get(part.id!)} mode={mode} />;
              }
              // Render as plain paragraph before analysis
              return <p key={index} className="mb-4">{part.content}</p>;
            default:
              return <p key={index} className="mb-4">{part.content}</p>;
          }
        })}
      </div>
      
      {analysisVisible && (
        <div role="alert" className="mt-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg text-red-900 animate-fade-in">
          <h3 className="font-semibold flex items-center text-lg"><ConcernIcon /> AI Overall Recommendation</h3>
          <p className="mt-2 text-sm text-red-800">{AI_CONCLUSION.summary}</p>
          <p className="mt-2 text-sm font-bold text-red-800">{AI_CONCLUSION.final_verdict}</p>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-slate-200 text-center">
        {!analysisVisible ? (
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-wait transition-all duration-300 transform hover:scale-105 flex items-center justify-center mx-auto"
            >
              {isAnalyzing && (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isAnalyzing ? 'Analyzing...' : `Analyze with ${mode.charAt(0).toUpperCase() + mode.slice(1)} AI`}
            </button>
        ) : (
            <button
              onClick={onComplete}
              className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105"
            >
              Continue to Survey
            </button>
        )}
      </div>
    </div>
  );
};

export default PolicyView;