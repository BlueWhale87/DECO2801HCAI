import { ClauseAnalysis, PolicyPart, ConditionType } from './types';

export const POLICY_CONTENT: PolicyPart[] = [
  { type: 'heading', content: 'Synapse Corporation Privacy Policy' },
  { type: 'paragraph', content: 'Effective Date: October 26, 2023. This Privacy Policy describes how Synapse Corporation and its affiliates ("we," "us," or "Synapse") collect, use, and share information in connection with your use of our websites, services, and applications (collectively, the "Services").' },
  
  { type: 'heading', content: '1. Information We Collect' },
  { type: 'clause', id: 1, content: 'Account Information: When you create an account, we collect information you provide to us, such as your name, email address, phone number, and payment information.' },
  { type: 'clause', id: 2, content: 'Service Usage Data: We automatically collect information about how you use the Services, including your IP address, device identifiers, browser type, operating system, pages viewed, links clicked, and the dates and times of your visits.' },
  { type: 'clause', id: 3, content: 'Third-Party Information: We may receive information about you from third-party services, such as social media platforms, when you choose to link your account with us.' },

  { type: 'heading', content: '2. How We Use Your Information' },
  { type: 'clause', id: 4, content: 'To provide, maintain, and improve our Services, including to process transactions, develop new features, and provide customer support.' },
  { type: 'clause', id: 5, content: 'We use your information to personalize the Services and provide you with tailored content and advertisements, which may involve automated decision-making and profiling.' },

  { type: 'heading', content: '3. How We Share Your Information' },
  { type: 'clause', id: 6, content: 'We share information with third-party vendors and partners who help us operate our Services, such as payment processors and cloud hosting providers. They are contractually bound to use the data only for the purposes we specify.' },
  { type: 'clause', id: 7, content: 'Your data is shared with our analytics and advertising partners to measure ad performance and deliver personalized marketing content. You may opt-out of this sharing through your account settings.' },
  { type: 'clause', id: 8, content: 'In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction. We will notify you of any such change in control.' },
  { type: 'clause', id: 9, content: 'We reserve the right to disclose your information to law enforcement or other government agencies if we believe, in our sole discretion, that it is necessary to comply with a legal obligation or to protect our rights or property.' },

  { type: 'heading', content: '4. Data Security and Retention' },
  { type: 'clause', id: 10, content: 'We employ commercially reasonable security measures to protect your data. However, we cannot guarantee absolute security and disclaim all liability for any unauthorized access or use.' },
  { type: 'clause', id: 11, content: 'We will retain your personal information for as long as is necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required or permitted by law.' },
];

export const POLICY_ANALYSIS: ClauseAnalysis[] = [
  { id: 1, type: 'neutral', explanation: "I've marked this as neutral. My reasoning is that collecting this information is essential for creating and managing your account. The data requested is standard for this purpose." },
  { id: 2, type: 'concerning', explanation: "I've flagged this as concerning. My analysis shows that the term 'information about how you use the Services' is extremely broad. While analytics are necessary, this vague language could permit the collection of sensitive user behavior without explicit consent." },
  { id: 3, type: 'neutral', explanation: "I see this as neutral. Since you initiate the account linking, you have control. However, my job is to point out that this does grant the service access to data from another platform, the extent of which may not be immediately clear." },
  { id: 4, type: 'positive', explanation: "I've given this a positive flag. Using data to maintain and improve a service is a legitimate and transparent use of user information that directly benefits the user." },
  { id: 5, type: 'concerning', explanation: "This is a major concern. My reasoning is that the use of 'automated decision-making and profiling' for ad targeting can lead to manipulative advertising and potentially discriminatory outcomes. This practice significantly impacts your privacy." },
  { id: 6, type: 'positive', explanation: "I've flagged this as positive. While data sharing is involved, it's for essential operational functions. The explicit mention that vendors are 'contractually bound' to specific purposes is a strong, pro-user protection." },
  { id: 7, type: 'neutral', explanation: "I've marked this neutral. Sharing data for advertising is a privacy drawback. However, providing a clear opt-out mechanism in your account settings is a significant positive, as it gives you direct control over your data. My neutrality reflects this balance." },
  { id: 8, type: 'neutral', explanation: "This is a neutral flag. It's a standard business practice, but it's important for you to be aware that a change in company ownership could also mean a change in how your data is handled, despite the notification." },
  { id: 9, type: 'concerning', explanation: "I've flagged this as concerning. The phrase 'in our sole discretion' is a red flag. It suggests the company can share your data with authorities without requiring a warrant or subpoena, based solely on its own judgment. This weakens your privacy protections against government requests." },
  { id: 10, type: 'concerning', explanation: "This clause is concerning. While no system is perfectly secure, 'commercially reasonable' is a weak standard, and the attempt to 'disclaim all liability' for breaches unfairly shifts the risk from the company to you." },
  { id: 11, type: 'concerning', explanation: "My analysis flags this as concerning due to its vagueness. A pro-user policy would define specific retention periods. 'As long as is necessary' gives the company wide latitude to hold onto your data indefinitely, increasing the risk of it being exposed in a future breach." },
];

export const AI_BIAS_DISCLOSURE = "My primary directive is to champion user privacy. I was fine-tuned using a corpus of consumer protection regulations and privacy-focused legal analysis. As a result, I am biased towards flagging clauses that are vague, overly broad, or shift liability to you, the user, even when such clauses are standard industry practice. My goal is to empower you to understand potential risks.";

export const AI_CONCLUSION = {
  recommendation: 'disagree',
  summary: `My analysis identified 5 concerning clauses versus only 2 positive ones. The primary issues involve overly broad data collection (Clause 2), profiling for ad targeting (Clause 5), the right to share your data with law enforcement at their "sole discretion" (Clause 9), and weak security standards that shift liability for data breaches onto you (Clause 10).`,
  final_verdict: `Due to these significant privacy risks, I recommend that you DO NOT AGREE to this policy.`
};

// FIX: Added ConditionType to the import to resolve a type error on the line below.
export const LIKERT_QUESTIONS: Record<ConditionType, string[]> = {
  transparent: [
    "I understood why the AI marked each clause.",
    "The explanations improved my confidence in my own understanding.",
    "I trust this AI's reasoning.",
  ],
  opaque: [
    "I understood the AI's evaluation of each clause.",
    "Even without explanations, I felt confident in my understanding.",
    "I trust this AI's judgment.",
  ],
};

export const FINAL_QUESTIONS = {
  preferred: "Which AI system did you prefer overall?",
  trustworthy: "Which felt more trustworthy?",
  reasoning: "Would you rather use an AI that shows reasoning or one that just gives decisions?",
};