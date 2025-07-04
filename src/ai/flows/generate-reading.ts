import {getReadingSchema, getReadingTool} from '@/lib/numerology';
import {generate} from '@genkit-ai/ai';
import {defineFlow, runFlow} from '@genkit-ai/flow';
import {z} from 'zod';
import {getCompatibility} from './analyze-compatibility';
import {googleAI} from '@genkit-ai/googleai';

//
// This flow is used to generate a numerology reading for a user.
//
// It takes the user's name, date of birth, and a question as input.
// It uses the user's numerology profile to generate a prompt for the model.
// The model then generates a reading and a follow-up question.
//

const GenerateReadingInputSchema = z.object({
  fullName: z.string(),
  dateOfBirth: z.string(),
  question: z.string(),
  lifePathNumber: z.number(),
  destinyNumber: z.number(),
  soulUrgeNumber: z.number(),
});

const GenerateReadingOutputSchema = z.object({
  answer: z.string(),
  followUpQuestion: z.string(),
  isYesNoQuestion: z.boolean(),
});

const ai = googleAI('gemini-1.5-flash-latest');

export const generateReadingFlow = defineFlow(
  {
    name: 'generateReadingFlow',
    input: {schema: GenerateReadingInputSchema},
    output: {schema: GenerateReadingOutputSchema},
  },
  async (input) => {
    const prompt = ai.definePrompt({
      name: 'generateReadingPrompt',
      input: {schema: GenerateReadingInputSchema},
      output: {schema: GenerateReadingOutputSchema},
      prompt: `You are Ravia, an expert numerologist with a warm, encouraging, and insightful voice. Your purpose is to provide exceptionally valuable, insightful, and in-depth numerological readings that feel both magical and practical. Go above and beyond the user's specific question to reveal fascinating connections and deeper meanings within their numerology profile. Make each reading feel unique and personal.

Here is the user's numerology profile:
- Life Path Number: ${input.lifePathNumber}
- Destiny Number: ${input.destinyNumber}
- Soul Urge Number: ${input.soulUrgeNumber}

Based on this profile, please answer the user's question: "${input.question}"

After answering the question, you must ask a follow-up question to invite further conversation. The follow-up question must be a 'yes' or 'no' question.

`,
    });

    const llmResponse = await generate({
      prompt: prompt.name,
      input,
      model: ai,
    });
    const response = llmResponse.output()!;
    if (response.isYesNoQuestion && response.followUpQuestion) {
      return response;
    }
    // If we get here, the model did not return a valid yes/no question.
    // We will ask the user if they want to check their compatibility.
    return {
      answer: response.answer,
      followUpQuestion:
        'Would you like me to analyze your numerological compatibility with a partner?',
      isYesNoQuestion: true,
    };
  }
);

export async function getReading(input: z.infer<typeof getReadingSchema>) {
  if (input.question.toLowerCase().includes('compatibility')) {
    const compatibility = await runFlow(getCompatibility, {
      userFullName: input.fullName,
      userDateOfBirth: input.dateOfBirth,
      partnerFullName: '',
      partnerDateOfBirth: '',
    });
    return {
      answer: compatibility.analysis,
      followUpQuestion: compatibility.followUpQuestion,
      isYesNoQuestion: compatibility.isYesNoQuestion,
    };
  }
  return await runFlow(generateReadingFlow, {
    ...input,
    ...getReadingTool.fn(input),
  });
}
