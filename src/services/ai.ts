import { useStore } from '../store/useStore';

interface GenerateParams {
  prompt: string;
  systemInstruction?: string;
  schema?: any; // JSON schema for structured output
}

export async function generateContent({ prompt, systemInstruction, schema }: GenerateParams) {
  const { settings } = useStore.getState();
  const apiKey = settings.geminiApiKey;
  const model = settings.model;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (apiKey) {
    headers['x-gemini-api-key'] = apiKey;
  }

  const response = await fetch('/api/generate', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      prompt,
      model,
      systemInstruction,
      schema,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API Error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  
  if (schema) {
    try {
      // The API returns text. If a schema is requested, the text should be JSON.
      // We parse it here.
      // Often the model might wrap json in markdown block, so we clean it.
      let cleanText = data.text.trim();
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json/, '').replace(/```$/, '').trim();
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```/, '').replace(/```$/, '').trim();
      }
      return JSON.parse(cleanText);
    } catch (err) {
      console.error("Failed to parse AI response as JSON:", err, data.text);
      throw new Error("AI returned malformed JSON.");
    }
  }

  return data.text;
}
