import Groq from 'groq-sdk';

let groqClient = null;
let resolvedModel = 'openai/gpt-oss-120b';

const getGroqClient = async () => {
  if (!groqClient && process.env.GROQ_API_KEY) {
    try {
      groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
      const modelsList = await groqClient.models.list();
      const activeIds = modelsList.data.map(m => m.id);

      const candidate = activeIds.find(id =>
        id === 'openai/gpt-oss-120b' ||
        id === 'llama-3.3-70b-versatile' ||
        id === 'llama-3.1-8b-instant' ||
        id === 'llama3-70b-8192' ||
        id === 'openai/gpt-oss-20b'
      ) || activeIds[0];

      if (candidate) {
        resolvedModel = candidate;
        console.log(`🤖 Groq AI active model resolved: ${resolvedModel}`);
      }
    } catch (e) {
      console.warn('Groq client init model discovery note:', e.message);
    }
  }
  return groqClient;
};

export const callGroqChat = async ({ messages, systemPrompt, temperature = 0.5, maxTokens = 800 }) => {
  try {
    const client = await getGroqClient();

    if (client) {
      const response = await client.chat.completions.create({
        model: resolvedModel,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature,
        max_tokens: maxTokens
      });

      const replyContent = response.choices[0]?.message?.content || '';
      return {
        success: true,
        content: replyContent,
        provider: `groq (${resolvedModel})`
      };
    }
  } catch (err) {
    console.warn('Groq API call issue, applying graceful fallback:', err.message);
  }

  return {
    success: false,
    content: null,
    provider: 'local-heuristic-engine'
  };
};
