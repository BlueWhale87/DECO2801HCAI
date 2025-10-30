
import React, { useState, useEffect, useCallback } from 'react';
import { Phase, ConditionType, SurveyAnswers, FinalAnswers, StudyResults } from './types';
import { LIKERT_QUESTIONS } from './constants';
import Introduction from './components/Introduction';
import PolicyView from './components/PolicyView';
import Survey from './components/Survey';
import Comparison from './components/Comparison';
import Results from './components/Results';

const App: React.FC = () => {
  const [phase, setPhase] = useState<Phase>(Phase.INTRODUCTION);
  const [conditionOrder, setConditionOrder] = useState<ConditionType[]>([]);
  const [currentConditionIndex, setCurrentConditionIndex] = useState(0);
  const [studyResults, setStudyResults] = useState<StudyResults>({
    participantId: '',
    conditionOrder: [],
    transparentScores: null,
    opaqueScores: null,
    finalPreference: null,
    timestamps: {},
  });

  useEffect(() => {
    const participantId = crypto.randomUUID();
    const order: ConditionType[] = Math.random() < 0.5 ? ['transparent', 'opaque'] : ['opaque', 'transparent'];
    setConditionOrder(order);
    setStudyResults(prev => ({ 
      ...prev, 
      participantId, 
      conditionOrder: order,
      timestamps: { ...prev.timestamps, start: new Date().toISOString() }
    }));
  }, []);
  
  const recordTimestamp = useCallback((eventName: string) => {
    setStudyResults(prev => ({
      ...prev,
      timestamps: { ...prev.timestamps, [eventName]: new Date().toISOString() }
    }));
  }, []);

  const handleIntroComplete = () => {
    recordTimestamp('intro_complete');
    setPhase(Phase.CONDITION);
  };
  
  const handleConditionComplete = () => {
    const condition = conditionOrder[currentConditionIndex];
    recordTimestamp(`${condition}_view_complete`);
    setPhase(Phase.SURVEY);
  };

  const handleSurveyComplete = (answers: SurveyAnswers) => {
    const condition = conditionOrder[currentConditionIndex];
    recordTimestamp(`${condition}_survey_complete`);
    
    setStudyResults(prev => ({
      ...prev,
      [`${condition}Scores`]: answers,
    }));
    
    if (currentConditionIndex < 1) {
      setCurrentConditionIndex(1);
      setPhase(Phase.CONDITION);
    } else {
      setPhase(Phase.COMPARISON);
    }
  };

  const handleComparisonComplete = (answers: FinalAnswers) => {
    recordTimestamp('comparison_complete');
    setStudyResults(prev => ({
      ...prev,
      finalPreference: answers,
    }));
    setPhase(Phase.RESULTS);
  };

  const renderContent = () => {
    const currentCondition = conditionOrder[currentConditionIndex];

    switch (phase) {
      case Phase.INTRODUCTION:
        return <Introduction onComplete={handleIntroComplete} />;
      case Phase.CONDITION:
        return <PolicyView mode={currentCondition} onComplete={handleConditionComplete} />;
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
