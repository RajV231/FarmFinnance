import React from 'react';
import { Volume2, Square } from 'lucide-react';
import { useTextToSpeech } from '../hooks/use-text-to-speech';

interface SpeakerButtonProps {
  text: string;
  className?: string;
}

export const SpeakerButton = ({ text, className = '' }: SpeakerButtonProps) => {
  const { speak, stop, isSpeaking, supported } = useTextToSpeech();

  if (!supported) return null;

  return (
    <button
      onClick={() => isSpeaking ? stop() : speak(text)}
      className={`p-2 rounded-full transition-all ${isSpeaking ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} ${className}`}
      title="Read Aloud"
    >
      {isSpeaking ? <Square className="w-5 h-5 fill-current" /> : <Volume2 className="w-5 h-5" />}
    </button>
  );
};