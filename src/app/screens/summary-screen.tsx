import React from 'react';
import { useGame } from '../context/game-context';
import { useLanguage } from '../context/language-context'; // NEW
import { Trophy, TrendingUp, AlertTriangle, UserCheck, Clock, RefreshCw, MapPin, Target } from 'lucide-react';

export const SummaryScreen = () => {
    const { dispatch, state } = useGame();
    const { t } = useLanguage(); // NEW

    const calculatePersona = () => {
        const { savings, debt, totalAcres, achievedGoals, financialGoal, bankBalance, creditScore } = state;
        const goldValue = bankBalance.goldGrams * 6000;
        const totalWealth = savings + bankBalance.fixedDeposit + goldValue;
        const hasMainGoal = financialGoal && achievedGoals.includes(financialGoal.id);
        const expandedLand = totalAcres >= 5;

        // Returns keys and optional values for injection
        if (debt > 50000) return { tKey: "per_debt_t", dKey: "per_debt_d", val: debt.toLocaleString(), color: "text-red-600", bg: "bg-red-50", icon: <AlertTriangle className="w-12 h-12 text-red-500" /> };
        if (hasMainGoal && totalWealth > 500000) return { tKey: "per_ratna_t", dKey: "per_ratna_d", val: "", color: "text-green-700", bg: "bg-green-100", icon: <Trophy className="w-12 h-12 text-green-600" /> };
        if (hasMainGoal) return { tKey: "per_dream_t", dKey: "per_dream_d", val: financialGoal ? t(financialGoal.nameKey) : "", color: "text-purple-600", bg: "bg-purple-100", icon: <Target className="w-12 h-12 text-purple-600" /> };
        if (expandedLand) return { tKey: "per_zamin_t", dKey: "per_zamin_d", val: totalAcres.toString(), color: "text-blue-800", bg: "bg-blue-100", icon: <MapPin className="w-12 h-12 text-blue-700" /> };
        if (totalWealth > 300000) return { tKey: "per_invest_t", dKey: "per_invest_d", val: "", color: "text-emerald-600", bg: "bg-emerald-50", icon: <TrendingUp className="w-12 h-12 text-emerald-600" /> };
        if (creditScore > 800) return { tKey: "per_bank_t", dKey: "per_bank_d", val: "", color: "text-yellow-600", bg: "bg-yellow-50", icon: <UserCheck className="w-12 h-12 text-yellow-600" /> };
        
        return { tKey: "per_survive_t", dKey: "per_survive_d", val: state.maxSeasons.toString(), color: "text-gray-600", bg: "bg-gray-100", icon: <Clock className="w-12 h-12 text-gray-500" /> };
    };

    const persona = calculatePersona();
    const goldValue = state.bankBalance.goldGrams * 6000;
    const finalNetWorth = state.savings + state.bankBalance.fixedDeposit + goldValue;

    return (
        <div className="h-full p-6 bg-game-bg flex flex-col overflow-y-auto animate-fade-in">
             <div className="text-center mb-8 mt-4 flex flex-col items-center">
                <div className="inline-block p-4 bg-white rounded-full mb-4 shadow-md">
                    {persona.icon}
                </div>
                <h1 className="text-3xl font-bold text-game-primary">{t('sum_complete')}</h1>
             </div>

             <div className={`w-full ${persona.bg} p-6 rounded-2xl border-2 border-white shadow-lg mb-6 text-center`}>
                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{t('sum_identity')}</h2>
                <div className={`text-3xl font-bold ${persona.color} mb-3`}>{t(persona.tKey)}</div>
                <p className="text-gray-700 text-sm leading-relaxed">{t(persona.dKey, { val: persona.val })}</p>
             </div>

             <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
                 <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase border-b pb-2">{t('sum_report')}</h3>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="text-xs text-gray-400">{t('sum_networth')}</div>
                        <div className="text-lg font-bold text-game-primary">₹{finalNetWorth.toLocaleString()}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-400">{t('sum_land')}</div>
                        <div className="text-lg font-bold">{state.totalAcres} {t('ui_acres')}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-400">{t('sum_goals')}</div>
                        <div className="text-lg font-bold">{state.achievedGoals.length}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-400">{t('sum_final_debt')}</div>
                        <div className={`text-lg font-bold ${state.debt > 0 ? 'text-red-500' : 'text-green-500'}`}>
                            ₹{state.debt.toLocaleString()}
                        </div>
                    </div>
                 </div>
             </div>

             <button 
                onClick={() => dispatch({ type: 'RESET_GAME' })} 
                className="w-full bg-game-primary text-white py-4 rounded-xl font-bold shadow-lg hover:bg-game-primaryDark transition-all flex items-center justify-center gap-2"
            >
                <RefreshCw className="w-5 h-5" /> {t('sum_restart')}
            </button>
        </div>
    );
};