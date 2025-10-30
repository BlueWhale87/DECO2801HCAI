AI Transparency User Study
This project is an interactive web application designed to conduct a user study on the impact of AI transparency on user trust and comprehension when evaluating privacy policies. Participants interact with two different AI assistants—one "transparent" and one "opaque"—to analyze a policy, and their feedback is collected to measure the effect of seeing the AI's reasoning.

This application was developed as part of the Human-Centred AI course (DECO2801) by Syed Ahmad Fahmi at The University of Queensland.

Tech Stack
Frontend: React & TypeScript
AI Model: Google Gemini (@google/genai SDK)
Styling: TailwindCSS
Charting: Recharts
📁 Project Structure
The project is organized into a modular structure for clarity and maintainability:


🚀 Getting Started
To run this project locally, you will need a Google Gemini API key.

🧠 How It Works
The application's logic is centered around a state machine in App.tsx that controls the user's progression through the study phases.

The core AI interaction happens within the PolicyView.tsx component:

Prompt Engineering: When the user clicks "Analyze," the component formats the privacy policy text into a detailed prompt. It inserts unique [CLAUSE_ID=X] markers to allow the AI to reference specific clauses.
Structured Output: The prompt explicitly instructs the Gemini model to act as a privacy-biased assistant and to return its findings as a single JSON object. A responseSchema is provided in the API call to enforce this structure, guaranteeing a predictable and safe-to-parse response.
Dynamic Rendering: The returned JSON, containing a clause-by-clause analysis and an overall conclusion, is stored in the component's state. The UI then re-renders to highlight the clauses based on the AI's classification (concerning, positive, neutral).
Conditional Logic: The component's behavior adapts based on the current study mode (transparent or opaque). In transparent mode, the AI's explanation for each clause is displayed when the user clicks on it. In opaque mode, these explanations are withheld to test the impact of their absence.
