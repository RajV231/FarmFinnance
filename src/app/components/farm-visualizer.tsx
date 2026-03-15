import React from 'react';
import { CloudRain, Sun, Bug, Sprout, Tractor, AlertTriangle, Wheat, Flower, Cloud, Droplets, Wind } from 'lucide-react';
import { GameState } from '../context/game-context';
import { useLanguage } from '../context/language-context';

export const FarmVisualizer = ({ state }: { state: GameState }) => {
  const { currentCrop, currentEvent, phase, ownedAssets } = state;
  const { t } = useLanguage();

  // Sky & Weather Determination
  const getSkyClass = () => {
    if (currentEvent?.type === 'WEATHER') {
        if (currentEvent.severity >= 8) return 'bg-gradient-to-b from-slate-700 via-slate-600 to-slate-500'; 
        if (currentEvent.id === 'monsoon_delay') return 'bg-gradient-to-b from-amber-200 via-orange-100 to-yellow-50'; 
        return 'bg-gradient-to-b from-slate-400 via-slate-300 to-sky-200'; 
    }
    switch (phase) {
        case 'EVENT_LATE': 
        case 'HARVEST': return 'bg-gradient-to-b from-orange-300 via-amber-200 to-yellow-100'; 
        case 'EVENT_MID': return 'bg-gradient-to-b from-sky-400 via-blue-300 to-sky-200';  
        default: return 'bg-gradient-to-b from-sky-300 via-sky-200 to-blue-100'; 
    }
  };

  // Soil Color
  const getSoilClass = () => {
      if (currentEvent?.id === 'monsoon_delay') return 'bg-gradient-to-b from-amber-300 to-amber-400 border-amber-500'; 
      if (currentEvent?.type === 'WEATHER' && currentEvent.severity > 5) return 'bg-gradient-to-b from-slate-700 to-slate-800 border-slate-900'; 
      return 'bg-gradient-to-b from-amber-700 to-amber-800 border-amber-900'; 
  };

  // Weather Effects
  const getWeatherEffects = () => {
    if (currentEvent?.type === 'WEATHER') {
      if (currentEvent.severity > 7) {
        return (
          <div className="absolute inset-0 pointer-events-none">
            {/* Heavy Rain Effect */}
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-8 bg-blue-200 opacity-60 animate-rain"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${0.5 + Math.random() * 0.5}s`
                }}
              />
            ))}
          </div>
        );
      } else if (currentEvent.severity > 4) {
        return (
          <div className="absolute inset-0 pointer-events-none">
            {/* Light Rain */}
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-6 bg-blue-300 opacity-40 animate-rain"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${0.8 + Math.random() * 0.5}s`
                }}
              />
            ))}
          </div>
        );
      }
    }
    return null;
  };

  // Render Crops
  const renderCrops = () => {
    if (!currentCrop) {
        return (
            <div className="w-full flex justify-center items-end opacity-40">
                <div className="bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/40">
                  <span className="text-gray-700 text-xs font-bold">
                    {t('vis_field_ready')}
                  </span>
                </div>
            </div>
        );
    }

    const isSeedling = phase === 'EVENT_EARLY' || phase === 'PLANNING';
    const isGrowing = phase === 'EVENT_MID';
    const isMature = phase === 'EVENT_LATE' || phase === 'HARVEST';

    let cropIcon = <Sprout className="w-full h-full text-green-500" />;
    let cropHeight = 'h-8';
    let cropAnimation = '';
    
    if (currentCrop.typeKey === 'type_crop') {
        if (isMature) {
          cropIcon = <Wheat className={`w-full h-full ${currentCrop.id === 'cotton' ? 'text-gray-100' : 'text-yellow-400'}`} />;
          cropHeight = 'h-20';
        } else if (isGrowing) {
          cropIcon = <Sprout className="w-full h-full text-green-600" />;
          cropHeight = 'h-14';
        } else {
          cropIcon = <Sprout className="w-full h-full text-green-400" />;
          cropHeight = 'h-8';
        }
    } else {
        if (isMature) {
          cropIcon = <Flower className="w-full h-full text-red-400" />;
          cropHeight = 'h-18';
        } else if (isGrowing) {
          cropIcon = <Sprout className="w-full h-full text-green-500" />;
          cropHeight = 'h-12';
        } else {
          cropIcon = <Sprout className="w-full h-full text-green-300" />;
          cropHeight = 'h-6';
        }
    }

    if (isSeedling) cropAnimation = 'animate-bounce';

    const hasPests = currentEvent?.id === 'pest_attack';
    const hasStorm = currentEvent?.type === 'WEATHER' && currentEvent.severity > 6;

    return (
      <div className="flex justify-around items-end h-full w-full px-2 pb-2">
         {[1, 2, 3, 4, 5, 6].map(i => (
           <div 
             key={i} 
             className={`w-10 relative transition-all duration-1000 ${cropHeight} ${cropAnimation} ${hasStorm ? 'animate-wiggle' : ''}`}
             style={{ animationDelay: `${i * 0.1}s` }}
           >
              {cropIcon}
              {hasPests && i % 2 === 0 && (
                  <Bug className="absolute -top-3 -right-2 w-5 h-5 text-red-600 animate-pulse drop-shadow-lg" />
              )}
           </div>
         ))}
      </div>
    );
  };

  return (
    <div className={`w-full h-52 md:h-64 rounded-2xl overflow-hidden relative border-2 border-white shadow-xl transition-all duration-1000 ${getSkyClass()}`}>
      {/* Weather Effects Layer */}
      {getWeatherEffects()}

      {/* Sun/Clouds */}
      <div className="absolute top-4 right-4 z-10">
        {currentEvent?.type === 'WEATHER' && currentEvent.severity > 5 ? (
            <div className="relative">
              <CloudRain className="text-slate-200 w-14 h-14 drop-shadow-md animate-float" />
              <Droplets className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-blue-300 w-6 h-6 opacity-60 animate-pulse" />
            </div>
        ) : currentEvent?.id === 'monsoon_delay' ? (
            <Cloud className="text-gray-300 w-14 h-14 opacity-60 drop-shadow-md" />
        ) : (
            <div className="relative">
              <Sun className="text-yellow-400 w-14 h-14 drop-shadow-lg animate-spin-slow" />
              <div className="absolute inset-0 bg-yellow-400 rounded-full opacity-30 blur-xl"></div>
            </div>
        )}
      </div>

      {/* Wind Effect for storms */}
      {currentEvent?.type === 'WEATHER' && currentEvent.severity > 7 && (
        <Wind className="absolute top-1/3 left-4 text-white/40 w-10 h-10 animate-float" />
      )}

      {/* Tractor Asset */}
      {ownedAssets.includes('tractor') && (
        <div className="absolute bottom-1/3 left-4 z-10">
          <Tractor className="w-20 h-20 text-blue-600 drop-shadow-lg opacity-90" />
        </div>
      )}

      {/* Solar Pump Asset */}
      {ownedAssets.includes('solar_pump') && (
        <div className="absolute top-4 left-4 z-10">
          <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center shadow-lg border-2 border-yellow-400">
            <Sun className="w-6 h-6 text-yellow-400" />
          </div>
        </div>
      )}

      {/* Soil Layer */}
      <div className={`absolute bottom-0 w-full h-1/3 border-t-4 flex items-end transition-all duration-1000 ${getSoilClass()}`}>
         {/* Drip Irrigation */}
         {ownedAssets.includes('drip_irrigation') && (
            <div className="absolute bottom-2 w-full flex justify-around px-3 opacity-70 z-0">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="relative">
                    <div className="w-0.5 h-10 bg-blue-400 rounded-full"></div>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-300 rounded-full animate-ping"></div>
                  </div>
                ))}
                <div className="absolute bottom-0 w-full h-1 bg-blue-400 opacity-50"></div>
            </div>
         )}
         
         {/* Crops */}
         <div className="relative z-10 w-full">
           {renderCrops()}
         </div>
      </div>

      {/* Event Badge */}
      {(currentEvent?.type === 'MARKET' || currentEvent?.type === 'FRAUD' || currentEvent?.type === 'PERSONAL') && (
         <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl text-xs font-bold text-gray-700 flex items-center gap-2 shadow-lg border border-gray-200 animate-fade-in z-20">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            {t(currentEvent.titleKey)}
         </div>
      )}

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iI2ZmZiIgb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-20 pointer-events-none"></div>
    </div>
  );
};

// Add these animations to your global CSS
const styles = `
@keyframes rain {
  0% { transform: translateY(-100%); opacity: 1; }
  100% { transform: translateY(300%); opacity: 0; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes wiggle {
  0%, 100% { transform: rotate(-2deg); }
  50% { transform: rotate(2deg); }
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-rain {
  animation: rain linear infinite;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-wiggle {
  animation: wiggle 0.3s ease-in-out infinite;
}

.animate-spin-slow {
  animation: spin-slow 20s linear infinite;
}
`;
