import React from 'react';
import { useGame } from '../context/game-context';
import { useLanguage } from '../context/language-context'; // NEW
import { GOALS, FinancialGoal } from '../data/game-scenarios'; 
import { Target, Home, GraduationCap, Tractor, CheckCircle, Lock, ArrowLeft, Heart } from 'lucide-react';

export const GoalsScreen = () => {
    const { state, dispatch } = useGame();
    const { t } = useLanguage(); // NEW

    const handleAchieve = (goal: FinancialGoal, isMain: boolean) => {
        if (window.confirm(t('goals_confirm_purchase', { cost: goal.targetAmount.toLocaleString(), name: t(goal.nameKey) }))) {
            dispatch({ type: 'ACHIEVE_GOAL', payload: { goal, isMain } });
        }
    };

    const getIcon = (id: string) => {
        if(id.includes('education')) return <GraduationCap className="w-6 h-6" />;
        if(id.includes('tractor')) return <Tractor className="w-6 h-6" />;
        if(id.includes('house')) return <Home className="w-6 h-6" />;
        if(id.includes('wedding')) return <Heart className="w-6 h-6" />;
        return <Target className="w-6 h-6" />;
    };

    return (
        <div className="h-full bg-game-bg p-6 flex flex-col animate-slide-up overflow-y-auto">
             <div className="flex items-center gap-2 mb-6">
                <button onClick={() => dispatch({ type: 'GO_TO_DASHBOARD' })}><ArrowLeft className="text-gray-600" /></button>
                <h2 className="text-2xl font-bold text-game-primary">{t('goals')}</h2>
             </div>

             <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex justify-between items-center">
                 <span className="text-gray-500 text-sm">{t('goals_avail_savings')}</span>
                 <span className="font-bold text-xl text-game-primary">₹{state.savings.toLocaleString()}</span>
             </div>

             <div className="space-y-4">
                {GOALS.map(goal => {
                    const isMain = state.financialGoal?.id === goal.id;
                    const isAchieved = state.achievedGoals.includes(goal.id);
                    const canAfford = state.savings >= goal.targetAmount;

                    return (
                        <div key={goal.id} className={`p-5 rounded-xl border-2 shadow-sm ${isMain ? 'border-yellow-400 bg-yellow-50' : 'border-gray-100 bg-white'}`}>
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${isAchieved ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                        {getIcon(goal.id)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                                            {t(goal.nameKey)} 
                                            {isMain && <span className="text-[10px] bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full uppercase">{t('goal_main_badge')}</span>}
                                        </h3>
                                        <div className="text-sm font-mono font-bold text-gray-500">{t('goal_target')} ₹{goal.targetAmount.toLocaleString()}</div>
                                    </div>
                                </div>
                                {isAchieved && <CheckCircle className="text-green-500 w-6 h-6" />}
                            </div>
                            
                            <p className="text-gray-500 text-sm mb-4">{t(goal.descKey)}</p>

                            {!isAchieved && (
                                <button 
                                    disabled={!canAfford}
                                    onClick={() => handleAchieve(goal, isMain)}
                                    className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 ${canAfford ? 'bg-green-600 text-white shadow-md hover:bg-green-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                                >
                                    {canAfford ? t('goals_pay_achieve') : t('goals_need_more', { val: (goal.targetAmount - state.savings).toLocaleString() })}
                                    {!canAfford && <Lock className="w-4 h-4" />}
                                </button>
                            )}
                            
                            {isAchieved && (
                                <div className="w-full py-2 bg-green-100 text-green-700 font-bold text-center rounded-lg text-sm">
                                    {t('goals_completed')}
                                </div>
                            )}
                        </div>
                    );
                })}
             </div>
        </div>
    );
};