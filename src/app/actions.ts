'use server';

import { getCompatibility as analyzeCompatibilityFlow } from '@/ai/flows/analyze-compatibility';
import { generateReadingFlow } from '@/ai/flows/generate-reading';
import { runFlow } from '@genkit-ai/flow';
import { z } from 'zod';

// Define Zod schemas for input validation to ensure type safety
const ReadingInputSchema = z.object({
  fullName: z.string(),
  dateOfBirth: z.string(),
  question: z.string(),
  lifePathNumber: z.number().optional(),
  destinyNumber: z.number().optional(),
  soulUrgeNumber: z.number().optional(),
});

const CompatibilityInputSchema = z.object({
  userFullName: z.string(),
  userDateOfBirth: z.string(),
  partnerFullName: z.string(),
  partnerDateOfBirth: z.string(),
});

export async function getReading(input: z.infer<typeof ReadingInputSchema>) {
  const validatedInput = ReadingInputSchema.parse(input);
  try {
    const result = await runFlow(generateReadingFlow, validatedInput);
    return result;
  } catch (error) {
    console.error("Error in getReading action:", error);
    throw new Error("Failed to generate reading.");
  }
}

export async function getCompatibility(input: z.infer<typeof CompatibilityInputSchema>) {
  const validatedInput = CompatibilityInputSchema.parse(input);
  try {
    const result = await runFlow(analyzeCompatibilityFlow, validatedInput);
    return result; 
  } catch (error) {
    console.error("Error in getCompatibility action:", error);
    throw new Error("Failed to generate compatibility analysis.");
  }
}
