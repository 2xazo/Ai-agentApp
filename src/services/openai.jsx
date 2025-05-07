import OpenAI from 'openai';
import { toast } from 'react-hot-toast';

let openai = null;

export function initializeOpenAI(apiKey) {
  if (!apiKey) {
    toast.error('API key is required');
    throw new Error('API key is required');
  }
  
  try {
    openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true, // Only for development
    });
  } catch (error) {
    toast.error('Failed to initialize OpenAI client');
    throw error;
  }
}

export async function sendMessage(messages) {
  try {
    if (!openai) {
      const apiKey = localStorage.getItem('openai_api_key');
      if (!apiKey) {
        toast.error('Please set your OpenAI API key in the Profile section');
        throw new Error('OpenAI client not initialized and no API key found');
      }
      initializeOpenAI(apiKey);
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages.map(({ role, content }) => ({ role, content })),
      temperature: 0.7,
      max_tokens: 1000,
    });

    if (!response.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI');
    }

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error sending message to OpenAI:', error);
    if (error.message.includes('API key')) {
      toast.error('Invalid API key. Please check your API key in the Profile section.');
    } else if (error.message.includes('rate limit')) {
      toast.error('Rate limit exceeded. Please try again later.');
    } else {
      toast.error('Failed to get response from AI. Please try again.');
    }
    throw error;
  }
}

export async function transcribeAudio(audioFile) {
  try {
    if (!openai) {
      const apiKey = localStorage.getItem('openai_api_key');
      if (!apiKey) {
        toast.error('Please set your OpenAI API key in the Profile section');
        throw new Error('OpenAI client not initialized and no API key found');
      }
      initializeOpenAI(apiKey);
    }

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
      const error = await response.json();
      throw new Error(error.error?.message || 'Transcription failed');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    if (error.message.includes('API key')) {
      toast.error('Invalid API key. Please check your API key in the Profile section.');
    } else if (error.message.includes('rate limit')) {
      toast.error('Rate limit exceeded. Please try again later.');
    } else {
      toast.error('Failed to transcribe audio. Please try again.');
    }
    throw error;
  }
}