import React, { useMemo } from 'react';
import { useGame } from '../context/game-context';
import { useLanguage } from '../context/language-context';
import { generateMarketOptions } from '../engine/market-engine';
import { Truck, MapPin, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';

export const MarketScreen = () => {
    const { state, dispatch } = useGame();
    const { t } = useLanguage();
    
    const mandis = useMemo(() => generateMarketOptions(), [state.seasonNumber]);

    if (!state.currentCrop) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
                    <AlertCircle className="w-10 h-10 text-orange-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('market_no_harvest')}</h2>
                <p className="text-gray-500 mb-8 max-w-sm leading-relaxed">{t('market_no_harvest_desc')}</p>
                <button 
                    onClick={() => dispatch({ type: 'GO_TO_DASHBOARD' })}
                    className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:from-orange-700 hover:to-amber-700 active:scale-95 transition-all shadow-lg"
                >
                    <ArrowRight className="w-5 h-5 rotate-180" />
                    {t('market_return')}
                </button>
            </div>
        );
    }

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
        <div className="min-h-screen bg-gray-50 pb-10">
            {/* Header */}
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-orange-700 to-amber-800"></div>
                <div className="relative px-6 py-12 text-white text-center">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-4 ring-4 ring-white/30">
                        <Truck className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-bold mb-2">{t('ui_harvest_ready')}</h2>
                    <p className="text-orange-100 font-medium max-w-md mx-auto">
                        {t('ui_where_sell').replace('{val}', t(state.currentCrop.nameKey))}
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 px-4 -mt-6 space-y-4">
                {/* Farm Info Card */}
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-5">
                    <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">{t('ui_total_land')}</span>
                            <span className="font-bold text-lg text-gray-900">{state.totalAcres} {t('ui_acres')}</span>
                        </div>
                        <div>
                            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block mb-1">{t('ui_base_price')}</span>
                            <span className="font-bold text-lg text-green-700 font-mono">₹{basePrice.toLocaleString()}/{t('ui_per_unit')}</span>
                        </div>
                    </div>
                    
                    {state.cumulativeYield < 0.8 && (
                        <div className="bg-red-50 text-red-700 p-3 rounded-xl flex items-center gap-2 border border-red-200">
                            <AlertCircle className="w-5 h-5 flex-shrink-0"/> 
                            <span className="text-sm font-medium">{t('ui_yield_warning')}</span>
                        </div>
                    )}
                </div>

                {/* Mandis List */}
                <h3 className="font-bold text-gray-800 uppercase text-sm tracking-wider px-1 pt-2">{t('ui_select_mandi')}</h3>
                
                {mandis.map(mandi => {
                    const finalPricePreview = basePrice * state.cumulativePrice * mandi.priceMultiplier;
                    const estGross = Math.floor(estimatedYieldUnits * finalPricePreview);
                    const totalTransport = mandi.transportCostPerAcre * state.totalAcres;
                    const estNet = estGross - totalTransport;

                    return (
                        <button 
                            key={mandi.id}
                            onClick={() => handleSell(mandi)}
                            className="w-full bg-white rounded-3xl border-2 border-gray-200 shadow-md hover:shadow-xl hover:border-green-300 active:scale-98 transition-all overflow-hidden"
                        >
                            <div className="p-5">
                                {/* Mandi Header */}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                                            <MapPin className="w-6 h-6 text-orange-600" />
                                        </div>
                                        <div className="text-left">
                                            <h4 className="font-bold text-lg text-gray-800">{t(mandi.nameKey)}</h4>
                                            <p className="text-xs text-gray-500 line-clamp-1">{t(mandi.descKey)}</p>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                                      mandi.priceMultiplier >= 1.2 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {(mandi.priceMultiplier * 100).toFixed(0)}%
                                    </div>
                                </div>
                                
                                {/* Financial Breakdown */}
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-2xl border border-gray-200">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600 font-medium">{t('ui_est_gross')}</span>
                                            <span className="font-bold text-gray-900 font-mono">₹{estGross.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm pb-2 border-b border-gray-200">
                                            <span className="text-red-500 font-medium">{t('ui_transport_cost')}</span>
                                            <span className="text-red-600 font-bold font-mono">- ₹{totalTransport.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-1">
                                            <span className="text-gray-700 font-bold">{t('ui_est_net')}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-green-600 font-bold text-lg font-mono">₹{estNet.toLocaleString()}</span>
                                                <ArrowRight className="w-5 h-5 text-green-600" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};