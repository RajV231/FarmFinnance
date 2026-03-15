import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/language-context';

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    if ('speechSynthesis' in window) {
      setSupported(true);
      window.speechSynthesis.getVoices(); // Warm up the voices array
    }
    
    // Safety cleanup: If hook unmounts, kill the audio
    return () => {
       if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback((text: string) => {
    if (!supported) return;

    // 1. Cancel previous speech immediately
    window.speechSynthesis.cancel();
    
    // 2. INSTANT UI UPDATE: Make the button feel snappy
    setIsSpeaking(true);

    // 3. 50ms DELAY: Prevents the browser's audio buffer from stuttering
    setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);

        const langMap: Record<string, string> = {
            en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN', te: 'te-IN', ta: 'ta-IN'
        };
        const targetLang = langMap[language] || 'en-US';
        utterance.lang = targetLang;

        const voices = window.speechSynthesis.getVoices();
        let targetVoices = voices.filter(v => v.lang === targetLang || v.lang.replace('_', '-') === targetLang);

        if (targetVoices.length === 0) {
            targetVoices = voices.filter(v => v.lang.startsWith(targetLang.split('-')[0]));
        }

        // ENFORCE FEMALE VOICE CONSISTENCY
        let selectedVoice = targetVoices.find(v => 
            v.name.toLowerCase().includes('female') || 
            v.name.toLowerCase().includes('woman') || 
            v.name.includes('Swara') || 
            v.name.includes('Zira') || 
            v.name.includes('Google')
        );

        if (!selectedVoice && targetVoices.length > 0) {
            selectedVoice = targetVoices[0];
        }

        if (selectedVoice) utterance.voice = selectedVoice;

        // Failsafes to reset button state
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    }, 50);

  }, [supported, language]);

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [supported]);

  return { speak, stop, isSpeaking, supported };
};