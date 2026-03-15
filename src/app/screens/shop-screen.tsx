import React, { useState } from 'react';
import { useGame } from '../context/game-context';
import { useLanguage } from '../context/language-context';
import { ASSETS } from '../data/game-scenarios';
import { ArrowLeft, Check, ShoppingBag, Map, MapPin } from 'lucide-react';

export const ShopScreen = () => {
  const { state, dispatch } = useGame();
  const { t } = useLanguage();

  const LAND_PRICE_PER_ACRE = 200000; 
  const LAND_DOWN_PAYMENT_PCT = 0.2; 
  const downPayment = LAND_PRICE_PER_ACRE * LAND_DOWN_PAYMENT_PCT;
  const loanAmount = LAND_PRICE_PER_ACRE - downPayment;

// STRICT BANK RULE: You cannot buy more land if you have ANY outstanding debt.
  const hasExistingDebt = state.debt > 0 || state.landLoan.principal > 0; 
  const canAffordUpfront = state.savings >= 40000;
  const canBuyLand = canAffordUpfront && !hasExistingDebt;

  // State for our custom confirmation modal
  const [showLandModal, setShowLandModal] = useState(false);

  const handleBuyLandConfirm = () => {
      dispatch({ type: 'BUY_LAND', payload: { acres: 1, cost: LAND_PRICE_PER_ACRE, downPayment } });
      setShowLandModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
        {/* MODERN HEADER */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-emerald-700 to-green-800"></div>
          <div className="relative px-6 py-6 text-white">
            <div className="flex justify-between items-center mb-4">
                <button 
                  onClick={() => dispatch({ type: 'GO_TO_DASHBOARD' })} 
                  className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl hover:bg-white/30 transition-all active:scale-95"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-semibold">Back</span>
                </button>
            </div>

            <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center ring-2 ring-white/30">
                  <ShoppingBag className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{t('shop')}</h2>
                  <p className="text-sm text-teal-100 font-medium">Invest in your farm's future</p>
                </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
                <div className="text-xs font-semibold text-teal-100 uppercase tracking-wider mb-1">Available Savings</div>
                <div className="text-3xl font-bold font-mono">₹{state.savings.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="relative z-10 px-4 -mt-4 space-y-4 overflow-y-auto pb-10">
            
            {/* BUY LAND SECTION */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-5 text-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                            <Map className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Expand Farm</h3>
                            <p className="text-xs text-amber-100 font-medium">+1 Acre of Land</p>
                        </div>
                    </div>
                </div>
                <div className="p-5">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Total Cost</div>
                            <div className="text-xl font-bold text-gray-900 font-mono">₹{LAND_PRICE_PER_ACRE.toLocaleString()}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Down Payment (20%)</div>
                            <div className="text-xl font-bold text-orange-600 font-mono">₹{downPayment.toLocaleString()}</div>
                        </div>
                    </div>
                    <button 
                        disabled={state.savings < downPayment}
                        onClick={() => setShowLandModal(true)}
                        className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
                            state.savings >= downPayment 
                                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg hover:from-orange-600 hover:to-amber-600 active:scale-95' 
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        <MapPin className="w-5 h-5" />
                        {state.savings >= downPayment ? 'Buy Land (Financed)' : `Need ₹${(downPayment - state.savings).toLocaleString()} more`}
                    </button>
                </div>
            </div>

            {/* ASSETS SECTION */}
            <h3 className="font-bold text-gray-800 uppercase text-sm tracking-wider px-1 pt-2">Equipment & Assets</h3>
            
            {ASSETS.map(asset => {
                const isOwned = state.ownedAssets.includes(asset.id);
                
                let displayCost = asset.cost;
                let subsidizedBy = "";

                if (state.activeSchemes.includes('pm_kusum') && asset.id === 'solar_pump') {
                    displayCost *= 0.5; subsidizedBy = "PM-KUSUM (50% Off)";
                } else if (state.activeSchemes.includes('per_drop') && asset.id === 'drip_irrigation') {
                    displayCost *= 0.5; subsidizedBy = "Per Drop (50% Off)";
                } else if (state.activeSchemes.includes('smam') && asset.id === 'mini_tractor') {
                    displayCost *= 0.5; subsidizedBy = "SMAM (50% Off)";
                }

                const canAfford = state.savings >= displayCost;

                return (
                    <div key={asset.id} className={`relative overflow-hidden rounded-3xl border-2 transition-all p-5 ${
                        isOwned ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-sm' : 'bg-white border-gray-100 shadow-md'
                    }`}>
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900">{t(asset.nameKey)}</h3>
                                <div className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded w-fit mt-1">
                                    {t(asset.typeKey)}
                                </div>
                            </div>
                            {isOwned && (
                                <div className="bg-green-100 p-2 rounded-full">
                                    <Check className="text-green-600 w-5 h-5" />
                                </div>
                            )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-4">{t(asset.descKey)}</p>
                        
                        <div className="flex justify-between items-end">
                            <div>
                                {subsidizedBy && !isOwned && (
                                    <div className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-lg border border-green-200 mb-1">
                                        {subsidizedBy}
                                    </div>
                                )}
                                {!isOwned && (
                                    <div className="text-xl font-bold font-mono text-gray-900">₹{displayCost.toLocaleString()}</div>
                                )}
                            </div>
                            
                            {isOwned ? (
                                <span className="text-sm font-bold text-green-700 px-4 py-2 bg-green-100/50 rounded-xl">OWNED</span>
                            ) : (
                                <button
                                    disabled={!canAfford}
                                    onClick={() => dispatch({ type: 'BUY_ASSET', payload: asset })}
                                    className={`px-6 py-3 rounded-xl font-bold transition-all shadow-sm ${
                                        canAfford 
                                            ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:from-teal-700 hover:to-emerald-700 active:scale-95' 
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    Buy
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>

        {/* CUSTOM MODAL FOR LAND PURCHASE */}
        {showLandModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 animate-scale-in">
                    <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Map className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-center text-gray-900 mb-2">Purchase 1 Acre?</h3>
                    <p className="text-center text-gray-600 mb-6 text-sm">
                        You will pay <span className="font-bold text-gray-900">₹{downPayment.toLocaleString()}</span> upfront. The remaining <span className="font-bold text-gray-900">₹{loanAmount.toLocaleString()}</span> will be added to your land loan.
                    </p>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setShowLandModal(false)}
                            className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleBuyLandConfirm}
                            className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 transition-all shadow-lg"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};