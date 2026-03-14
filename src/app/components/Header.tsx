import React from 'react';
import { useLanguage } from '../context/language-context';
import { useGame } from '../context/game-context';
import { RefreshCw, Globe, Sprout } from 'lucide-react';

export const Header = () => {
  const { t, language, setLanguage } = useLanguage();
  const { state, dispatch } = useGame();

  return (
    <header className="bg-earth-900 text-earth-50 p-4 shadow-md">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sprout className="w-6 h-6 text-green-400" />
          <h1 className="text-xl font-bold tracking-tight">{t('app_title')}</h1>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="text-sm hidden sm:block bg-earth-800 px-3 py-1 rounded-full">
            {t('season')} {state.seasonNumber}
          </div>
          
          <button 
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="p-2 hover:bg-earth-800 rounded-full transition"
            aria-label={t('ui_switch_lang')}
          >
            <Globe className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => dispatch({ type: 'RESET_GAME' })}
            className="p-2 hover:bg-earth-800 rounded-full transition"
            aria-label={t('ui_restart_game')}
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Status Bar */}
      <div className="max-w-4xl mx-auto mt-4 grid grid-cols-3 gap-2 text-sm">
        <div className="bg-earth-800 p-2 rounded text-center">
          <div className="text-earth-100 opacity-75">{t('header_savings')}</div>
          <div className="font-mono font-bold">₹{state.savings.toLocaleString()}</div>
        </div>
        <div className="bg-earth-800 p-2 rounded text-center">
          <div className="text-earth-100 opacity-75">{t('header_debt')}</div>
          <div className="font-mono font-bold text-red-300">₹{state.debt.toLocaleString()}</div>
        </div>
        <div className="bg-earth-800 p-2 rounded text-center">
          <div className="text-earth-100 opacity-75">{t('header_wellbeing')}</div>
          <div className="font-mono font-bold text-green-300">{state.wellbeing}%</div>
        </div>
      </div>
    </header>
  );
};