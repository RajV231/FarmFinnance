import React, { useMemo } from 'react';
import { useGame } from '../context/game-context';
import { generateMarketOptions } from '../engine/market-engine';
import { Truck, MapPin, TrendingUp, AlertCircle } from 'lucide-react';

export const MarketScreen = () => {
    const { state, dispatch } = useGame();
    
    // Generate 3 unique mandis for this specific harvest
    const mandis = useMemo(() => generateMarketOptions(), [state.seasonNumber]);

    if (!state.currentCrop) return null;

    // Conservative yield estimate to show the player a rough calculation
    const estimatedYieldUnits = state.currentCrop.minYield * state.totalAcres * state.cumulativeYield;
    
    let basePrice = state.currentCrop.pricePerUnit;
    if (state.activeSchemes.includes('enam')) basePrice *= 1.10;

    const handleSell = (mandi: any) => {
        dispatch({ 
            type: 'SELL_CROP', 
            payload: { 
                priceMultiplier: mandi.priceMultiplier, 
                transportCostPerAcre: mandi.transportCostPerAcre,
                mandiName: mandi.name
            } 
        });
    };

    return (
        <div className="h-full bg-game-bg p-6 flex flex-col animate-slide-up overflow-y-auto">
             <div className="text-center mb-6 mt-4">
                <div className="inline-block p-4 bg-orange-100 rounded-full mb-3 shadow-sm border border-orange-200">
                    <Truck className="w-10 h-10 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-game-primary">Harvest Ready!</h2>
                <p className="text-gray-500 text-sm">Where do you want to sell your {state.currentCrop.name}?</p>
             </div>

             <div className="bg-white p-4 rounded-xl shadow-sm mb-6 border-l-4 border-game-primary">
                 <div className="flex justify-between items-center text-sm">
                     <span className="text-gray-500">Total Land:</span>
                     <span className="font-bold">{state.totalAcres} Acres</span>
                 </div>
                 <div className="flex justify-between items-center text-sm mt-2">
                     <span className="text-gray-500">Current Base Price:</span>
                     <span className="font-bold text-game-primary">₹{basePrice.toLocaleString()} / unit</span>
                 </div>
                 {state.cumulativeYield < 0.8 && (
                     <div className="mt-3 text-xs bg-red-50 text-red-600 p-2 rounded flex items-center gap-2">
                         <AlertCircle className="w-4 h-4"/> Due to events, your yield is lower than usual. Watch your transport costs!
                     </div>
                 )}
             </div>

             <h3 className="font-bold text-gray-700 mb-3 uppercase text-sm tracking-wider">Select Market (Mandi)</h3>
             
             <div className="space-y-4 pb-10">
                 {mandis.map(mandi => {
                     // Math for UI preview
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
                                     <MapPin className="w-5 h-5 text-game-primary" /> {mandi.name}
                                 </h4>
                                 <div className={`px-2 py-1 rounded text-xs font-bold ${mandi.priceMultiplier >= 1.2 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                     {(mandi.priceMultiplier * 100).toFixed(0)}% Price
                                 </div>
                             </div>
                             
                             <p className="text-xs text-gray-500 mb-4">{mandi.description}</p>
                             
                             <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                 <div className="flex justify-between text-xs mb-1">
                                     <span className="text-gray-500">Est. Gross Income</span>
                                     <span className="font-bold">₹{estGross.toLocaleString()}</span>
                                 </div>
                                 <div className="flex justify-between text-xs mb-2 pb-2 border-b border-gray-200">
                                     <span className="text-red-400">Total Transport Cost</span>
                                     <span className="text-red-500 font-bold">- ₹{totalTransport.toLocaleString()}</span>
                                 </div>
                                 <div className="flex justify-between text-sm">
                                     <span className="text-gray-700 font-bold">Est. Net Revenue</span>
                                     <span className="text-green-600 font-bold">₹{estNet.toLocaleString()}</span>
                                 </div>
                             </div>
                             
                             <div className="mt-4 w-full py-2 bg-gray-100 text-center text-sm font-bold text-gray-600 rounded-lg group-hover:bg-game-primary group-hover:text-white transition-colors">
                                 Sell Here
                             </div>
                         </button>
                     );
                 })}
             </div>
        </div>
    );
};