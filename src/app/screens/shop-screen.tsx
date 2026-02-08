import React from 'react';
import { useGame } from '../context/game-context';
import { ASSETS } from '../data/game-scenarios';
import { ArrowLeft, Check, ShoppingBag } from 'lucide-react';

export const ShopScreen = () => {
  const { state, dispatch } = useGame();

  return (
    <div className="h-full bg-game-bg p-6 flex flex-col animate-slide-up">
        <div className="flex justify-between items-center mb-6">
             <button onClick={() => dispatch({ type: 'GO_TO_DASHBOARD' })} className="flex items-center gap-2 text-gray-600">
                <ArrowLeft className="w-5 h-5" /> Back
            </button>
            <div className="bg-white px-4 py-2 rounded-full font-bold text-game-primary text-sm shadow-sm">
                ₹{state.savings.toLocaleString()}
            </div>
        </div>

        <div className="flex items-center gap-3 mb-2">
            <ShoppingBag className="w-8 h-8 text-game-primary" />
            <h2 className="text-2xl font-bold text-game-primary">Agri-Store</h2>
        </div>
        <p className="text-gray-500 mb-6">Invest in assets to reduce future risks.</p>

        <div className="space-y-4 overflow-y-auto pb-20">
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
                                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${canAfford ? 'bg-game-primary text-white shadow-md hover:scale-105' : 'bg-gray-300 text-gray-500'}`}
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