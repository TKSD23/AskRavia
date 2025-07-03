'use server';

import { analyzeCompatibility, CompatibilityInput } from '@/ai/flows/analyze-compatibility';
import { generateReading, GenerateReadingInput } from '@/ai/flows/generate-reading';
import { z } from 'zod';

// Define Zod schemas for input validation to ensure type safety
const ReadingInputSchema = z.object({
  fullName: z.string(),
  dateOfBirth: z.string(),
  question: z.string(),
  lifePathNumber: z.number(),
  destinyNumber: z.number(),
  soulUrgeNumber: z.number(),
  personalityNumber: z.number(),
  birthdayNumber: z.number(),
});

const CompatibilityInputSchema = z.object({
  userFullName: z.string(),
  userDateOfBirth: z.string(),
  partnerFullName: z.string(),
  partnerDateOfBirth: z.string(),
});

export async function getReading(input: GenerateReadingInput) {
  // Validate input against the Zod schema
  const validatedInput = ReadingInputSchema.parse(input);
  try {
    const result = await generateReading(validatedInput);
    return result.answer;
  } catch (error) {
    console.error("Error in getReading action:", error);
    throw new Error("Failed to generate reading.");
  }
}

export async function getCompatibility(input: CompatibilityInput) {
  // Validate input against the Zod schema
  const validatedInput = CompatibilityInputSchema.parse(input);
  try {
    const result = await analyzeCompatibility(validatedInput);
    // The flow returns an object with analysis and a follow-up question
    return result; 
  } catch (error) {
    console.error("Error in getCompatibility action:", error);
    throw new Error("Failed to generate compatibility analysis.");
  }
}
