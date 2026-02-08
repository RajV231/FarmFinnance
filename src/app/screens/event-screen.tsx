import React, { useEffect } from 'react';
import { useGame } from '../context/game-context';
import { CloudRain, AlertTriangle, TrendingDown, Bug, HeartPulse, Tractor, Clock } from 'lucide-react';

export const EventScreen = () => {
  const { state, dispatch } = useGame();
  
  // Trigger event if missing (or when phase changes)
  useEffect(() => {
    if (!state.currentEvent) dispatch({ type: 'TRIGGER_EVENT' });
  }, [state.phase]);

  if (!state.currentEvent) return <div className="p-10 text-center animate-pulse">Scanning Fields...</div>;

  const evt = state.currentEvent;
  const isShock = evt.type === 'SHOCK' || evt.type === 'MARKET';

  const getIcon = () => {
      switch(evt.type) {
          case 'MARKET': return <TrendingDown className="w-20 h-20 text-red-500 mb-4" />;
          case 'PERSONAL': return <HeartPulse className="w-20 h-20 text-pink-500 mb-4" />;
          case 'INFRASTRUCTURE': return <Tractor className="w-20 h-20 text-orange-500 mb-4" />;
          case 'WEATHER': 
            if(evt.id === 'pest_attack') return <Bug className="w-20 h-20 text-green-700 mb-4" />;
            return <CloudRain className="w-20 h-20 text-blue-500 mb-4" />;
          default: return <AlertTriangle className="w-20 h-20 text-yellow-500 mb-4" />;
      }
  };

  // Timeline Indicator Logic
  const getPhaseIndex = () => {
      if (state.phase === 'EVENT_EARLY') return 1;
      if (state.phase === 'EVENT_MID') return 2;
      if (state.phase === 'EVENT_LATE') return 3;
      return 0;
  };
  const phaseIdx = getPhaseIndex();

  return (
    <div className={`h-full p-6 flex flex-col justify-center animate-fade-in ${isShock ? 'bg-red-50' : 'bg-game-bg'}`}>
      
      {/* Timeline Visual */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {[1, 2, 3].map(step => (
             <div key={step} className={`h-2 w-16 rounded-full transition-colors ${step <= phaseIdx ? 'bg-game-primary' : 'bg-gray-200'}`} />
        ))}
      </div>
      <div className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
        Stage {phaseIdx} of 3
      </div>
      
      {/* Event Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
        <div className={`p-6 flex flex-col items-center text-center ${isShock ? 'bg-red-100' : 'bg-blue-50'}`}>
             {getIcon()}
             <h2 className="text-2xl font-bold mb-2">{evt.titleKey}</h2>
             <p className="text-gray-600">{evt.descKey}</p>
        </div>
      </div>

      {/* Choices */}
      <div className="space-y-4">
        <h3 className="text-center font-bold text-gray-700">What will you do?</h3>
        
        {/* Choice A: The "Safe/Mitigation" Choice */}
        <button 
            onClick={() => dispatch({ 
                type: 'RESOLVE_EVENT_CHOICE', 
                payload: { 
                    cost: evt.choiceA.cost, 
                    wellbeing: evt.choiceA.mitigatedWellbeing || 0 
                } 
            })}
            className="w-full py-4 rounded-xl font-bold text-white shadow-md text-left px-6 flex justify-between bg-game-primary hover:bg-game-primaryDark transition-all active:scale-95"
        >
            <span>{evt.choiceA.label}</span>
            <span className="opacity-90 bg-black/20 px-2 py-1 rounded text-sm">
                -₹{evt.choiceA.cost}
            </span>
        </button>

        {/* Choice B: The "Risky" Choice */}
        <button 
            onClick={() => dispatch({ 
                type: 'RESOLVE_EVENT_CHOICE', 
                payload: { cost: evt.choiceB.cost, wellbeing: 0 } 
            })}
            className="w-full py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-bold shadow-sm text-left px-6 flex justify-between hover:bg-gray-50 active:scale-95"
        >
             <span>{evt.choiceB.label}</span>
             <span className="text-sm text-gray-400">
                {evt.choiceB.cost > 0 ? `-₹${evt.choiceB.cost}` : 'Free'}
             </span>
        </button>
      </div>
    </div>
  );
};