
export enum Phase {
  INTRODUCTION,
  CONDITION,
  SURVEY,
  COMPARISON,
  RESULTS,
}

export type ConditionType = 'transparent' | 'opaque';

export interface ClauseAnalysis {
  id: number;
  type: 'concerning' | 'positive' | 'neutral';
  explanation: string;
}

export interface PolicyPart {
  type: 'paragraph' | 'heading' | 'clause';
  content: string;
  id?: number;
}

export type LikertScore = 1 | 2 | 3 | 4 | 5;

export interface SurveyAnswers {
  scores: Record<string, LikertScore>;
  comment: string;
}

export type FinalPreference = 'transparent' | 'opaque' | 'no_preference';

export interface FinalAnswers {
  preferred: FinalPreference;
  trustworthy: FinalPreference;
  reasoning: 'shows_reasoning' | 'just_decisions' | 'no_preference';
}

export interface StudyResults {
  participantId: string;
  conditionOrder: ConditionType[];
  transparentScores: SurveyAnswers | null;
  opaqueScores: SurveyAnswers | null;
  finalPreference: FinalAnswers | null;
  timestamps: Record<string, string>;
}
