import dotenv from 'dotenv';
dotenv.config();
import Groq from 'groq-sdk';

const testGroq = async () => {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const modelsList = await groq.models.list();
    const activeModels = modelsList.data.map(m => m.id);
    console.log('Available models for your key:', activeModels.slice(0, 10));

    // Choose the best available model
    const preferredModel = activeModels.find(m => m.includes('llama-3.3') || m.includes('llama-3.1-70b') || m.includes('llama-3.1-8b') || m.includes('llama3-70b')) || activeModels[0];
    console.log('Selected Model:', preferredModel);

    const completion = await groq.chat.completions.create({
      model: preferredModel,
      messages: [
        { role: 'system', content: 'You are an AI assistant for an Indian group buying platform.' },
        { role: 'user', content: 'Give a 1-sentence tip on how group buying saves money on headphones in India.' }
      ],
      temperature: 0.5,
      max_tokens: 100
    });

    console.log('✅ Groq API Test Successful!');
    console.log('Response:\n', completion.choices[0]?.message?.content);
  } catch (error) {
    console.error('❌ Groq API Test Error:', error.message);
  }
};

testGroq();
