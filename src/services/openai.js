import OpenAI from 'openai';

let openai = null;

export function initializeOpenAI(apiKey) {
  openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true, // Only for development
  });
}

export async function sendMessage(messages) {
  if (!openai) {
    throw new Error('OpenAI client not initialized');
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages.map(({ role, content }) => ({ role, content })),
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error sending message to OpenAI:', error);
    throw error;
  }
}

export async function transcribeAudio(audioFile) {
  if (!openai) {
    throw new Error('OpenAI client not initialized');
  }

  try {
    const formData = new FormData();
    formData.append('file', audioFile);
    formData.append('model', 'whisper-1');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openai.apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Transcription failed');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
} 