import React, { useEffect } from 'react';
import { useGame } from '../context/game-context';
import { useLanguage } from '../context/language-context';
import { CloudRain, AlertTriangle, TrendingDown, Bug, HeartPulse, Tractor, ArrowRight } from 'lucide-react';
import { FarmVisualizer } from '../components/farm-visualizer'; 
import { SpeakerButton } from '../components/speaker-button';

export const EventScreen = () => {
  const { state, dispatch } = useGame();
  const { t } = useLanguage();
  
  useEffect(() => {
    if (!state.currentEvent) dispatch({ type: 'TRIGGER_EVENT' });
  }, [state.phase, state.currentEvent, dispatch]);

  if (!state.currentEvent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">{t('ui_scanning')}</p>
        </div>
      </div>
    );
  }

  const evt = state.currentEvent;
  const isShock = evt.type === 'SHOCK' || evt.type === 'MARKET';

  const getIcon = () => {
      switch(evt.type) {
          case 'MARKET': return <TrendingDown className="w-20 h-20 text-red-500" />;
          case 'PERSONAL': return <HeartPulse className="w-20 h-20 text-pink-500" />;
          case 'INFRASTRUCTURE': return <Tractor className="w-20 h-20 text-orange-500" />;
          case 'WEATHER': 
            if(evt.id === 'pest_attack') return <Bug className="w-20 h-20 text-green-700" />;
            return <CloudRain className="w-20 h-20 text-blue-500" />;
          default: return <AlertTriangle className="w-20 h-20 text-yellow-500" />;
      }
  };

  const getPhaseIndex = () => {
      if (state.phase === 'EVENT_EARLY') return 1;
      if (state.phase === 'EVENT_MID') return 2;
      if (state.phase === 'EVENT_LATE') return 3;
      return 0;
  };
  const phaseIdx = getPhaseIndex();
  
  const textToRead = `${t(evt.titleKey)}. ${t(evt.descKey)}. ${t('tts_what_do')} ${t('tts_option_a')}: ${t(evt.choiceA.labelKey)}, ${t('tts_cost')} ${evt.choiceA.cost} ${t('tts_rupees')}. ${t('tts_option_b')}: ${t(evt.choiceB.labelKey)}, ${t('tts_cost')} ${evt.choiceB.cost} ${t('tts_rupees')}.`;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 animate-fade-in overflow-y-auto pb-10 relative">
      
      {/* NEW: FLOATING SAVINGS BADGE */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-200 z-50">
          <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mr-2">Savings:</span>
          <span className="font-bold text-green-700 font-mono">₹{state.savings.toLocaleString()}</span>
      </div>

      {/* Farm Visualizer */}
      <div className="p-4">
        <FarmVisualizer state={state} />
      </div>

      <div className="px-6 py-4">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-3 mb-6">
            {[1, 2, 3].map(step => (
                <div 
                  key={step} 
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    step <= phaseIdx 
                      ? 'w-20 bg-gradient-to-r from-green-600 to-emerald-600' 
                      : 'w-16 bg-gray-200'
                  }`} 
                />
            ))}
        </div>
        <div className="text-center text-xs font-bold text-gray-500 uppercase tracking-widest mb-8">
            {t('ui_stage')} {phaseIdx} {t('ui_of')} 3
        </div>
        
        {/* Event Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 relative animate-scale-in"> 
            <div className="absolute top-4 right-4 z-10">
                <SpeakerButton text={textToRead} />
            </div>
            <div className={`p-8 flex flex-col items-center text-center ${
              isShock 
                ? 'bg-gradient-to-br from-red-50 to-pink-50' 
                : 'bg-gradient-to-br from-blue-50 to-indigo-50'
            }`}>
                <div className={`w-28 h-28 rounded-3xl flex items-center justify-center mb-4 ${
                  isShock ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                  {getIcon()}
                </div>
                <h2 className="text-2xl font-bold mb-3 text-gray-900">{t(evt.titleKey)}</h2>
                <p className="text-gray-600 leading-relaxed max-w-md">{t(evt.descKey)}</p>
            </div>
        </div>

        {/* Choices */}
        <div className="space-y-4">
            <h3 className="text-center font-bold text-gray-800 text-lg mb-4">{t('tts_what_do')}</h3>
            
            {/* Choice A - Primary Action */}
            <button 
                onClick={() => dispatch({ 
                    type: 'RESOLVE_EVENT_CHOICE', 
                    payload: { cost: evt.choiceA.cost, wellbeing: evt.choiceA.mitigatedWellbeing || 0 } 
                })}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl shadow-lg hover:from-green-700 hover:to-emerald-700 active:scale-95 transition-all overflow-hidden"
            >
                <div className="p-5 flex items-center justify-between">
                  <span className="font-bold text-left flex-1">{t(evt.choiceA.labelKey)}</span>
                  <div className="flex items-center gap-2">
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-xl text-sm font-bold">
                        -₹{evt.choiceA.cost.toLocaleString()}
                    </span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
            </button>

            {/* Choice B - Secondary Action */}
            <button 
                onClick={() => dispatch({ 
                    type: 'RESOLVE_EVENT_CHOICE', 
                    payload: { cost: evt.choiceB.cost, wellbeing: 0 } 
                })}
                className="w-full bg-white border-2 border-gray-200 text-gray-700 rounded-2xl shadow-sm hover:border-gray-300 hover:bg-gray-50 active:scale-95 transition-all"
            >
                <div className="p-5 flex items-center justify-between">
                  <span className="font-bold text-left flex-1">{t(evt.choiceB.labelKey)}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-500">
                        {evt.choiceB.cost > 0 ? `-₹${evt.choiceB.cost.toLocaleString()}` : t('ui_free')}
                    </span>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
            </button>
        </div>
      </div>
    </div>
  );
};
