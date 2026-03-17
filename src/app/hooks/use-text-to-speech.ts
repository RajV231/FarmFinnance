import { useState, useCallback } from 'react';
import { useLanguage } from '../context/language-context';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { Capacitor } from '@capacitor/core';

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { language } = useLanguage();

  const speak = useCallback(async (text: string) => {
    if (!text) return;

    setIsSpeaking(true);

    const langMap: Record<string, string> = {
        en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN', te: 'te-IN', ta: 'ta-IN'
    };
    const targetLang = langMap[language] || 'en-US';

    try {
        if (Capacitor.isNativePlatform()) {
            // MOBILE: Use robust Native Android/iOS TTS Engine
            await TextToSpeech.speak({
                text: text,
                lang: targetLang,
                rate: 1.0,
                pitch: 1.0,
                category: 'ambient',
            });
            // The native promise resolves when speech finishes
            setIsSpeaking(false);
        } else {
            // LAPTOP: Use standard Web Speech API
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = targetLang;

            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);

            window.speechSynthesis.speak(utterance);
        }
    } catch (error) {
        console.error("TTS Error:", error);
        setIsSpeaking(false);
    }
  }, [language]);

  const stop = useCallback(async () => {
    setIsSpeaking(false);
    try {
        if (Capacitor.isNativePlatform()) {
            await TextToSpeech.stop();
        } else {
            window.speechSynthesis.cancel();
        }
    } catch (e) {
        console.error(e);
    }
  }, []);

  // We ALWAYS return supported as true now. The button will never hide!
  return { speak, stop, isSpeaking, supported: true };
};