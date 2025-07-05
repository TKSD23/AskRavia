import { googleAI } from '@genkit-ai/googleai';

// This is the single, authoritative instance of your AI model.
// We are now explicitly passing the API key from the environment variables
// to ensure the connection works in the deployed environment.
export const model = googleAI('gemini-1.5-flash-latest', {
    apiKey: process.env.GOOGLE_API_KEY,
});
