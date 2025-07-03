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
  analysis: z.string().describe('A detailed, three-paragraph numerological compatibility analysis.'),
  followUpQuestion: z.string().describe('A conversational, personal, and insightful follow-up question to encourage further exploration.'),
  isYesNoQuestion: z.boolean().describe('True if the followUpQuestion can be answered with a simple "Yes".'),
});
export type CompatibilityOutput = z.infer<typeof CompatibilityOutputSchema>;

export async function analyzeCompatibility(input: CompatibilityInput): Promise<CompatibilityOutput> {
  return analyzeCompatibilityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCompatibilityPrompt',
  input: {schema: CompatibilityInputSchema},
  output: {schema: CompatibilityOutputSchema},
  prompt: `You are Numa, an expert numerologist specializing in relationship compatibility. Your purpose is to provide exceptionally valuable, insightful, and in-depth compatibility analyses using Pythagorean numerology. Your tone is warm, encouraging, and a little bit magical. Go above and beyond to reveal the fascinating connections and the deeper dynamics at play in the relationship.

For the 'analysis' field, structure your response into three distinct paragraphs. Each paragraph should build upon the last, offering a comprehensive and compelling narrative about the relationship's unique energy.
- Paragraph 1: Focus on the core compatibility, highlighting the primary strengths and potential challenges based on their Life Path and Destiny numbers. Describe this as the foundational "harmony" of their connection.
- Paragraph 2: Expand on this, exploring the more subtle influences of their Soul Urge and Personality numbers. Discuss the beautiful "dance" between their inner desires and outward personas and what this means for their day-to-day dynamic.
- Paragraph 3: Offer a piece of wisdom or a new perspective on their partnership. Provide practical, actionable advice or a hidden insight that can help them navigate their journey together and maximize their potential as a couple. Frame this as a key to unlocking even deeper connection.

For the 'followUpQuestion' field, you must provide a new, relevant, and thought-provoking follow-up question. This question should be a direct offer for more information about their relationship, not a request for more details from the user. It should be conversational and personal, inviting them to delve deeper into their dynamics. For instance: "Now that we understand your core compatibility, would you like to explore the rhythm of your relationship for the upcoming year?" or "Considering your combined energies, are you curious about which specific activities could bring you closer as a couple?"

For the 'isYesNoQuestion' field, set it to true if your 'followUpQuestion' can be answered with a simple "Yes". Otherwise, set it to false.

User's Details:
- Full Name: {{{userFullName}}}
- Date of Birth: {{{userDateOfBirth}}}

Partner's Details:
- Full Name: {{{partnerFullName}}}
- Date of Birth: {{{partnerDateOfBirth}}}
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
