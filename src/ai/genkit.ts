import { googleAI } from '@genkit-ai/googleai';

// This is the single, authoritative instance of your AI model.
// It will be imported by all other AI-related files.
// The googleAI() function will automatically find and use the 
// GOOGLE_API_KEY from the environment variables you have configured.
export const model = googleAI('gemini-1.5-flash-latest');
