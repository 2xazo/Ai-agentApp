import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_openaiKey,
  dangerouslyAllowBrowser: true,
});

export async function sendChatMessage(conversationId, text) {
  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: text }],
  });
  return res.choices[0].message.content;
}

 export async function transcribeAudio(file) {
  const res = await openai.audio.transcriptions.create({
    file,
    model: 'whisper-1',
  });
  return res.text;
}