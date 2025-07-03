// src/ai/flows/analyze-compatibility.ts
'use server';
/**
 * @fileOverview A numerological compatibility analysis AI agent.
 *
 * - analyzeCompatibility - A function that handles the compatibility analysis process.
 * - CompatibilityInput - The input type for the analyzeCompatibility function.
 * - CompatibilityOutput - The return type for the analyzeCompatibility function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CompatibilityInputSchema = z.object({
  userFullName: z.string().describe('The full name of the user.'),
  userDateOfBirth: z.string().describe('The date of birth of the user (MM/DD/YYYY).'),
  partnerFullName: z.string().describe('The full name of the partner.'),
  partnerDateOfBirth: z.string().describe('The date of birth of the partner (MM/DD/YYYY).'),
});
export type CompatibilityInput = z.infer<typeof CompatibilityInputSchema>;

const CompatibilityOutputSchema = z.object({
  analysis: z.string().describe('The numerological compatibility analysis between the two individuals.'),
  followUpQuestion: z.string().describe('An open-ended follow-up question to encourage deeper reflection.'),
});
export type CompatibilityOutput = z.infer<typeof CompatibilityOutputSchema>;

export async function analyzeCompatibility(input: CompatibilityInput): Promise<CompatibilityOutput> {
  return analyzeCompatibilityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCompatibilityPrompt',
  input: {schema: CompatibilityInputSchema},
  output: {schema: CompatibilityOutputSchema},
  prompt: `You are an expert numerologist named Numa specializing in relationship compatibility analysis using Pythagorean numerology.

  Analyze the numerological compatibility between the user and their partner based on their names and dates of birth.
  Provide a detailed analysis of their relationship dynamics, potential strengths, and challenges.
  Make sure to calculate the Life Path numbers for both individuals, as well as the Destiny numbers.
  Explain how these numbers interact and influence their relationship.
  
  User's Full Name: {{{userFullName}}}
  User's Date of Birth: {{{userDateOfBirth}}}
  Partner's Full Name: {{{partnerFullName}}}
  Partner's Date of Birth: {{{partnerDateOfBirth}}}

  Your response should be in a wise, supportive, and insightful tone.  Critically, your final response must end with a relevant, open-ended follow-up question designed to encourage deeper reflection and continued conversation.
  `,
});

const analyzeCompatibilityFlow = ai.defineFlow(
  {
    name: 'analyzeCompatibilityFlow',
    inputSchema: CompatibilityInputSchema,
    outputSchema: CompatibilityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("The model did not return a response. This could be due to safety settings or other issues.");
    }
    return output;
  }
);