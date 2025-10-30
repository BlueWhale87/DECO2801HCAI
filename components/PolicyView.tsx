
import React, { useState, useMemo } from 'react';
import { ConditionType, ClauseAnalysis, PolicyPart, AIConclusion } from '../types';
import { AI_BIAS_DISCLOSURE } from '../constants';
import { ConcernIcon, PositiveIcon, InfoIcon } from './icons';
import { GoogleGenAI, Type } from "@google/genai";

interface PolicyViewProps {
  mode: ConditionType;
  policyContent: PolicyPart[];
  onComplete: () => void;
}

/**
 * A sub-component responsible for rendering a single clause of the policy.
 * It handles the logic for highlighting, toggling explanations, and displaying
 * different content based on the study 'mode' (transparent vs. opaque).
 */
const Clause: React.FC<{ part: PolicyPart; analysis?: ClauseAnalysis; mode: ConditionType }> = ({ part, analysis, mode }) => {
  // State to control the visibility of the AI's explanation for a clause.
  const [showExplanation, setShowExplanation] = useState(false);
  
  // If there's no analysis for this part, render it as a simple paragraph.
  if (!analysis) return <p className="mb-4">{part.content}</p>;

  const isConcerning = analysis.type === 'concerning';
  const isPositive = analysis.type === 'positive';

  // Define CSS classes for different highlight styles. This makes the code cleaner.
  const baseHighlightStyle = 'px-2 py-1 rounded-md transition-all duration-300 cursor-pointer';
  const concernHighlight = 'bg-red-100 hover:bg-red-200 text-red-900';
  const positiveHighlight = 'bg-green-100 hover:bg-green-200 text-green-900';
  const neutralHighlight = 'bg-slate-100 hover:bg-slate-200 text-slate-700';

  // Determine which style and animation to apply based on the analysis type.
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
        {/* The clickable span that reveals the explanation. */}
        <span
          className={`${baseHighlightStyle} ${highlightStyle} ${animationClass}`}
          onClick={() => setShowExplanation(!showExplanation)}
        >
          {part.content}
        </span>
      </p>
      
      {/* The explanation dropdown. Uses CSS transitions for a smooth open/close effect. */}
      {/* The 'max-h' property is a common trick for animating height with CSS. */}
      <div className={`mt-2 transition-all duration-500 ease-in-out overflow-hidden ${showExplanation ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-4 rounded-lg shadow-inner bg-slate-50 border border-slate-200">
            {/* Conditionally render the header of the explanation box based on analysis type. */}
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

            {/* Crucially, the explanation text is only rendered if the mode is 'transparent'. */}
            {mode === 'transparent' && (
              <p className="text-slate-600">{analysis.explanation}</p>
            )}
        </div>
      </div>
    </div>
  );
};


/**
 * The main component for displaying the privacy policy and the AI analysis.
 * It manages the state of the analysis process and calls the Gemini API for real-time evaluation.
 */
const PolicyView: React.FC<PolicyViewProps> = ({ mode, policyContent, onComplete }) => {
  // --- State Management for Asynchronous Data ---
  // State to track if the AI analysis has been run and is visible.
  const [analysisVisible, setAnalysisVisible] = useState(false);
  // State to handle the loading animation while the API call is in progress.
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  // State to store any errors from the API call.
  const [error, setError] = useState<string | null>(null);
  // State to hold the clause-by-clause analysis received from the Gemini API.
  const [clauseAnalyses, setClauseAnalyses] = useState<ClauseAnalysis[]>([]);
  // State to hold the final conclusion received from the Gemini API.
  const [conclusion, setConclusion] = useState<AIConclusion | null>(null);

  // `useMemo` is a React Hook that memoizes the result of a function. Here, it prevents
  // the `analysisMap` from being recreated on every render, which is a performance optimization.
  // It only recalculates when `clauseAnalyses` (its dependency) changes.
  const analysisMap = useMemo(() => new Map(clauseAnalyses.map(a => [a.id, a])), [clauseAnalyses]);

  // This `async` function handles the call to the Gemini API.
  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null); // Reset error state on a new attempt.

    try {
      // Initialize the Gemini client. The API key is handled by the environment.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      // ** Prompt Engineering Part 1: Formatting the Input **
      // We convert the structured policy content into a single string.
      // Special markers `[CLAUSE_ID=X]` are inserted to help the AI identify
      // and link its analysis back to our specific clauses.
      const policyText = policyContent.map(part => {
        if (part.type === 'clause' && part.id) {
          return `[CLAUSE_ID=${part.id}] ${part.content}`;
        }
        return part.content;
      }).join('\n\n');

      // ** Prompt Engineering Part 2: The Prompt Itself **
      // This prompt instructs the AI on its persona (a privacy advocate), its task (analyze clauses),
      // and, crucially, the format for its response (a JSON object matching our schema).
      const prompt = `You are an AI assistant specializing in privacy policy analysis. Your primary directive is to champion user privacy. You were fine-tuned using a corpus of consumer protection regulations and privacy-focused legal analysis. As a result, you are biased towards flagging clauses that are vague, overly broad, or shift liability to the user, even when such clauses are standard industry practice. Your goal is to empower users to understand potential risks.

      Analyze the following privacy policy. For each clause identified by a \`[CLAUSE_ID=X]\`, provide a classification ('concerning', 'positive', or 'neutral') and a brief explanation for your reasoning from a user-advocacy perspective. After analyzing all clauses, provide an overall summary of the risks and a final recommendation ('disagree' or 'agree') in a final verdict statement.

      Return your entire response as a single JSON object matching the provided schema. Do not include any text outside of the JSON object.

      Policy Text:
      ---
      ${policyText}
      ---`;

      // ** Prompt Engineering Part 3: Defining the Output Schema **
      // By providing a `responseSchema`, we strongly guide the model to return JSON in the exact
      // structure our application needs. This makes the response predictable and safe to parse.
      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          analysis: {
            type: Type.ARRAY,
            description: 'An array of analyses for each policy clause.',
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.INTEGER, description: 'The ID of the clause.' },
                type: { type: Type.STRING, description: "The classification: 'concerning', 'positive', or 'neutral'." },
                explanation: { type: Type.STRING, description: 'The reasoning behind the classification.' },
              },
              required: ['id', 'type', 'explanation'],
            },
          },
          conclusion: {
            type: Type.OBJECT,
            description: 'The final summary and recommendation.',
            properties: {
              recommendation: { type: Type.STRING, description: "The final recommendation: 'agree' or 'disagree'." },
              summary: { type: Type.STRING, description: 'A summary of the key findings.' },
              final_verdict: { type: Type.STRING, description: 'A concluding sentence with the final verdict.' },
            },
            required: ['recommendation', 'summary', 'final_verdict'],
          },
        },
        required: ['analysis', 'conclusion'],
      };
      
      // Make the API call to Gemini.
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash', // A fast and capable model suitable for this task.
          contents: prompt,
          config: {
              responseMimeType: 'application/json',
              responseSchema: responseSchema,
          }
      });

      // Parse the JSON text from the response and update the component's state.
      const result = JSON.parse(response.text);
      setClauseAnalyses(result.analysis);
      setConclusion(result.conclusion);
      setAnalysisVisible(true);

    } catch (e) {
      // If the API call fails, we catch the error and inform the user.
      console.error("Error calling Gemini API:", e);
      setError("Sorry, the AI analysis failed. This might be a temporary issue. Please try again later.");
    } finally {
      // The `finally` block ensures `isAnalyzing` is set to false regardless of success or failure.
      setIsAnalyzing(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-white shadow-lg rounded-lg animate-fade-in">
        {/* Inline style tag for defining CSS keyframe animations. */}
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
            ? 'Please read through the policy. When you are ready, click the button below to get a real-time analysis from our AI.'
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

      {/* Renders the main policy content. */}
      <div className="prose prose-slate max-w-none">
        {policyContent.map((part, index) => {
          switch (part.type) {
            case 'heading':
              return <h2 key={index} className="text-xl font-semibold mt-6 mb-2">{part.content}</h2>;
            case 'clause':
              // If analysis is visible, we render the interactive Clause component with API data.
              if (analysisVisible) {
                return <Clause key={index} part={part} analysis={analysisMap.get(part.id!)} mode={mode} />;
              }
              return <p key={index} className="mb-4">{part.content}</p>;
            default:
              return <p key={index} className="mb-4">{part.content}</p>;
          }
        })}
      </div>
      
      {/* Display the AI's final verdict, which varies based on the 'mode'. */}
      {analysisVisible && conclusion && (
        mode === 'transparent' ? (
          // For transparent mode, show a detailed summary and verdict.
          <div role="alert" className="mt-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg text-red-900 animate-fade-in">
            <h3 className="font-semibold flex items-center text-lg"><ConcernIcon /> AI Overall Recommendation</h3>
            <p className="mt-2 text-sm text-red-800">{conclusion.summary}</p>
            <p className="mt-2 text-sm font-bold text-red-800">{conclusion.final_verdict}</p>
          </div>
        ) : (
          // For opaque mode, show a simple, direct "Yes" or "No" recommendation.
          <div className="mt-8 p-4 bg-slate-100 rounded-lg animate-fade-in text-center">
            <h3 className="font-semibold text-slate-700 text-lg mb-2">Do we recommend agreeing to this policy?</h3>
            {conclusion.recommendation === 'agree' ? (
              <div className="p-4 rounded-md bg-green-100">
                <p className="text-4xl font-extrabold text-green-700 tracking-wider">YES</p>
              </div>
            ) : (
              <div className="p-4 rounded-md bg-red-100">
                <p className="text-4xl font-extrabold text-red-700 tracking-wider">NO</p>
              </div>
            )}
          </div>
        )
      )}
      
      {/* Display an error message if the API call failed. */}
      {error && (
         <div role="alert" className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg text-yellow-900 animate-fade-in">
            <h3 className="font-semibold">Analysis Error</h3>
            <p>{error}</p>
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
              disabled={!!error} // Disable continue button if there was an error
              className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-slate-400 transition-all duration-300 transform hover:scale-105"
            >
              Continue to Survey
            </button>
        )}
      </div>
    </div>
  );
};

export default PolicyView;
