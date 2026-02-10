import React from 'react';
import { useGame } from '../context/game-context';
import { ASSETS } from '../data/game-scenarios';
import { ArrowLeft, Check, ShoppingBag, Map } from 'lucide-react';

export const ShopScreen = () => {
  const { state, dispatch } = useGame();

  const LAND_PRICE_PER_ACRE = 200000; // 2 Lakhs
  const LAND_DOWN_PAYMENT_PCT = 0.2; // 20% down

  const handleBuyLand = () => {
      const downPayment = LAND_PRICE_PER_ACRE * LAND_DOWN_PAYMENT_PCT;
      if(state.savings >= downPayment) {
          if(confirm(`Buy 1 Acre? Down Payment: ₹${downPayment.toLocaleString()}. Remaining ₹${(LAND_PRICE_PER_ACRE - downPayment).toLocaleString()} will be a loan.`)) {
              dispatch({ type: 'BUY_LAND', payload: { acres: 1, cost: LAND_PRICE_PER_ACRE, downPayment } });
          }
      }
  };

  return (
    <div className="h-full bg-game-bg p-6 flex flex-col animate-slide-up overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
             <button onClick={() => dispatch({ type: 'GO_TO_DASHBOARD' })} className="flex items-center gap-2 text-gray-600">
                <ArrowLeft className="w-5 h-5" /> Back
            </button>
            <div className="bg-white px-4 py-2 rounded-full font-bold text-game-primary text-sm shadow-sm">
                ₹{state.savings.toLocaleString()}
            </div>
        </div>

        {/* LAND EXPANSION CARD */}
        <div className="bg-gradient-to-r from-green-700 to-green-600 text-white p-5 rounded-xl shadow-lg mb-6">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg flex items-center gap-2"><Map className="w-5 h-5" /> Expand Farm</h3>
                <span className="text-xs bg-white/20 px-2 py-1 rounded">Current: {state.totalAcres} Acres</span>
            </div>
            <p className="text-sm opacity-90 mb-4">Buy 1 Acre to increase profit potential. Includes Bank Loan.</p>
            <div className="flex justify-between items-center">
                <div className="text-xs">
                    <div>Price: ₹{LAND_PRICE_PER_ACRE.toLocaleString()}</div>
                    <div>Down Pay: ₹{(LAND_PRICE_PER_ACRE * LAND_DOWN_PAYMENT_PCT).toLocaleString()}</div>
                </div>
                <button 
                    onClick={handleBuyLand}
                    disabled={state.savings < (LAND_PRICE_PER_ACRE * LAND_DOWN_PAYMENT_PCT)}
                    className="bg-white text-green-700 px-4 py-2 rounded font-bold text-sm disabled:opacity-50"
                >
                    Buy 1 Acre
                </button>
            </div>
        </div>

        <div className="flex items-center gap-3 mb-2">
            <ShoppingBag className="w-8 h-8 text-game-primary" />
            <h2 className="text-2xl font-bold text-game-primary">Asset Store</h2>
        </div>
        
        <div className="space-y-4 pb-20">
            {ASSETS.map(asset => {
                const isOwned = state.ownedAssets.includes(asset.id);
                const canAfford = state.savings >= asset.cost;

                return (
                    <div key={asset.id} className={`p-4 rounded-xl border-2 ${isOwned ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'}`}>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg">{asset.name}</h3>
                            {isOwned && <div className="bg-green-100 p-1 rounded-full"><Check className="text-green-600 w-4 h-4" /></div>}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{asset.description}</p>
                        
                        <div className="flex justify-between items-center">
                            <div className="text-[10px] font-mono bg-gray-100 px-2 py-1 rounded text-gray-500">
                                {asset.type}
                            </div>
                            {isOwned ? (
                                <span className="text-sm font-bold text-green-700">OWNED</span>
                            ) : (
                                <button
                                    disabled={!canAfford}
                                    onClick={() => dispatch({ type: 'BUY_ASSET', payload: asset })}
                                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${canAfford ? 'bg-game-primary text-white shadow-md' : 'bg-gray-300 text-gray-500'}`}
                                >
                                    Buy ₹{asset.cost.toLocaleString()}
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