import React, { useMemo } from 'react';
import { useGame } from '../context/game-context';
import { useLanguage } from '../context/language-context'; // NEW
import { generateMarketOptions } from '../engine/market-engine';
import { Truck, MapPin, TrendingUp, AlertCircle } from 'lucide-react';

export const MarketScreen = () => {
    const { state, dispatch } = useGame();
    const { t } = useLanguage(); // NEW
    
    const mandis = useMemo(() => generateMarketOptions(), [state.seasonNumber]);

    if (!state.currentCrop) return null;

    const estimatedYieldUnits = state.currentCrop.minYield * state.totalAcres * state.cumulativeYield;
    
    let basePrice = state.currentCrop.pricePerUnit;
    if (state.activeSchemes.includes('enam')) basePrice *= 1.10;

    const handleSell = (mandi: any) => {
        dispatch({ 
            type: 'SELL_CROP', 
            payload: { priceMultiplier: mandi.priceMultiplier, transportCostPerAcre: mandi.transportCostPerAcre, mandiName: mandi.nameKey } 
        });
    };

    return (
        <div className="h-full bg-game-bg p-6 flex flex-col animate-slide-up overflow-y-auto">
             <div className="text-center mb-6 mt-4">
                <div className="inline-block p-4 bg-orange-100 rounded-full mb-3 shadow-sm border border-orange-200">
                    <Truck className="w-10 h-10 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-game-primary">{t('ui_harvest_ready')}</h2>
                <p className="text-gray-500 text-sm">
                    {t('ui_where_sell').replace('{val}', t(state.currentCrop.nameKey))}
                </p>
             </div>

             <div className="bg-white p-4 rounded-xl shadow-sm mb-6 border-l-4 border-game-primary">
                 <div className="flex justify-between items-center text-sm">
                     <span className="text-gray-500">{t('ui_total_land')}</span>
                     <span className="font-bold">{state.totalAcres} {t('ui_acres')}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm mt-2">
                     <span className="text-gray-500">{t('ui_base_price')}</span>
                     <span className="font-bold text-game-primary">₹{basePrice.toLocaleString()} {t('ui_per_unit')}</span>
                 </div>
                 {state.cumulativeYield < 0.8 && (
                     <div className="mt-3 text-xs bg-red-50 text-red-600 p-2 rounded flex items-center gap-2">
                         <AlertCircle className="w-4 h-4"/> {t('ui_yield_warning')}
                     </div>
                 )}
             </div>

             <h3 className="font-bold text-gray-700 mb-3 uppercase text-sm tracking-wider">{t('ui_select_mandi')}</h3>
             
             <div className="space-y-4 pb-10">
                 {mandis.map(mandi => {
                     const finalPricePreview = basePrice * state.cumulativePrice * mandi.priceMultiplier;
                     const estGross = Math.floor(estimatedYieldUnits * finalPricePreview);
                     const totalTransport = mandi.transportCostPerAcre * state.totalAcres;
                     const estNet = estGross - totalTransport;

                     return (
                         <button 
                             key={mandi.id}
                             onClick={() => handleSell(mandi)}
                             className="w-full bg-white p-5 rounded-2xl border-2 border-transparent shadow-sm hover:border-game-primary hover:shadow-md transition-all text-left group"
                         >
                             <div className="flex justify-between items-start mb-2">
                                 <h4 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                                     <MapPin className="w-5 h-5 text-game-primary" /> {t(mandi.nameKey)}
                                 </h4>
                                 <div className={`px-2 py-1 rounded text-xs font-bold ${mandi.priceMultiplier >= 1.2 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                     {(mandi.priceMultiplier * 100).toFixed(0)}%
                                 </div>
                             </div>
                             
                             <p className="text-xs text-gray-500 mb-4">{t(mandi.descKey)}</p>
                             
                             <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                 <div className="flex justify-between text-xs mb-1">
                                     <span className="text-gray-500">{t('ui_est_gross')}</span>
                                     <span className="font-bold">₹{estGross.toLocaleString()}</span>
                                 </div>
                                 <div className="flex justify-between text-xs mb-2 pb-2 border-b border-gray-200">
                                     <span className="text-red-400">{t('ui_transport_cost')}</span>
                                     <span className="text-red-500 font-bold">- ₹{totalTransport.toLocaleString()}</span>
                                 </div>
                                 <div className="flex justify-between text-sm">
                                     <span className="text-gray-700 font-bold">{t('ui_est_net')}</span>
                                     <span className="text-green-600 font-bold">₹{estNet.toLocaleString()}</span>
                                 </div>
                             </div>
                             
                             <div className="mt-4 w-full py-2 bg-gray-100 text-center text-sm font-bold text-gray-600 rounded-lg group-hover:bg-game-primary group-hover:text-white transition-colors">
                                 {t('ui_sell_here')}
                             </div>
                         </button>
                     );
                 })}
             </div>
        </div>
    );
};