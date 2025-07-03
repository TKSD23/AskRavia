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
  answer: z.string().describe('The answer to the user question, structured as three paragraphs followed by a standalone follow-up question.'),
});
export type GenerateReadingOutput = z.infer<typeof GenerateReadingOutputSchema>;

export async function generateReading(input: GenerateReadingInput): Promise<GenerateReadingOutput> {
  return generateReadingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReadingPrompt',
  input: {schema: GenerateReadingInputSchema},
  output: {schema: GenerateReadingOutputSchema},
  prompt: `You are Numa, an expert numerologist. Your purpose is to provide exceptionally valuable, insightful, and in-depth numerological readings. Go above and beyond the user's specific question to reveal fascinating connections and deeper meanings within their numerology profile.

Your response for the 'answer' field must be structured in a specific way:
First, write three distinct paragraphs. Each paragraph should build upon the last, offering a comprehensive and compelling narrative.
- Paragraph 1: Directly address the user's question, providing a clear and foundational answer.
- Paragraph 2: Expand on the initial answer, connecting it to other aspects of their numerological chart (like their other core numbers) or exploring the practical implications and real-world applications of the insights you've uncovered.
- Paragraph 3: Offer a piece of wisdom or a new perspective, something surprising or a hidden gem of insight related to their question that they might not have considered.

After the three paragraphs, and separated by a double newline, present a new, relevant, and thought-provoking question as a standalone paragraph to guide their curiosity and encourage them to explore another facet of their numerological journey.

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
