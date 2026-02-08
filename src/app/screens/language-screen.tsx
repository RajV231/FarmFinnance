import React from 'react';
import { useLanguage } from '../context/language-context';
import { useGame } from '../context/game-context';
import { Languages, Check } from 'lucide-react';
import clsx from 'clsx';

export const LanguageScreen = () => {
  const { setLanguage, language } = useLanguage();
  const { dispatch } = useGame();

  const handleSelect = (lang: 'en' | 'hi') => {
    setLanguage(lang);
    setTimeout(() => {
        dispatch({ type: 'SET_FARM_SETUP' });
    }, 300);
  };

  return (
    <div className="flex flex-col h-full p-6 justify-center animate-fade-in">
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
            👨‍🌾
        </div>
        <h1 className="text-2xl font-bold text-game-primary">Choose Language</h1>
        <p className="text-gray-500">भाषा चुनें</p>
      </div>

      <div className="space-y-4">
        <button 
            onClick={() => handleSelect('hi')}
            className={clsx("w-full p-5 rounded-xl border-2 flex items-center justify-between transition-all", language === 'hi' ? "border-game-primary bg-green-50" : "border-gray-200 bg-white")}
        >
            <span className="text-lg font-bold">IN हिन्दी</span>
            {language === 'hi' && <Check className="text-game-primary" />}
        </button>

        <button 
            onClick={() => handleSelect('en')}
            className={clsx("w-full p-5 rounded-xl border-2 flex items-center justify-between transition-all", language === 'en' ? "border-game-primary bg-green-50" : "border-gray-200 bg-white")}
        >
            <span className="text-lg font-bold">ABC English</span>
            {language === 'en' && <Check className="text-game-primary" />}
        </button>
      </div>
    </div>
  );
};