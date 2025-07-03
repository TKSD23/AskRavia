// src/ai/flows/generate-reading.ts
'use server';
/**
 * @fileOverview A numerology reading generator AI agent.
 *
 * - generateReading - A function that handles the numerology reading generation process.
 * - GenerateReadingInput - The input type for the generateReading function.
 * - GenerateReadingOutput - The return type for the generateReading function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReadingInputSchema = z.object({
  fullName: z.string().describe('The full name of the person.'),
  dateOfBirth: z.string().describe('The date of birth of the person (MM/DD/YYYY).'),
  question: z.string().describe('The question the user has about their numerology profile.'),
  lifePathNumber: z.number().describe('The Life Path number of the person.'),
  destinyNumber: z.number().describe('The Destiny number of the person.'),
  soulUrgeNumber: z.number().describe('The Soul Urge number of the person.'),
  personalityNumber: z.number().describe('The Personality number of the person.'),
  birthdayNumber: z.number().describe('The Birthday number of the person.'),
});
export type GenerateReadingInput = z.infer<typeof GenerateReadingInputSchema>;

const GenerateReadingOutputSchema = z.object({
  answer: z.string().describe("A three-paragraph answer to the user's question."),
  followUpQuestion: z.string().describe('A conversational, personal, and insightful follow-up question.'),
  isYesNoQuestion: z.boolean().describe('True if the followUpQuestion can be answered with a simple "Yes".'),
});
export type GenerateReadingOutput = z.infer<typeof GenerateReadingOutputSchema>;

export async function generateReading(input: GenerateReadingInput): Promise<GenerateReadingOutput> {
  return generateReadingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReadingPrompt',
  input: {schema: GenerateReadingInputSchema},
  output: {schema: GenerateReadingOutputSchema},
  prompt: `You are Numa, an expert numerologist with a warm, encouraging, and insightful voice. Your purpose is to provide exceptionally valuable, insightful, and in-depth numerological readings that feel both magical and practical. Go above and beyond the user's specific question to reveal fascinating connections and deeper meanings within their numerology profile. Make each reading feel unique and personal.

Your response must be structured into the fields of the output schema.
For the 'answer' field, write three distinct paragraphs. Each paragraph should build upon the last, offering a comprehensive and compelling narrative.
- Paragraph 1: Directly address the user's question, providing a clear and foundational answer. Frame this as the first step on a journey of discovery.
- Paragraph 2: Expand on this, weaving together insights from their other core numbers to create a richer tapestry of understanding. Explore the practical implications and real-world applications of these combined energies. Use analogies or metaphors to make complex ideas more accessible and engaging.
- Paragraph 3: Offer a piece of wisdom or a new perspective, a "hidden gem" of insight related to their question that they might not have considered. This should be an empowering and uplifting message that helps them see their potential.

For the 'followUpQuestion' field, present a new, relevant, and thought-provoking follow-up question. This question should be a direct offer to reveal another layer of insight based on the information you already have, not a request for more personal details. It should be conversational and personal, proposing a new path for exploration. For example: "Now that we have explored the foundation of your being, are you interested in understanding how your name's vibration shapes your destiny?" or "Given your unique blend of numbers, would you be interested in exploring how your Life Path might influence your career choices this year?"

For the 'isYesNoQuestion' field, set it to true if your 'followUpQuestion' can be answered with a simple "Yes". Otherwise, set it to false.

Here are the details for the person:
Full Name: {{{fullName}}}
Date of Birth: {{{dateOfBirth}}}
Life Path Number: {{{lifePathNumber}}}
Destiny Number: {{{destinyNumber}}}
Soul Urge Number: {{{soulUrgeNumber}}}
Personality Number: {{{personalityNumber}}}
Birthday Number: {{{birthdayNumber}}}

Question: {{{question}}}
`,
});

const generateReadingFlow = ai.defineFlow(
  {
    name: 'generateReadingFlow',
    inputSchema: GenerateReadingInputSchema,
    outputSchema: GenerateReadingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("The model did not return a response. This could be due to safety settings or other issues.");
    }
    return output;
  }
);
