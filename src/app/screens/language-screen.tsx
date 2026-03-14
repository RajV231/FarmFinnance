import React from 'react';
import { useGame } from '../context/game-context';
import { useLanguage, Language } from '../context/language-context';
import { Globe } from 'lucide-react';

export const LanguageScreen = () => {
    const { dispatch } = useGame();
    const { setLanguage } = useLanguage();

    const handleSelect = (lang: Language) => {
        setLanguage(lang);
        dispatch({ type: 'SET_FARM_SETUP' }); // Move to Goal Selection
    };

    return (
        <div className="h-full flex flex-col items-center justify-center bg-game-bg p-6 animate-slide-up min-h-screen">
            <Globe className="w-16 h-16 text-game-primary mb-6" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Select Language</h1>
            <p className="text-gray-500 mb-8">अपनी भाषा चुनें • तुमची भाषा निवडा</p>

            <div className="w-full max-w-sm space-y-4">
                <button onClick={() => handleSelect('en')} className="w-full bg-white p-4 rounded-xl shadow-sm border-2 border-transparent hover:border-game-primary text-lg font-bold text-gray-700 transition-all">
                    English
                </button>
                <button onClick={() => handleSelect('hi')} className="w-full bg-white p-4 rounded-xl shadow-sm border-2 border-transparent hover:border-game-primary text-lg font-bold text-gray-700 transition-all">
                    हिन्दी (Hindi)
                </button>
                <button onClick={() => handleSelect('mr')} className="w-full bg-white p-4 rounded-xl shadow-sm border-2 border-transparent hover:border-game-primary text-lg font-bold text-gray-700 transition-all">
                    मराठी (Marathi)
                </button>
                <button onClick={() => handleSelect('te')} className="w-full bg-white p-4 rounded-xl shadow-sm border-2 border-transparent hover:border-game-primary text-lg font-bold text-gray-700 transition-all">
                    తెలుగు (Telugu)
                </button>
                <button onClick={() => handleSelect('ta')} className="w-full bg-white p-4 rounded-xl shadow-sm border-2 border-transparent hover:border-game-primary text-lg font-bold text-gray-700 transition-all">
                    தமிழ் (Tamil)
                </button>
            </div>
        </div>
    );
};