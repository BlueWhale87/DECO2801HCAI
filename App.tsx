import React, { useState, useEffect, useCallback } from 'react';
import { Phase, ConditionType, SurveyAnswers, FinalAnswers, StudyResults, PolicyPart } from './types';
import { LIKERT_QUESTIONS, POLICY_SETS } from './constants';
import Introduction from './components/Introduction';
import PolicyView from './components/PolicyView';
import Survey from './components/Survey';
import Comparison from './components/Comparison';
import Results from './components/Results';

/**
 * This is the root component of the application.
 * It acts as a state machine, managing the overall flow of the user study
 * from introduction to completion.
 */
const App: React.FC = () => {
  // State to track the current phase of the study (e.g., INTRODUCTION, SURVEY).
  // This determines which component is rendered.
  const [phase, setPhase] = useState<Phase>(Phase.INTRODUCTION);

  // State to hold the randomized order of conditions ('transparent' vs. 'opaque').
  const [conditionOrder, setConditionOrder] = useState<ConditionType[]>([]);
  
  // State to track which condition the user is currently on (0 or 1).
  const [currentConditionIndex, setCurrentConditionIndex] = useState(0);

  // State to hold the randomly selected privacy policy for this session.
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyPart[] | null>(null);

  // A single state object to hold all the collected data for the study.
  // This makes it easy to manage and eventually export the results.
  const [studyResults, setStudyResults] = useState<StudyResults>({
    participantId: '',
    policyName: '',
    conditionOrder: [],
    transparentScores: null,
    opaqueScores: null,
    finalPreference: null,
    timestamps: {},
  });

  // `useEffect` runs once when the component mounts (due to the empty dependency array []).
  // This is the ideal place for setup logic.
  useEffect(() => {
    // Generate a unique ID for this participant's session.
    const participantId = crypto.randomUUID();
    // Randomly determine the order of conditions to counterbalance learning effects.
    const order: ConditionType[] = Math.random() < 0.5 ? ['transparent', 'opaque'] : ['opaque', 'transparent'];
    
    // Randomly select one policy from the available sets for the entire session.
    const policyIndex = Math.floor(Math.random() * POLICY_SETS.length);
    const policy = POLICY_SETS[policyIndex];
    setSelectedPolicy(policy.content);
    setConditionOrder(order);
    
    // Initialize the results state with the generated ID, order, policy name, and start time.
    setStudyResults(prev => ({ 
      ...prev, 
      participantId, 
      conditionOrder: order,
      policyName: policy.name,
      timestamps: { ...prev.timestamps, start: new Date().toISOString() }
    }));
  }, []); // Empty dependency array means this effect runs only once on mount.
  
  // `useCallback` memoizes this function so it doesn't get recreated on every render.
  // This is a performance optimization, particularly if passed to child components.
  const recordTimestamp = useCallback((eventName: string) => {
    setStudyResults(prev => ({
      ...prev,
      timestamps: { ...prev.timestamps, [eventName]: new Date().toISOString() }
    }));
  }, []);

  // --- Event Handlers ---
  // These functions are passed as props to child components (e.g., `onComplete`).
  // They are responsible for updating the phase and recording data.

  const handleIntroComplete = () => {
    recordTimestamp('intro_complete');
    setPhase(Phase.CONDITION); // Move to the first condition.
  };
  
  const handleConditionComplete = () => {
    const condition = conditionOrder[currentConditionIndex];
    recordTimestamp(`${condition}_view_complete`);
    setPhase(Phase.SURVEY); // Move to the survey for the current condition.
  };

  const handleSurveyComplete = (answers: SurveyAnswers) => {
    const condition = conditionOrder[currentConditionIndex];
    recordTimestamp(`${condition}_survey_complete`);
    
    // Store the survey answers in the appropriate field in the results state.
    setStudyResults(prev => ({
      ...prev,
      [`${condition}Scores`]: answers,
    }));
    
    // Logic to move to the next part of the study.
    if (currentConditionIndex < 1) {
      // If it was the first condition, move to the second one.
      setCurrentConditionIndex(1);
      setPhase(Phase.CONDITION);
    } else {
      // If both conditions are complete, move to the final comparison.
      setPhase(Phase.COMPARISON);
    }
  };

  const handleComparisonComplete = (answers: FinalAnswers) => {
    recordTimestamp('comparison_complete');
    setStudyResults(prev => ({
      ...prev,
      finalPreference: answers,
    }));
    setPhase(Phase.RESULTS); // Study is complete, show the results.
  };

  // --- Conditional Rendering ---
  // This function determines which component to display based on the current `phase`.
  const renderContent = () => {
    const currentCondition = conditionOrder[currentConditionIndex];

    switch (phase) {
      case Phase.INTRODUCTION:
        return <Introduction onComplete={handleIntroComplete} />;
      case Phase.CONDITION:
        if (!selectedPolicy) return <div>Loading study...</div>;
        return <PolicyView mode={currentCondition} policyContent={selectedPolicy} onComplete={handleConditionComplete} />;
      case Phase.SURVEY:
        return (
          <Survey
            title={`${currentCondition.charAt(0).toUpperCase() + currentCondition.slice(1)} AI Survey`}
            questions={LIKERT_QUESTIONS[currentCondition]}
            onComplete={handleSurveyComplete}
          />
        );
      case Phase.COMPARISON:
        return <Comparison onComplete={handleComparisonComplete} />;
      case Phase.RESULTS:
        return <Results results={studyResults} />;
      default:
        return <div>Loading...</div>;
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Simple fade-in animation for smoother transitions between phases */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.7s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {renderContent()}
    </div>
  );
};

export default App;