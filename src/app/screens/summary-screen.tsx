import React from 'react';
import { useGame } from '../context/game-context';
import { useLanguage } from '../context/language-context';
import { Trophy, TrendingUp, AlertTriangle, UserCheck, Clock, RefreshCw, MapPin, Target, Coins, Award } from 'lucide-react';

export const SummaryScreen = () => {
    const { dispatch, state } = useGame();
    const { t } = useLanguage();

    const calculatePersona = () => {
        const { savings, debt, totalAcres, achievedGoals, financialGoal, bankBalance, creditScore } = state;
        const goldValue = bankBalance.goldGrams * 6000;
        const totalWealth = savings + bankBalance.fixedDeposit + goldValue;
        const hasMainGoal = financialGoal && achievedGoals.includes(financialGoal.id);
        const expandedLand = totalAcres >= 5;

        if (debt > 50000) return { 
            tKey: "per_debt_t", dKey: "per_debt_d", val: debt.toLocaleString(), 
            icon: <AlertTriangle className="w-12 h-12" />, gradient: 'from-red-600 to-pink-600' 
        };
        if (hasMainGoal && totalWealth > 500000) return { 
            tKey: "per_ratna_t", dKey: "per_ratna_d", val: "", 
            icon: <Trophy className="w-12 h-12" />, gradient: 'from-yellow-600 to-amber-600' 
        };
        if (hasMainGoal) return { 
            tKey: "per_dream_t", dKey: "per_dream_d", val: financialGoal ? t(financialGoal.nameKey) : "", 
            icon: <Target className="w-12 h-12" />, gradient: 'from-purple-600 to-pink-600' 
        };
        if (expandedLand) return { 
            tKey: "per_zamin_t", dKey: "per_zamin_d", val: totalAcres.toString(), 
            icon: <MapPin className="w-12 h-12" />, gradient: 'from-blue-600 to-indigo-600' 
        };
        if (totalWealth > 300000) return { 
            tKey: "per_invest_t", dKey: "per_invest_d", val: "", 
            icon: <TrendingUp className="w-12 h-12" />, gradient: 'from-emerald-600 to-green-600' 
        };
        if (creditScore > 800) return { 
            tKey: "per_bank_t", dKey: "per_bank_d", val: "", 
            icon: <UserCheck className="w-12 h-12" />, gradient: 'from-green-600 to-emerald-600' 
        };
        
        return { 
            tKey: "per_survive_t", dKey: "per_survive_d", val: state.maxSeasons.toString(), 
            icon: <Clock className="w-12 h-12" />, gradient: 'from-gray-600 to-gray-700' 
        };
    };

    const persona = calculatePersona();
    const goldValue = state.bankBalance.goldGrams * 6000;
    const finalNetWorth = state.savings + state.bankBalance.fixedDeposit + goldValue;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col overflow-y-auto animate-fade-in pb-10">
            {/* Celebration Header */}
            <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${persona.gradient}`}></div>
                <div className="relative px-6 py-12 text-white text-center">
                    <div className={`w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-4 ring-4 ring-white/30 shadow-xl text-white`}>
                        {persona.icon}
                    </div>
                    <h1 className="text-3xl font-bold mb-2">{t('sum_complete')}</h1>
                    <p className="text-sm opacity-90 font-medium">You completed {state.maxSeasons} seasons</p>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 px-6 -mt-6 space-y-6">
                {/* Persona Card */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className={`bg-gradient-to-r ${persona.gradient} p-6 text-white text-center`}>
                        <h2 className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">{t('sum_identity')}</h2>
                        <div className="text-3xl font-bold mb-3">{t(persona.tKey)}</div>
                    </div>
                    <div className="p-6">
                        <p className="text-gray-700 leading-relaxed text-center">{t(persona.dKey, { val: persona.val })}</p>
                    </div>
                </div>

                {/* Final Report */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
                    <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider border-b pb-3 mb-4">{t('sum_report')}</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-200">
                            <div className="flex items-center gap-2 mb-1">
                                <Coins className="w-4 h-4 text-green-600" />
                                <div className="text-xs text-green-700 font-semibold uppercase tracking-wider">{t('sum_networth')}</div>
                            </div>
                            <div className="text-2xl font-bold text-green-900 font-mono">₹{finalNetWorth.toLocaleString()}</div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-200">
                            <div className="flex items-center gap-2 mb-1">
                                <MapPin className="w-4 h-4 text-blue-600" />
                                <div className="text-xs text-blue-700 font-semibold uppercase tracking-wider">{t('sum_land')}</div>
                            </div>
                            <div className="text-2xl font-bold text-blue-900 font-mono">{state.totalAcres} {t('ui_acres')}</div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-2xl border border-purple-200">
                            <div className="flex items-center gap-2 mb-1">
                                <Target className="w-4 h-4 text-purple-600" />
                                <div className="text-xs text-purple-700 font-semibold uppercase tracking-wider">{t('sum_goals')}</div>
                            </div>
                            <div className="text-2xl font-bold text-purple-900 font-mono">{state.achievedGoals.length}</div>
                        </div>

                        <div className={`p-4 rounded-2xl border ${
                            state.debt > 0 
                                ? 'bg-gradient-to-br from-red-50 to-pink-50 border-red-200' 
                                : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
                        }`}>
                            <div className="flex items-center gap-2 mb-1">
    <Award className={`w-4 h-4 ${state.debt > 0 ? 'text-red-600' : 'text-green-600'}`} />
    <div className={`text-xs font-semibold uppercase tracking-wider ${
                                    state.debt > 0 ? 'text-red-700' : 'text-green-700'
                                }`}>{t('sum_final_debt')}</div>
                            </div>
                            <div className={`text-2xl font-bold font-mono ${
                                state.debt > 0 ? 'text-red-900' : 'text-green-900'
                            }`}>
                                {state.debt > 0 ? `₹${state.debt.toLocaleString()}` : 'Debt Free'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Achievements Summary */}
                {state.achievedGoals.length > 0 && (
                    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-3xl shadow-xl border border-yellow-200 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Trophy className="w-6 h-6 text-yellow-600" />
                            <h3 className="font-bold text-yellow-900">Goals Achieved</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {state.achievedGoals.map((goalId, idx) => (
                                <div 
                                    key={idx} 
                                    className="bg-white px-4 py-2 rounded-xl shadow-sm border border-yellow-200 text-sm font-bold text-yellow-800"
                                >
                                    Goal #{idx + 1}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Restart Button */}
                <button 
                    onClick={() => dispatch({ type: 'RESET_GAME' })} 
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-5 rounded-2xl font-bold shadow-lg hover:from-green-700 hover:to-emerald-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    <RefreshCw className="w-5 h-5" />
                    {t('sum_restart')}
                </button>
            </div>
        </div>
    );
};
