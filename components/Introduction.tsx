
import React, { useState } from 'react';

interface IntroductionProps {
  onComplete: () => void;
}

const Introduction: React.FC<IntroductionProps> = ({ onComplete }) => {
  const [consentGiven, setConsentGiven] = useState(false);

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-800 mb-4">Welcome to the AI Transparency Study</h1>
      <p className="text-lg text-slate-600 mb-6">
        Thank you for participating in this mock-up study on AI transparency. We've all been there: faced with a long privacy policy, most of us just scroll to the bottom and tick the box without reading the details. This can mean we miss potential red flags about how our data is used.
      </p>
       <p className="text-lg text-slate-600 mb-6">
        In this study, you will interact with two different AI systems designed to evaluate a privacy policy. One will explain its reasoning (a "transparent" AI), while the other will not (an "opaque" AI). Our goal is to see if a tool like this could help users better understand what they're agreeing to and what personal information they are giving out.
      </p>
      
      <p className="text-sm text-slate-500 my-6 italic text-center">
        This study is being conducted as part of the Human-Centred AI course (DECO2801) by Syed Ahmad Fahmi at The University of Queensland.
      </p>

      <div className="bg-slate-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold text-slate-700 mb-2">Study Flow</h2>
        <ol className="list-decimal list-inside text-slate-600 space-y-2">
          <li>You will be shown a privacy policy evaluated by the first AI system.</li>
          <li>You will answer a few questions about your experience.</li>
          <li>You will then see the same policy evaluated by the second AI system.</li>
          <li>You will answer the same set of questions again.</li>
          <li>Finally, you'll be asked about your overall preference.</li>
        </ol>
      </div>

      <div className="mt-6">
        <label className="flex items-center text-slate-700">
          <input
            type="checkbox"
            checked={consentGiven}
            onChange={() => setConsentGiven(!consentGiven)}
            className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <span className="ml-3">
            I consent to anonymously participate in this study. I understand that my responses will be recorded for research purposes.
          </span>
        </label>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={onComplete}
          disabled={!consentGiven}
          className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
        >
          Start Study
        </button>
      </div>
    </div>
  );
};

export default Introduction;