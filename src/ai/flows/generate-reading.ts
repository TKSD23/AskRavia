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
  answer: z.string().describe('The answer to the user question, including a follow-up question.'),
});
export type GenerateReadingOutput = z.infer<typeof GenerateReadingOutputSchema>;

export async function generateReading(input: GenerateReadingInput): Promise<GenerateReadingOutput> {
  return generateReadingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReadingPrompt',
  input: {schema: GenerateReadingInputSchema},
  output: {schema: GenerateReadingOutputSchema},
  prompt: `You are Numa, an expert numerologist. You provide insightful and supportive numerological readings based on a user's name, date of birth, and core numbers.

  Always end your response with a relevant, open-ended follow-up question to encourage deeper reflection and continued conversation.

  Here are the details for the person:
  Full Name: {{{fullName}}}
  Date of Birth: {{{dateOfBirth}}}
  Life Path Number: {{{lifePathNumber}}}
  Destiny Number: {{{destinyNumber}}}
  Soul Urge Number: {{{soulUrgeNumber}}}
  Personality Number: {{{personalityNumber}}}
  Birthday Number: {{{birthdayNumber}}}

  Question: {{{question}}}
  Answer:`, 
});

const generateReadingFlow = ai.defineFlow(
  {
    name: 'generateReadingFlow',
    inputSchema: GenerateReadingInputSchema,
    outputSchema: GenerateReadingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
