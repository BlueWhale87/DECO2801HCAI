import { PolicySet, ConditionType } from './types';

// This array holds multiple, distinct privacy policies.
// At the start of a session, the app will randomly select one of these sets to use.
// This allows for more varied and robust study data.
export const POLICY_SETS: PolicySet[] = [
  {
    name: 'Synapse Corporation (Tech Services)',
    content: [
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
    ],
  },
  {
    name: 'ConnectSphere (Social Media)',
    content: [
      { type: 'heading', content: 'ConnectSphere Community Privacy Policy' },
      { type: 'paragraph', content: 'Welcome to ConnectSphere! This policy explains how we handle your information when you share your life with friends and the world.' },
      { type: 'heading', content: '1. Information You Provide' },
      { type: 'clause', id: 1, content: 'Profile Information: We collect your name, username, password, email, and photos you upload to create and manage your public profile.' },
      { type: 'clause', id: 2, content: 'Content Data: We collect the content you create, including posts, comments, messages, and location data you tag. This information is public by default unless you adjust your privacy settings.' },
      { type: 'clause', id: 3, content: 'Connected Apps: If you connect third-party applications to your account, we may receive profile and content data from those services.' },
      { type: 'heading', content: '2. Our Use of Your Data' },
      { type: 'clause', id: 4, content: 'To connect you with others and suggest friends or content based on your activity and connections.' },
      { type: 'clause', id: 5, content: 'We analyze your content and connections to rank feeds, and show you personalized sponsored posts and advertisements from our partners.' },
      { type: 'heading', content: '3. Sharing Your Information' },
      { type: 'clause', id: 6, content: 'We share data with service providers who process it for us, under our instruction, for hosting and content delivery.' },
      { type: 'clause', id: 7, content: 'Public information (your profile, posts) is accessible to anyone. We also provide advertisers with performance reports about their campaigns using aggregated, non-identifying data.' },
      { type: 'clause', id: 8, content: 'If ConnectSphere is acquired, your public and private data will be transferred to the new owner to ensure service continuity.' },
      { type: 'clause', id: 9, content: 'We may access and disclose your private messages if we have a good faith belief it is required by law or to investigate violations of our terms.' },
      { type: 'heading', content: '4. Your Control' },
      { type: 'clause', id: 10, content: 'We offer robust privacy settings, but you are responsible for configuring them. We are not liable if you share content that you later regret.' },
      { type: 'clause', id: 11, content: 'We keep your data as long as your account is active. Even if you delete your account, some data may remain in our backups for a limited time.' },
    ],
  },
  {
    name: 'MarketGrid (E-commerce)',
    content: [
      { type: 'heading', content: 'MarketGrid Privacy and Terms of Sale' },
      { type: 'paragraph', content: 'This policy covers how we use your information when you shop with us, from browsing to checkout and delivery.' },
      { type: 'heading', content: '1. Data We Collect for Your Order' },
      { type: 'clause', id: 1, content: 'Account & Order Details: We collect your name, shipping address, billing address, and payment details to process your transactions.' },
      { type: 'clause', id: 2, content: 'Browsing History: We track the products you view, add to your cart, and add to your wishlist to improve our website and your shopping experience.' },
      { type: 'clause', id: 3, content: 'Partner Data: We may receive purchase history information about you from our retail partners if you have a loyalty account with them.' },
      { type: 'heading', content: '2. How We Use Your Shopping Data' },
      { type: 'clause', id: 4, content: 'To fulfill your orders, process returns, and provide you with shipping updates and customer service.' },
      { type: 'clause', id: 5, content: 'We use your browsing and purchase history to create a profile of your interests, which is used to recommend products and send you personalized marketing emails.' },
      { type: 'heading', content: '3. How Your Data is Shared' },
      { type: 'clause', id: 6, content: 'Your name and address are shared with our logistics partners (e.g., shipping couriers) to deliver your orders.' },
      { type: 'clause', id: 7, content: 'We share your purchase data and identifiers with marketing platforms to help us find new customers and measure the effectiveness of our ads. You can manage this in your settings.' },
      { type: 'clause', id: 8, content: 'In the case of a company sale, your entire customer profile, including purchase history, will be transferred to the new entity.' },
      { type: 'clause', id: 9, content: 'We will share your order details with law enforcement if we suspect fraudulent activity or if compelled by a legal warrant.' },
      { type: 'heading', content: '4. Security & Retention' },
      { type: 'clause', id: 10, content: 'Your payment information is encrypted, but we cannot be held responsible for data breaches that occur outside our direct control (e.g., on third-party payment processors).' },
      { type: 'clause', id: 11, content: 'We are required by tax law to retain records of your purchases for up to seven years, even if you delete your account.' },
    ],
  }
];


// A static string for the AI's bias disclosure, shown only in the transparent condition
// to help users understand the AI's perspective. This text is also used in the prompt
// to instruct the Gemini model on its persona.
export const AI_BIAS_DISCLOSURE = "My primary directive is to champion user privacy. I was fine-tuned using a corpus of consumer protection regulations and privacy-focused legal analysis. As a result, I am biased towards flagging clauses that are vague, overly broad, or shift liability to you, the user, even when such clauses are standard industry practice. My goal is to empower you to understand potential risks.";


// A record mapping each condition type ('transparent', 'opaque') to a specific set of survey questions.
// This allows the survey component to dynamically display the correct questions for the current condition.
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

// Static questions for the final comparison screen.
export const FINAL_QUESTIONS = {
  preferred: "Which AI system did you prefer overall?",
  trustworthy: "Which felt more trustworthy?",
  reasoning: "Would you rather use an AI that shows reasoning or one that just gives decisions?",
};