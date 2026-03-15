import React, { useState } from 'react';
import { useGame } from '../context/game-context';
import { useLanguage } from '../context/language-context';
import { Sprout, Carrot, Tractor, Scaling, ArrowRight } from 'lucide-react';

export const FarmSetupScreen = () => {
  const { dispatch } = useGame();
  const { t } = useLanguage();
  const [size, setSize] = useState('2-5');
  const [type, setType] = useState('CROPS');

  const sizeOptions = [
    { value: '<2', label: '<2 acres', icon: '🌱' },
    { value: '2-5', label: '2-5 acres', icon: '🚜' },
    { value: '>5', label: '>5 acres', icon: '🏞️' }
  ];

  const typeOptions = [
    { id: 'CROPS', labelKey: 'type_crop', icon: <Sprout className="w-8 h-8" />, gradient: 'from-green-500 to-emerald-500' }, 
    { id: 'VEGETABLES', labelKey: 'type_veg', icon: <Carrot className="w-8 h-8" />, gradient: 'from-orange-500 to-amber-500' }, 
    { id: 'MIXED', labelKey: 'type_mixed', icon: <Tractor className="w-8 h-8" />, gradient: 'from-blue-500 to-indigo-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col animate-slide-up">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-green-700 to-emerald-800"></div>
        <div className="relative px-6 py-12 text-white text-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-4 ring-4 ring-white/30">
            <Tractor className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold mb-2">{t('setup_title')}</h1>
          <p className="text-green-100 font-medium">{t('setup_subtitle')}</p>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 px-6 -mt-6 pb-32">
        {/* Land Size Section */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Scaling className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">{t('setup_land_size')}</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
              {sizeOptions.map((opt) => (
                  <button 
                      key={opt.value}
                      onClick={() => setSize(opt.value)}
                      className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${
                        size === opt.value 
                          ? 'border-green-600 bg-gradient-to-br from-green-50 to-emerald-50 shadow-md scale-105' 
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                  >
                      <span className="text-3xl mb-2">{opt.icon}</span>
                      <span className={`font-bold text-sm ${size === opt.value ? 'text-green-700' : 'text-gray-600'}`}>
                        {opt.label}
                      </span>
                  </button>
              ))}
          </div>
        </div>

        {/* Farm Type Section */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
              <Sprout className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">{t('setup_farm_type')}</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
              {typeOptions.map((opt) => (
                  <button 
                      key={opt.id}
                      onClick={() => setType(opt.id)}
                      className={`p-5 rounded-2xl border-2 flex flex-col items-center justify-center transition-all ${
                        type === opt.id 
                          ? 'border-green-600 bg-gradient-to-br from-green-50 to-emerald-50 shadow-md scale-105' 
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                  >
                      <div className={`mb-2 ${type === opt.id ? 'text-green-600' : 'text-gray-400'}`}>
                        {opt.icon}
                      </div>
                      <span className={`font-bold text-xs ${type === opt.id ? 'text-green-700' : 'text-gray-600'}`}>
                        {t(opt.labelKey)}
                      </span>
                  </button>
              ))}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
<div className="fixed bottom-0 left-0 w-full p-4 bg-white/80 backdrop-blur-xl border-t border-gray-200 z-40">
        <button 
            onClick={() => dispatch({ type: 'CONFIRM_FARM_SETUP', payload: { size, type } })}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:from-green-700 hover:to-emerald-700 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
            {t('ui_continue')}
            <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
