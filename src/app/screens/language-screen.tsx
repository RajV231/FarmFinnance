import React from 'react';
import { useGame } from '../context/game-context';
import { useLanguage, Language } from '../context/language-context';
import { Globe, Check } from 'lucide-react';

export const LanguageScreen = () => {
    const { dispatch } = useGame();
    const { setLanguage } = useLanguage();

    const languages = [
        { code: 'en', name: 'English', nativeName: 'English' },
        { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
        { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
        { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
        { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' }
    ];

    const handleSelect = (lang: Language) => {
        setLanguage(lang);
        dispatch({ type: 'SET_FARM_SETUP' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-600 via-emerald-700 to-green-800 flex flex-col items-center justify-center p-6 animate-slide-up">
            {/* Decorative Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-40"></div>
            
            <div className="relative z-10 w-full max-w-md">
                {/* Icon */}
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 ring-4 ring-white/30 shadow-xl">
                    <Globe className="w-12 h-12 text-white" />
                </div>

                {/* Title */}
                <h1 className="text-4xl font-bold text-white mb-3 text-center">Select Language</h1>
                <p className="text-green-100 mb-10 text-center font-medium text-lg">
                    अपनी भाषा चुनें • तुमची भाषा निवडा
                </p>

                {/* Language Options */}
                <div className="space-y-3">
                    {languages.map((lang) => (
                        <button 
                            key={lang.code}
                            onClick={() => handleSelect(lang.code as Language)} 
                            className="w-full bg-white/95 backdrop-blur-sm p-5 rounded-2xl shadow-lg border-2 border-transparent hover:border-white hover:bg-white active:scale-95 transition-all group"
                        >
                            <div className="flex items-center justify-between">
                                <div className="text-left">
                                    <div className="text-lg font-bold text-gray-800 mb-1">{lang.name}</div>
                                    <div className="text-2xl font-bold text-gray-600">{lang.nativeName}</div>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                                    <Check className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Footer */}
                <p className="text-center text-white/80 text-sm mt-8 font-medium">
                    You can change this later in settings
                </p>
            </div>
        </div>
    );
};
