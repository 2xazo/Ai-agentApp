// src/components/chat/MessageInput.jsx
import { useRef, useEffect, forwardRef, useState } from 'react';
import { PaperAirplaneIcon, MicrophoneIcon, StopIcon } from '@heroicons/react/24/solid';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const MessageInput = forwardRef(function MessageInput({ value, onChange, onSend, isLoading }, ref) {
  const textareaRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  useEffect(() => {
    if (ref && typeof ref === 'object') {
      ref.current = textareaRef.current;
    }
  }, [ref]);

  useEffect(() => {
    if (!isRecording) {
      if (recognition) {
        try {
          recognition.stop();
          setRecognition(null);
        } catch (err) {
          console.error('Error stopping recognition:', err);
        }
      }
      setInterimTranscript('');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in your browser. Please use Chrome.');
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'en-US';

    recognitionInstance.onstart = () => {
      console.log('Started listening...');
      toast.success('Recording started... Speak now');
    };

    recognitionInstance.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (interimTranscript) {
        setInterimTranscript(interimTranscript);
      }

      if (finalTranscript) {
        onChange(value + (value ? ' ' : '') + finalTranscript);
        setInterimTranscript('');
      }
    };

    recognitionInstance.onerror = (event) => {
      console.error('Recognition error:', event.error);
      switch (event.error) {
        case 'no-speech':
          console.log('No speech detected, continuing...');
          return;
        case 'audio-capture':
          toast.error('No microphone detected. Please check your microphone.');
          break;
        case 'not-allowed':
          toast.error('Microphone access denied. Please allow microphone access.');
          break;
        default:
          toast.error('Error with speech recognition. Please try again.');
      }
      setIsRecording(false);
    };

    recognitionInstance.onend = () => {
      console.log('Recognition ended');
      if (isRecording) {
        try {
          recognitionInstance.start();
        } catch (err) {
          console.error('Error restarting recognition:', err);
          setIsRecording(false);
        }
      }
    };

    try {
      recognitionInstance.start();
      setRecognition(recognitionInstance);
    } catch (err) {
      console.error('Failed to start recognition:', err);
      toast.error('Failed to start speech recognition');
      setIsRecording(false);
    }

    return () => {
      if (recognitionInstance) {
        try {
          recognitionInstance.stop();
        } catch (err) {
          console.error('Error stopping recognition:', err);
        }
      }
    };
  }, [isRecording, value, onChange]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (value.trim() && !isLoading) {
      onSend(value.trim());
    }
  };

  const startRecording = async () => {
    try {
      // Request microphone permission first
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      setError(null);
    } catch (err) {
      toast.error('Please allow microphone access to use voice input');
      setError('Microphone access denied');
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    toast.success('Recording stopped');
  };

  // Combine the final message with any interim message
  const displayMessage = value + (interimTranscript ? ' ' + interimTranscript : '');

  return (
    <div className="relative w-full">
      <div className="flex items-center bg-white dark:bg-gray-800 rounded-2xl shadow-md px-4 py-2">
        <div className="flex-shrink-0 mr-3">
          <SparklesIcon className="h-8 w-8 text-purple-600" />
        </div>
        <textarea
          ref={textareaRef}
          value={displayMessage}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isRecording ? "Listening..." : "Type your message..."}
          rows={1}
          className="flex-1 bg-transparent dark:bg-gray-800 outline-none text-gray-900 dark:text-white placeholder-gray-400 resize-none px-2 py-1 min-h-[36px] max-h-[120px]"
          disabled={isLoading}
        />
        <div className="flex items-center space-x-2">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-1 rounded-full transition-all duration-300 ${
              isRecording 
                ? 'text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 animate-pulse' 
                : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={isLoading}
            aria-label={isRecording ? 'Stop recording' : 'Start recording'}
          >
            {isRecording ? (
              <StopIcon className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 hover:scale-110" />
            ) : (
              <MicrophoneIcon className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 hover:scale-110" />
            )}
          </button>
          <button
            onClick={handleSend}
            disabled={!value.trim() || isLoading}
            className="p-1 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            aria-label="Send"
          >
            <PaperAirplaneIcon
              className="h-5 w-5 sm:h-6 sm:w-6 transform hover:rotate-45 transition-transform duration-300"
            />
          </button>
        </div>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {isRecording && (
        <div className="absolute left-4 bottom-2 text-xs text-gray-600 dark:text-gray-400 animate-pulse">
          Recording...
        </div>
      )}
    </div>
  );
});

export default MessageInput;
