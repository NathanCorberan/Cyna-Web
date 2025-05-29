// src/types/SetupIntent.ts

export interface SetupIntentResponse {
  client_secret: string;
  setup_intent_id: string;
  error?: string;
}
