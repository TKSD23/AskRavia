import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.warn(
    "GOOGLE_API_KEY environment variable not set. Please create a .env.local file and add your key. You can get a key from https://aistudio.google.com/app/apikey"
  );
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: apiKey || '',
    }),
  ],
  model: 'googleai/gemini-2.0-flash',
});
