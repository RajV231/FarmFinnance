import React from 'react';
import { useGame } from '../context/game-context';
import { useLanguage } from '../context/language-context';
import { ASSETS } from '../data/game-scenarios';
import { ArrowLeft, Check, ShoppingBag, Map } from 'lucide-react';

export const ShopScreen = () => {
  const { state, dispatch } = useGame();
  const { t } = useLanguage();

  const LAND_PRICE_PER_ACRE = 200000; 
  const LAND_DOWN_PAYMENT_PCT = 0.2; 

  const handleBuyLand = () => {
      const downPayment = LAND_PRICE_PER_ACRE * LAND_DOWN_PAYMENT_PCT;
      if(state.savings >= downPayment) {
          if(confirm(t('shop_buy_land_confirm', { down: downPayment.toLocaleString(), loan: (LAND_PRICE_PER_ACRE - downPayment).toLocaleString() }))) {
              dispatch({ type: 'BUY_LAND', payload: { acres: 1, cost: LAND_PRICE_PER_ACRE, downPayment } });
          }
      }
  };

  return (
    <div className="h-full bg-game-bg p-6 flex flex-col animate-slide-up overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
             <button onClick={() => dispatch({ type: 'GO_TO_DASHBOARD' })} className="flex items-center gap-2 text-gray-600">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="bg-white px-4 py-2 rounded-full font-bold text-game-primary text-sm shadow-sm">
                ₹{state.savings.toLocaleString()}
            </div>
        </div>

        <div className="flex items-center gap-3 mb-2">
            <ShoppingBag className="w-8 h-8 text-game-primary" />
            <h2 className="text-2xl font-bold text-game-primary">{t('shop')}</h2>
        </div>
        
        <div className="space-y-4 pb-20">
            {ASSETS.map(asset => {
                const isOwned = state.ownedAssets.includes(asset.id);
                
                let displayCost = asset.cost;
                let subsidizedBy = "";

                if (state.activeSchemes.includes('pm_kusum') && asset.id === 'solar_pump') {
                    displayCost *= 0.5; subsidizedBy = "PM-KUSUM";
                } else if (state.activeSchemes.includes('per_drop') && asset.id === 'drip_irrigation') {
                    displayCost *= 0.5; subsidizedBy = "Per Drop";
                } else if (state.activeSchemes.includes('smam') && asset.id === 'mini_tractor') {
                    displayCost *= 0.5; subsidizedBy = "SMAM";
                }

                const canAfford = state.savings >= displayCost;

                return (
                    <div key={asset.id} className={`p-4 rounded-xl border-2 ${isOwned ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'}`}>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg">{t(asset.nameKey)}</h3>
                            {isOwned && <div className="bg-green-100 p-1 rounded-full"><Check className="text-green-600 w-4 h-4" /></div>}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{t(asset.descKey)}</p>
                        
                        <div className="flex justify-between items-center">
                            <div className="flex flex-col gap-1.5">
                                <div className="text-[10px] font-mono bg-gray-100 px-2 py-1 rounded text-gray-500">
                                    {t(asset.typeKey)}
                                </div>
                                {subsidizedBy && !isOwned && (
                                    <div className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-1 rounded w-fit border border-green-200">
                                        50% {subsidizedBy}
                                    </div>
                                )}
                            </div>
                            {isOwned ? (
                                <span className="text-sm font-bold text-green-700">OWNED</span>
                            ) : (
                                <button
                                    disabled={!canAfford}
                                    onClick={() => dispatch({ type: 'BUY_ASSET', payload: asset })}
                                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${canAfford ? 'bg-game-primary text-white shadow-md' : 'bg-gray-300 text-gray-500'}`}
                                >
                                    ₹{displayCost.toLocaleString()}
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
};