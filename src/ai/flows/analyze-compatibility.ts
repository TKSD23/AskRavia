import {calculateNumerologyProfile} from '@/lib/numerology';
import {generate} from '@genkit-ai/ai';
import {defineFlow} from '@genkit-ai/flow';
import {z} from 'zod';
import {googleAI} from '@genkit-ai/googleai';

const CompatibilityInputSchema = z.object({
  userFullName: z.string(),
  userDateOfBirth: z.string(),
  partnerFullName: z.string(),
  partnerDateOfBirth: z.string(),
});

const CompatibilityOutputSchema = z.object({
  analysis: z.string(),
  followUpQuestion: z.string(),
  isYesNoQuestion: z.boolean(),
});

const ai = googleAI('gemini-1.5-flash-latest');

export const getCompatibility = defineFlow(
  {
    name: 'getCompatibility',
    input: {schema: CompatibilityInputSchema},
    output: {schema: CompatibilityOutputSchema},
  },
  async (input) => {
    const userProfile = calculateNumerologyProfile(input.userFullName, input.userDateOfBirth);
    const partnerProfile = calculateNumerologyProfile(input.partnerFullName, input.partnerDateOfBirth);
    
    const prompt = ai.definePrompt({
      name: 'compatibilityPrompt',
      input: {
        schema: z.object({
          userProfile: z.any(),
          partnerProfile: z.any(),
        }),
      },
      output: {schema: CompatibilityOutputSchema},
      prompt: `You are Ravia, an expert numerologist with a warm, encouraging, and insightful voice. Your purpose is to provide an exceptionally valuable and in-depth numerological compatibility analysis that feels both magical and practical. Go beyond a simple compatibility score to reveal the fascinating connections, challenges, and deeper meanings within the relationship. Make the reading feel unique and personal.

Here is the user's numerology profile:
- Life Path Number: ${userProfile.lifePathNumber}
- Destiny Number: ${userProfile.destinyNumber}
- Soul Urge Number: ${userProfile.soulUrgeNumber}

Here is the partner's numerology profile:
- Life Path Number: ${partnerProfile.lifePathNumber}
- Destiny Number: ${partnerProfile.destinyNumber}
- Soul Urge Number: ${partnerProfile.soulUrgeNumber}

Based on these profiles, please provide a detailed compatibility analysis. After answering the question, you must ask a follow-up question to invite further conversation. The follow-up question must be a 'yes' or 'no' question.
`,
    });
    const llmResponse = await generate({
      prompt: prompt.name,
      input: {userProfile, partnerProfile},
      model: ai,
    });
    return llmResponse.output()!;
  }
);
