import React, { useState } from 'react';
import { useGame } from '../context/game-context';
import { useLanguage } from '../context/language-context';
import { Landmark, Lock, ArrowLeft, Coins, MapPin } from 'lucide-react';

export const BankScreen = () => {
    const { state, dispatch } = useGame();
    const { t } = useLanguage();
    
    const [fdAmount, setFdAmount] = useState(0);
    const [goldGrams, setGoldGrams] = useState(0);
    const [loanRepay, setLoanRepay] = useState(0);

    const goldRate = 6000; 

    return (
        <div className="h-full bg-gray-50 p-6 flex flex-col animate-slide-up overflow-y-auto">
             <div className="flex items-center gap-2 mb-6">
                <button onClick={() => dispatch({ type: 'GO_TO_DASHBOARD' })} className="p-2 bg-white rounded-full text-gray-600 hover:bg-gray-100 shadow-sm"><ArrowLeft className="w-5 h-5" /></button>
                <h2 className="text-2xl font-bold text-gray-800">{t('bank_title')}</h2>
             </div>

             <div className="bg-game-primary text-white p-6 rounded-2xl shadow-lg mb-6">
                <div className="opacity-80 text-sm">{t('bank_avail_bal')}</div>
                <div className="text-3xl font-bold font-mono">₹{state.savings.toLocaleString()}</div>
             </div>

             {/* LAND LOAN STATUS */}
             {state.landLoan.principal > 0 && (
                 <div className="bg-white p-5 rounded-xl shadow-sm mb-4 border-l-4 border-blue-600">
                     <h3 className="font-bold text-lg flex items-center gap-2 mb-2"><MapPin className="w-4 h-4 text-blue-600" /> {t('bank_land_loan')}</h3>
                     <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                         <div className="text-gray-500">{t('bank_principal_left')}</div>
                         <div className="font-bold">₹{state.landLoan.principal.toLocaleString()}</div>
                         <div className="text-gray-500">{t('bank_season_emi')}</div>
                         <div className="font-bold text-red-600">-₹{state.landLoan.seasonEmi.toLocaleString()}</div>
                     </div>
                     <div className="flex gap-2">
                        <input type="number" placeholder={t('bank_repay_prin')} className="border p-2 rounded w-full" onChange={(e) => setLoanRepay(Number(e.target.value))} />
                        <button 
                            onClick={() => dispatch({ type: 'BANK_TRANSACTION', payload: { type: 'PAY_LAND_PRINCIPAL', amount: loanRepay } })}
                            disabled={loanRepay > state.savings || loanRepay <= 0}
                            className="bg-blue-600 text-white px-4 py-2 rounded font-bold disabled:opacity-50"
                        >{t('bank_pay_btn')}</button>
                    </div>
                 </div>
             )}

             {/* FIXED DEPOSIT */}
             <div className="bg-white p-5 rounded-xl shadow-sm mb-4 border-l-4 border-green-500">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg flex items-center gap-2"><Lock className="w-4 h-4" /> {t('bank_fd')}</h3>
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold">{t('bank_fd_return')}</span>
                </div>
                {state.bankBalance.fixedDeposit > 0 ? (
                    <div className="bg-gray-100 p-3 rounded text-center text-sm font-bold text-gray-600">
                        {t('bank_locked')} ₹{state.bankBalance.fixedDeposit.toLocaleString()} <br/>
                        <span className="text-xs text-gray-500">({t('bank_matures')} {state.bankBalance.fdMaturitySeason})</span>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <input type="number" placeholder="₹" className="border p-2 rounded w-full" onChange={(e) => setFdAmount(Number(e.target.value))} />
                        <button 
                            onClick={() => dispatch({ type: 'BANK_TRANSACTION', payload: { type: 'DEPOSIT_FD', amount: fdAmount } })}
                            disabled={fdAmount > state.savings || fdAmount <= 0}
                            className="bg-green-600 text-white px-4 py-2 rounded font-bold disabled:opacity-50"
                        >{t('bank_invest_btn')}</button>
                    </div>
                )}
             </div>

             {/* GOLD INVESTMENT */}
             <div className="bg-white p-5 rounded-xl shadow-sm mb-4 border-l-4 border-yellow-500">
                 <h3 className="font-bold text-lg flex items-center gap-2 mb-2"><Coins className="w-4 h-4 text-yellow-600" /> {t('bank_gold')}</h3>
                 <div className="flex justify-between items-center bg-yellow-50 p-3 rounded mb-3">
                     <span className="text-sm text-yellow-800">{t('bank_gold_held')} {state.bankBalance.goldGrams}g</span>
                     <span className="font-bold text-yellow-700">{t('bank_rate')} ₹{goldRate}/g</span>
                 </div>
                 <div className="flex gap-2 items-center mb-2">
                    <input type="number" placeholder={t('bank_grams')} className="border p-2 rounded w-20" onChange={(e) => setGoldGrams(Number(e.target.value))} />
                    <button 
                        onClick={() => dispatch({ type: 'BANK_TRANSACTION', payload: { type: 'BUY_GOLD', amount: goldGrams * goldRate, grams: goldGrams } })}
                        disabled={(goldGrams * goldRate) > state.savings || goldGrams <= 0}
                        className="bg-yellow-600 text-white px-3 py-2 rounded text-sm font-bold flex-grow disabled:opacity-50"
                    >{t('bank_buy_btn')}</button>
                     <button 
                        onClick={() => dispatch({ type: 'BANK_TRANSACTION', payload: { type: 'SELL_GOLD', amount: goldGrams * goldRate, grams: goldGrams } })}
                        disabled={state.bankBalance.goldGrams < goldGrams || goldGrams <= 0}
                        className="bg-white border border-yellow-600 text-yellow-600 px-3 py-2 rounded text-sm font-bold flex-grow disabled:opacity-50"
                    >{t('bank_sell_btn')}</button>
                 </div>
             </div>
        </div>
    );
};