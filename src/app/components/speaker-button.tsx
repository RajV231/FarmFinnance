import React, { useEffect } from 'react';
import { Volume2, Square } from 'lucide-react';
import { useTextToSpeech } from '../hooks/use-text-to-speech';

interface SpeakerButtonProps {
  text: string;
  className?: string;
}

export const SpeakerButton = ({ text, className = '' }: SpeakerButtonProps) => {
  const { speak, stop, isSpeaking, supported } = useTextToSpeech();

  // Instantly stop the audio if the user clicks an option and the text changes!
  useEffect(() => {
    return () => {
      stop();
    };
  }, [text, stop]);


  return (
    <button
      onClick={(e) => {
        e.preventDefault(); // Prevents accidental scrolling or event bubbling on mobile
        isSpeaking ? stop() : speak(text);
      }}
      // THE FIX: Added shrink-0 so it never disappears on mobile!
      // Also added active:scale-90 for a satisfying native app "tap" feel.
      className={`shrink-0 p-2.5 rounded-full transition-all active:scale-90 ${
        isSpeaking 
            ? 'bg-red-100 text-red-600 animate-pulse' 
            : 'bg-blue-50 text-blue-600 border border-blue-100 shadow-sm hover:bg-blue-100'
      } ${className}`}
      title="Read Aloud"
    >
      {isSpeaking ? <Square className="w-5 h-5 fill-current" /> : <Volume2 className="w-5 h-5" />}
    </button>
  );
};