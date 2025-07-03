import { config } from 'dotenv';

// Load environment variables from .env.local first, then .env
// This allows developers to override config in .env with their local secrets
config({ path: '.env.local' });
config();

import '@/ai/flows/analyze-compatibility.ts';
import '@/ai/flows/generate-reading.ts';
