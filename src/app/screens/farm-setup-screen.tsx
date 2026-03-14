import React, { useState } from 'react';
import { useGame } from '../context/game-context';
import { useLanguage } from '../context/language-context';
import { Sprout, Carrot, Tractor, Scaling } from 'lucide-react';
import clsx from 'clsx';

export const FarmSetupScreen = () => {
  const { dispatch } = useGame();
  const { t } = useLanguage();
  const [size, setSize] = useState('2-5');
  const [type, setType] = useState('CROPS');

  return (
    <div className="flex flex-col min-h-full p-6 animate-slide-up pb-24">
      <h1 className="text-2xl font-bold text-center text-game-primary mb-2">{t('setup_title')}</h1>
      <p className="text-center text-gray-500 mb-8">{t('setup_subtitle')}</p>

      {/* Land Size */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Scaling className="w-4 h-4" /> {t('setup_land_size')}
        </h3>
        <div className="grid grid-cols-3 gap-3">
            {['<2', '2-5', '>5'].map((opt) => (
                <button 
                    key={opt}
                    onClick={() => setSize(opt)}
                    className={clsx(
                        "p-4 rounded-xl border-2 flex flex-col items-center justify-center bg-white shadow-sm",
                        size === opt ? "border-game-primary ring-1 ring-game-primary" : "border-gray-100"
                    )}
                >
                    <Tractor className={clsx("w-6 h-6 mb-2", size === opt ? "text-game-primary" : "text-gray-400")} />
                    <span className="font-bold text-sm">{opt}</span>
                </button>
            ))}
        </div>
      </div>

      {/* Farm Type */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Sprout className="w-4 h-4" /> {t('setup_farm_type')}
        </h3>
        <div className="grid grid-cols-3 gap-3">
            {[
                {id: 'CROPS', labelKey: 'type_crop', icon: <Sprout />}, 
                {id: 'VEGETABLES', labelKey: 'type_veg', icon: <Carrot />}, 
                {id: 'MIXED', labelKey: 'type_mixed', icon: <Tractor />} // Fallback to "type_mixed" if not in dict
            ].map((opt) => (
                <button 
                    key={opt.id}
                    onClick={() => setType(opt.id)}
                    className={clsx(
                        "p-4 rounded-xl border-2 flex flex-col items-center justify-center bg-white shadow-sm",
                        type === opt.id ? "border-game-primary ring-1 ring-game-primary" : "border-gray-100"
                    )}
                >
                    <div className={clsx("mb-2", type === opt.id ? "text-game-primary" : "text-gray-400")}>{opt.icon}</div>
                    <span className="font-bold text-xs">{t(opt.labelKey)}</span>
                </button>
            ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t">
        <button 
            onClick={() => dispatch({ type: 'CONFIRM_FARM_SETUP', payload: { size, type } })}
            className="w-full bg-game-primary hover:bg-game-primaryDark text-white py-4 rounded-xl font-bold text-lg shadow-lg"
        >
            {t('ui_continue')}
        </button>
      </div>
    </div>
  );
};