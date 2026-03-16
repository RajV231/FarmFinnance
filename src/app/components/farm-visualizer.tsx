import React from 'react';
import { CloudRain, Sun, Bug, Sprout, Tractor, AlertTriangle, Wheat, Flower, Cloud, Droplets, Wind, Building, Zap, PanelTop } from 'lucide-react';
import { GameState } from '../context/game-context';
import { useLanguage } from '../context/language-context';

export const FarmVisualizer = ({ state }: { state: GameState }) => {
  const { currentCrop, currentEvent, phase, ownedAssets, totalAcres } = state;
  const { t } = useLanguage();

  const isDrought = currentEvent?.id === 'monsoon_delay' || state.weatherForecast === 'forecast_drought';
  const isSevereStorm = currentEvent?.type === 'WEATHER' && currentEvent.severity > 7;

  // Sky Determination
  const getSkyClass = () => {
    if (isSevereStorm) return 'bg-gradient-to-b from-slate-800 via-slate-700 to-slate-600'; 
    if (isDrought) return 'bg-gradient-to-b from-amber-200 via-orange-100 to-yellow-50'; 
    if (currentEvent?.type === 'WEATHER') return 'bg-gradient-to-b from-slate-400 via-slate-300 to-sky-200'; 
    
    switch (phase) {
        case 'EVENT_LATE': 
        case 'HARVEST': return 'bg-gradient-to-b from-orange-400 via-amber-300 to-yellow-200'; // Sunset
        case 'EVENT_MID': return 'bg-gradient-to-b from-sky-400 via-blue-300 to-sky-200';  // High Noon
        default: return 'bg-gradient-to-b from-blue-300 via-sky-200 to-blue-50'; // Morning
    }
  };

  // Soil Color
  const getSoilClass = () => {
      if (isDrought) return 'bg-gradient-to-b from-amber-300 to-amber-500 border-amber-600'; 
      if (isSevereStorm) return 'bg-gradient-to-b from-slate-700 to-slate-900 border-slate-950'; 
      return 'bg-gradient-to-b from-amber-700 to-amber-900 border-amber-950'; 
  };

  // Weather Effects Overlay
  const getWeatherEffects = () => {
    if (currentEvent?.type === 'WEATHER') {
      if (currentEvent.severity > 7) {
        return (
          <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
            {[...Array(40)].map((_, i) => (
              <div key={i} className="absolute w-0.5 h-12 bg-blue-200 opacity-70 animate-rain"
                style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 2}s`, animationDuration: `${0.4 + Math.random() * 0.4}s` }}
              />
            ))}
            {/* Lightning */}
            <Zap className="absolute top-4 left-1/3 w-24 h-24 text-yellow-300 opacity-0 animate-lightning" />
          </div>
        );
      } else if (currentEvent.severity > 4) {
        return (
          <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="absolute w-0.5 h-6 bg-blue-300 opacity-50 animate-rain"
                style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 2}s`, animationDuration: `${0.7 + Math.random() * 0.4}s` }}
              />
            ))}
          </div>
        );
      }
    }
    return null;
  };

  // Dynamic Crop Density based on Acres
  const renderCrops = () => {
    if (!currentCrop) {
        return (
            <div className="w-full flex justify-center items-end opacity-60 pb-4">
                <div className="bg-white/40 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/50 shadow-sm">
                  <span className="text-gray-800 text-xs font-bold uppercase tracking-wider">{t('vis_field_ready')}</span>
                </div>
            </div>
        );
    }

    const isSeedling = phase === 'EVENT_EARLY' || phase === 'PLANNING';
    const isGrowing = phase === 'EVENT_MID';
    const isMature = phase === 'EVENT_LATE' || phase === 'HARVEST';

    let cropIcon = <Sprout className="w-full h-full text-green-500" />;
    let cropHeight = 'h-8';
    
    if (currentCrop.typeKey === 'type_crop') {
        if (isMature) { cropIcon = <Wheat className={`w-full h-full ${currentCrop.id === 'cotton' ? 'text-gray-100' : 'text-yellow-400'}`} />; cropHeight = 'h-20'; } 
        else if (isGrowing) { cropIcon = <Sprout className="w-full h-full text-green-600" />; cropHeight = 'h-14'; } 
        else { cropIcon = <Sprout className="w-full h-full text-green-400" />; cropHeight = 'h-8'; }
    } else {
        if (isMature) { cropIcon = <Flower className="w-full h-full text-red-500" />; cropHeight = 'h-16'; } 
        else if (isGrowing) { cropIcon = <Sprout className="w-full h-full text-green-500" />; cropHeight = 'h-12'; } 
        else { cropIcon = <Sprout className="w-full h-full text-green-300" />; cropHeight = 'h-6'; }
    }

    const hasPests = currentEvent?.id === 'pest_attack';
    // Scale crop count based on acres (min 4, max 12)
    const cropCount = Math.min(12, Math.max(4, Math.floor(totalAcres * 1.5)));

    return (
      <div className="flex justify-around items-end h-full w-full px-4 pb-2 relative z-10">
         {[...Array(cropCount)].map((_, i) => (
           <div key={i} className={`w-8 sm:w-10 relative transition-all duration-1000 ${cropHeight} ${isSeedling ? 'animate-bounce' : ''} ${isSevereStorm ? 'animate-wiggle' : ''}`} style={{ animationDelay: `${i * 0.1}s` }}>
              {cropIcon}
              {hasPests && Math.random() > 0.5 && (
                  <Bug className="absolute -top-4 -right-2 w-5 h-5 text-red-600 animate-pulse drop-shadow-lg" />
              )}
           </div>
         ))}
      </div>
    );
  };

  return (
    <div className={`w-full h-56 md:h-64 rounded-2xl overflow-hidden relative shadow-inner transition-all duration-1000 ${getSkyClass()}`}>
      
      {/* 1. SKY & WEATHER LAYER */}
      {getWeatherEffects()}
      
      <div className="absolute top-4 right-4 z-10">
        {isSevereStorm ? (
            <div className="relative">
              <CloudRain className="text-slate-300 w-16 h-16 drop-shadow-xl animate-float" fill="#94a3b8" />
              <Droplets className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-blue-300 w-6 h-6 opacity-80 animate-pulse" />
            </div>
        ) : isDrought ? (
            <div className="relative">
              <Sun className="text-orange-500 w-16 h-16 drop-shadow-lg animate-spin-slow" fill="#f97316" />
              <div className="absolute inset-0 bg-orange-500 rounded-full opacity-40 blur-2xl"></div>
            </div>
        ) : (
            <div className="relative">
              <Sun className="text-yellow-300 w-16 h-16 drop-shadow-lg animate-spin-slow" fill="#fde047" />
              <div className="absolute inset-0 bg-yellow-300 rounded-full opacity-40 blur-xl"></div>
            </div>
        )}
      </div>

      {isSevereStorm && <Wind className="absolute top-1/3 left-4 text-white/50 w-12 h-12 animate-float" />}

      {/* 2. HORIZON / DEPTH LAYER */}
      <div className="absolute bottom-[30%] w-full h-24 flex justify-between px-[-20%] opacity-60 pointer-events-none">
          <div className={`w-64 h-64 rounded-full blur-sm -translate-x-1/4 translate-y-10 ${isDrought ? 'bg-amber-700' : 'bg-emerald-800'}`}></div>
          <div className={`w-80 h-80 rounded-full blur-sm translate-x-1/4 translate-y-4 ${isDrought ? 'bg-amber-800' : 'bg-emerald-900'}`}></div>
      </div>

      {/* 3. WAREHOUSE ASSET (Background) */}
      {ownedAssets.includes('warehouse') && (
        <div className="absolute bottom-[35%] right-6 z-10 flex flex-col items-center opacity-90 animate-slide-up">
            <Building className="w-16 h-16 text-slate-200 drop-shadow-2xl" fill="#64748b" />
            <div className="w-14 h-2 bg-black/30 rounded-full blur-[2px] mt-1"></div>
        </div>
      )}

      {/* 4. SOIL & CROPS LAYER */}
      <div className={`absolute bottom-0 w-full h-[35%] border-t-4 flex items-end transition-all duration-1000 ${getSoilClass()}`}>
         
         {/* Drip Irrigation Asset */}
         {ownedAssets.includes('drip_irrigation') && (
            <div className="absolute bottom-2 w-full flex justify-around px-3 opacity-80 z-0">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="relative">
                    <div className="w-1 h-12 bg-blue-400/50 rounded-full"></div>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-300 rounded-full animate-ping"></div>
                  </div>
                ))}
                <div className="absolute bottom-1 w-full h-1.5 bg-blue-400/40 rounded-full blur-[1px]"></div>
            </div>
         )}
         
         {/* Crops Array */}
         {renderCrops()}

         {/* Greenhouse Asset (Overlay on crops) */}
         {ownedAssets.includes('greenhouse') && currentCrop && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[95%] h-[140%] bg-white/20 border-4 border-white/50 rounded-t-[3rem] backdrop-blur-[2px] z-20 pointer-events-none shadow-[inset_0_10px_20px_rgba(255,255,255,0.5)] flex items-start justify-center pt-2">
                <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwb2x5Z29uIHBvaW50cz0iMCwwIDQwLDAgNDAsNDAgMCw0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMiIvPjwvc3ZnPg==')] opacity-50 rounded-t-[2.5rem]"></div>
            </div>
         )}
      </div>

      {/* 5. FOREGROUND ASSETS */}
      
      {/* Tractor Asset */}
      {ownedAssets.includes('mini_tractor') && (
        <div className="absolute bottom-[5%] left-4 z-30 animate-slide-up">
          <Tractor className="w-16 h-16 text-red-600 drop-shadow-xl" fill="#dc2626" />
          <div className="w-14 h-2 bg-black/40 rounded-full blur-[2px] mt-0 translate-x-1"></div>
        </div>
      )}

      {/* Solar Pump Asset */}
      {ownedAssets.includes('solar_pump') && (
        <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 z-30 flex flex-col items-center animate-slide-up">
          <PanelTop className="w-10 h-10 text-blue-900 drop-shadow-lg transform -skew-x-12" fill="#1e3a8a" />
          <div className="w-2 h-6 bg-gray-400"></div>
          <div className="w-6 h-4 bg-gray-300 rounded-sm flex items-center justify-center border border-gray-400">
             <Droplets className="w-3 h-3 text-blue-500 animate-pulse" />
          </div>
        </div>
      )}

      {/* 6. NOTIFICATIONS */}
      {(currentEvent?.type === 'MARKET' || currentEvent?.type === 'FRAUD' || currentEvent?.type === 'PERSONAL') && (
         <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl text-xs font-bold text-gray-800 flex items-center gap-2 shadow-xl border border-gray-200 animate-slide-up z-50">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            {t(currentEvent.titleKey)}
         </div>
      )}

      <style>{`
        @keyframes rain {
          0% { transform: translateY(-100%); opacity: 1; }
          100% { transform: translateY(300%); opacity: 0; }
        }
        @keyframes lightning {
          0%, 100% { opacity: 0; }
          10%, 12%, 14% { opacity: 1; transform: scale(1.1); }
          11%, 13% { opacity: 0.2; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-rain { animation: rain linear infinite; }
        .animate-lightning { animation: lightning 5s infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-wiggle { animation: wiggle 0.3s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
      `}</style>
    </div>
  );
};