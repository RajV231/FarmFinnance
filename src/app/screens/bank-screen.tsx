import React, { useState } from 'react';
import { useGame } from '../context/game-context';
import { useLanguage } from '../context/language-context';
import { Landmark, Lock, ArrowLeft, Coins, MapPin, TrendingUp, Info, AlertCircle } from 'lucide-react';

export const BankScreen = () => {
    const { state, dispatch } = useGame();
    const { t } = useLanguage();
    
    const [fdAmount, setFdAmount] = useState(0);
    const [goldGrams, setGoldGrams] = useState(0);
    const [loanRepay, setLoanRepay] = useState(0);
    const [cropRepay, setCropRepay] = useState(0);

    const goldRate = state.currentGoldPrice || 6200;

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* MODERN HEADER */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-green-700 to-emerald-800"></div>
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
                      <Landmark className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{t('bank_title')}</h2>
                      <p className="text-sm text-green-100 font-medium">Manage your finances</p>
                    </div>
                </div>

                {/* Balance Display */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
                    <div className="text-xs font-semibold text-green-100 uppercase tracking-wider mb-1">{t('bank_avail_bal')}</div>
                    <div className="text-3xl font-bold font-mono">₹{state.savings.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* CONTENT */}
            <div className="relative z-10 px-4 -mt-4 space-y-4 overflow-y-auto pb-10">
                {/* CROP / FARMING DEBT STATUS */}
                {state.debt > 0 && (
                    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden mb-4 animate-fade-in">
                        <div className="bg-gradient-to-r from-red-500 to-rose-600 p-5 text-white">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                    <AlertCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Crop & Event Debt</h3>
                                    <p className="text-xs text-red-100 font-medium">Outstanding loans & overdrafts</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="bg-gray-50 p-3 rounded-xl mb-4">
                                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Total Outstanding</div>
                                <div className="text-xl font-bold text-red-600 font-mono">₹{state.debt.toLocaleString()}</div>
                            </div>
                            <div className="flex gap-2">
                                <input 
                                    type="number" min="0" 
                                    onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                                    placeholder="Repay Amount" 
                                    className="flex-1 border-2 border-gray-200 p-3 rounded-xl focus:border-red-500 focus:outline-none font-mono" 
                                    onChange={(e) => setCropRepay(Math.max(0, parseInt(e.target.value) || 0))} 
                                    value={cropRepay || ''}
                                />
                                <button 
                                    onClick={() => {
                                        dispatch({ type: 'REPAY_LOAN', payload: { amount: cropRepay, type: cropRepay >= state.debt ? 'FULL' : 'PARTIAL' } });
                                        setCropRepay(0);
                                    }}
                                    disabled={cropRepay > state.savings || cropRepay <= 0}
                                    className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-6 py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:from-red-700 hover:to-rose-700 active:scale-95 transition-all"
                                >Pay Debt</button>
                            </div>
                        </div>
                    </div>
                )}
                {/* LAND LOAN STATUS */}
                {state.landLoan.principal > 0 && (
                    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                  <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                  <h3 className="font-bold text-lg">{t('bank_land_loan')}</h3>
                                  <p className="text-xs text-blue-100 font-medium">Active loan on your land</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-gray-50 p-3 rounded-xl">
                                    <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">{t('bank_principal_left')}</div>
                                    <div className="text-xl font-bold text-gray-900 font-mono">₹{state.landLoan.principal.toLocaleString()}</div>
                                </div>
                                <div className="bg-red-50 p-3 rounded-xl">
                                    <div className="text-xs text-red-600 font-semibold uppercase tracking-wider mb-1">{t('bank_season_emi')}</div>
                                    <div className="text-xl font-bold text-red-700 font-mono">₹{state.landLoan.seasonEmi.toLocaleString()}</div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <input 
  type="number" 
  min="0"
  onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
  placeholder={t('bank_repay_prin')} 
  className="flex-1 border-2 border-gray-200 p-3 rounded-xl focus:border-blue-500 focus:outline-none font-mono" 
  onChange={(e) => setLoanRepay(Math.max(0, parseInt(e.target.value) || 0))} 
  value={loanRepay || ''}
/>
                                <button 
                                    onClick={() => dispatch({ type: 'BANK_TRANSACTION', payload: { type: 'PAY_LAND_PRINCIPAL', amount: loanRepay } })}
                                    disabled={loanRepay > state.savings || loanRepay <= 0}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-indigo-700 active:scale-95 transition-all"
                                >{t('bank_pay_btn')}</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* FIXED DEPOSIT */}
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-5 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                  <Lock className="w-6 h-6" />
                                </div>
                                <div>
                                  <h3 className="font-bold text-lg">{t('bank_fd')}</h3>
                                  <p className="text-xs text-green-100 font-medium">Lock your savings for growth</p>
                                </div>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30">
                                <span className="text-xs font-bold">{t('bank_fd_return')}</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-5">
                        {state.bankBalance.fixedDeposit > 0 ? (
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-2xl border border-green-200 text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <Lock className="w-5 h-5 text-green-600" />
                                    <span className="text-sm font-bold text-green-700 uppercase tracking-wider">{t('bank_locked')}</span>
                                </div>
                                <div className="text-3xl font-bold text-green-900 font-mono mb-1">₹{state.bankBalance.fixedDeposit.toLocaleString()}</div>
                                <div className="text-xs text-green-600 font-medium">
                                    {t('bank_matures')} Season {state.bankBalance.fdMaturitySeason}
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 flex items-start gap-2">
                                    <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-blue-800 font-medium">Earn 10% interest over 2 seasons. Safe and reliable growth.</p>
                                </div>
                                <div className="flex gap-2">
                                    <input 
  type="number" 
  min="0"
  onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
  placeholder="₹ Amount" 
  className="flex-1 border-2 border-gray-200 p-3 rounded-xl focus:border-green-500 focus:outline-none font-mono" 
  onChange={(e) => setFdAmount(Math.max(0, parseInt(e.target.value) || 0))} 
  value={fdAmount || ''}
/>
                                    <button 
                                        onClick={() => dispatch({ type: 'BANK_TRANSACTION', payload: { type: 'DEPOSIT_FD', amount: fdAmount } })}
                                        disabled={fdAmount > state.savings || fdAmount <= 0}
                                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-700 hover:to-emerald-700 active:scale-95 transition-all"
                                    >{t('bank_invest_btn')}</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* GOLD INVESTMENT */}
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-500 to-yellow-500 p-5 text-white">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                              <Coins className="w-6 h-6" />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg">{t('bank_gold')}</h3>
                              <p className="text-xs text-amber-100 font-medium">Hedge against inflation</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-5">
                        {/* Current Holdings */}
                        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-4 rounded-2xl border border-amber-200 mb-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <span className="text-xs text-amber-700 font-semibold uppercase tracking-wider block mb-1">{t('bank_gold_held')}</span>
                                    <span className="text-2xl font-bold text-amber-900 font-mono">{state.bankBalance.goldGrams}g</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-amber-700 font-semibold uppercase tracking-wider block mb-1">{t('bank_rate')}</span>
                                    <span className="text-xl font-bold text-amber-900 font-mono">₹{goldRate}/g</span>
                                </div>
                            </div>
                        </div>

                        {/* Buy/Sell Controls */}
                        <div className="space-y-3">
                            <div className="flex gap-2 items-center">
                                <input 
  type="number" 
  min="0"
  onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
  placeholder="Grams" 
  className="w-24 border-2 border-gray-200 p-3 rounded-xl focus:border-amber-500 focus:outline-none font-mono text-center" 
  onChange={(e) => setGoldGrams(Math.max(0, parseInt(e.target.value) || 0))} 
  value={goldGrams || ''}
/>
                                <span className="text-sm text-gray-500 font-medium">×</span>
                                <div className="flex-1 bg-gray-50 p-3 rounded-xl">
                                    <span className="text-sm text-gray-600 font-medium">Total: </span>
                                    <span className="text-lg font-bold text-gray-900 font-mono">₹{(goldGrams * goldRate).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <button 
                                    onClick={() => dispatch({ type: 'BANK_TRANSACTION', payload: { type: 'BUY_GOLD', amount: goldGrams * goldRate, grams: goldGrams } })}
                                    disabled={(goldGrams * goldRate) > state.savings || goldGrams <= 0}
                                    className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:from-amber-600 hover:to-yellow-600 active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    <TrendingUp className="w-4 h-4" />
                                    {t('bank_buy_btn')}
                                </button>
                                <button 
                                    onClick={() => dispatch({ type: 'BANK_TRANSACTION', payload: { type: 'SELL_GOLD', amount: goldGrams * goldRate, grams: goldGrams } })}
                                    disabled={state.bankBalance.goldGrams < goldGrams || goldGrams <= 0}
                                    className="bg-white border-2 border-amber-500 text-amber-600 py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-50 active:scale-95 transition-all"
                                >{t('bank_sell_btn')}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
