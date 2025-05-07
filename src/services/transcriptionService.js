import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function transcribeAudio(audioFile) {
  try {
    const formData = new FormData();
    formData.append('file', audioFile);
    formData.append('model', 'whisper-1');

    const response = await openai.createTranscription(
      audioFile,
      'whisper-1',
      undefined,
      undefined,
      undefined,
      undefined
    );

    return response.data.text;
  } catch (error) {
    console.error('Error in transcription:', error);
    throw new Error('Failed to transcribe audio');
  }
} 