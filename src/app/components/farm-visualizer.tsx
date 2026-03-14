import React from 'react';
import { CloudRain, Sun, Bug, Sprout, Tractor, AlertTriangle, Wheat, Flower } from 'lucide-react';
import { GameState } from '../context/game-context';
import { useLanguage } from '../context/language-context'; // NEW

export const FarmVisualizer = ({ state }: { state: GameState }) => {
  const { currentCrop, currentEvent, phase, ownedAssets } = state;
  const { t } = useLanguage(); // NEW

  // 1. Determine Environment (Sky & Weather)
  const getSkyClass = () => {
    if (currentEvent?.type === 'WEATHER') {
        if (currentEvent.severity >= 8) return 'bg-slate-700'; 
        if (currentEvent.id === 'monsoon_delay') return 'bg-amber-100'; 
        return 'bg-slate-400'; 
    }
    switch (phase) {
        case 'EVENT_LATE': 
        case 'HARVEST': return 'bg-orange-200'; 
        case 'EVENT_MID': return 'bg-sky-400';  
        default: return 'bg-sky-200'; 
    }
  };

  // 2. Determine Soil Color
  const getSoilClass = () => {
      if (currentEvent?.id === 'monsoon_delay') return 'bg-amber-200 border-amber-300'; 
      if (currentEvent?.type === 'WEATHER' && currentEvent.severity > 5) return 'bg-slate-800 border-slate-900'; 
      return 'bg-amber-800 border-amber-900'; 
  };

  // 3. Render The Crop Logic
  const renderCrops = () => {
    if (!currentCrop) {
        return (
            <div className="w-full flex justify-center items-end opacity-30">
                <span className="text-white text-xs mb-2 bg-black/20 px-2 py-1 rounded">
                    {t('vis_field_ready')} {/* TRANSLATED */}
                </span>
            </div>
        );
    }

    const isSeedling = phase === 'EVENT_EARLY' || phase === 'PLANNING';
    const isGrowing = phase === 'EVENT_MID';
    const isMature = phase === 'EVENT_LATE' || phase === 'HARVEST';

    let cropIcon = <Sprout className="w-full h-full text-green-500" />;
    let cropHeight = 'h-8';
    
    if (currentCrop.typeKey === 'type_crop') { // Updated to use typeKey
        if (isMature) cropIcon = <Wheat className={`w-full h-full ${currentCrop.id === 'cotton' ? 'text-gray-100' : 'text-yellow-400'}`} />;
        else cropIcon = <Sprout className="w-full h-full text-green-600" />;
    } else {
        if (isMature) cropIcon = <Flower className="w-full h-full text-red-400" />;
        else cropIcon = <Sprout className="w-full h-full text-green-400" />;
    }

    if (isSeedling) cropHeight = 'h-6';
    if (isGrowing) cropHeight = 'h-12';
    if (isMature) cropHeight = 'h-16';

    const hasPests = currentEvent?.id === 'pest_attack';

    return (
      <div className="flex justify-around items-end h-full w-full px-2 pb-1">
         {[1, 2, 3, 4, 5, 6].map(i => (
           <div 
             key={i} 
             className={`w-8 relative transition-all duration-1000 ${cropHeight} ${isSeedling ? 'animate-bounce' : 'animate-none'}`}
             style={{ animationDelay: `${i * 0.1}s` }}
           >
              {cropIcon}
              {hasPests && i % 2 === 0 && (
                  <Bug className="absolute -top-2 -right-2 w-4 h-4 text-red-600 animate-pulse" />
              )}
           </div>
         ))}
      </div>
    );
  };

  return (
    <div className={`w-full h-48 md:h-64 rounded-xl overflow-hidden relative border-4 border-white shadow-lg transition-colors duration-1000 ${getSkyClass()}`}>
      <div className="absolute top-4 right-4 animate-pulse">
        {currentEvent?.type === 'WEATHER' && currentEvent.severity > 5 ? (
            <CloudRain className="text-slate-200 w-12 h-12" />
        ) : (
            <Sun className="text-yellow-400 w-12 h-12 animate-spin-slow" />
        )}
      </div>

      {ownedAssets.includes('tractor') && (
        <Tractor className="absolute bottom-1/3 left-2 w-16 h-16 text-blue-600 opacity-80 z-0" />
      )}

      <div className={`absolute bottom-0 w-full h-1/3 border-t-4 flex items-end transition-colors duration-1000 ${getSoilClass()}`}>
         {ownedAssets.includes('drip_irrigation') && (
            <div className="absolute bottom-2 w-full flex justify-around px-2 opacity-60">
                {[1,2,3,4,5,6].map(i => <div key={i} className="w-0.5 h-8 bg-blue-400" />)}
                <div className="absolute bottom-0 w-full h-1 bg-blue-400" />
            </div>
         )}
         {renderCrops()}
      </div>

      {/* TRANSLATED EVENT BADGE */}
      {(currentEvent?.type === 'MARKET' || currentEvent?.type === 'FRAUD') && (
         <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-gray-700 flex items-center gap-2 shadow-sm animate-fade-in">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            {t(currentEvent.titleKey)}
         </div>
      )}
    </div>
  );
};