import React from 'react';
import { useGame } from '../context/game-context';
import { useLanguage } from '../context/language-context';
import { GOALS, FinancialGoal } from '../data/game-scenarios'; 
import { Target, Home, GraduationCap, Tractor, CheckCircle, Lock, ArrowLeft, Heart, Star, TrendingUp } from 'lucide-react';

export const GoalsScreen = () => {
    const { state, dispatch } = useGame();
    const { t } = useLanguage();
    const [confirmData, setConfirmData] = React.useState<{goal: FinancialGoal, isMain: boolean} | null>(null);

    const handleAchieve = (goal: FinancialGoal, isMain: boolean) => {
        setConfirmData({ goal, isMain });
    };

    const confirmAchievement = () => {
        if (confirmData) {
            dispatch({ type: 'ACHIEVE_GOAL', payload: { goal: confirmData.goal, isMain: confirmData.isMain } });
            setConfirmData(null);
        }
    };

    const getIcon = (id: string) => {
        if(id.includes('education')) return <GraduationCap className="w-full h-full" />;
        if(id.includes('tractor')) return <Tractor className="w-full h-full" />;
        if(id.includes('house')) return <Home className="w-full h-full" />;
        if(id.includes('wedding')) return <Heart className="w-full h-full" />;
        return <Target className="w-full h-full" />;
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* MODERN HEADER */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-orange-700 to-red-600"></div>
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
                      <Target className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{t('goals')}</h2>
                      <p className="text-sm text-orange-100 font-medium">Your dreams, your future</p>
                    </div>
                </div>

                {/* Balance Display */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
                    <div className="text-xs font-semibold text-orange-100 uppercase tracking-wider mb-1">{t('goals_avail_savings')}</div>
                    <div className="text-3xl font-bold font-mono">₹{state.savings.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* CONTENT */}
            <div className="relative z-10 px-4 -mt-4 space-y-4 overflow-y-auto pb-10">
                {GOALS.map(goal => {
                    const isMain = state.financialGoal?.id === goal.id;
                    const isAchieved = state.achievedGoals.includes(goal.id);
                    const canAfford = state.savings >= goal.targetAmount;
                    const progress = Math.min(100, (state.savings / goal.targetAmount) * 100);

                    return (
                        <div 
                          key={goal.id} 
                          className={`relative overflow-hidden rounded-3xl border-2 transition-all ${
                            isMain 
                              ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300 shadow-lg' 
                              : isAchieved
                                ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-md'
                                : 'bg-white border-gray-200 shadow-md'
                          }`}
                        >
                            {/* Main Goal Badge */}
                            {isMain && !isAchieved && (
                                <div className="absolute top-4 right-4 z-10">
                                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                                        <Star className="w-3 h-3 fill-white" />
                                        {t('goal_main_badge')}
                                    </div>
                                </div>
                            )}

                            {/* Achieved Badge */}
                            {isAchieved && (
                                <div className="absolute top-4 right-4 z-10">
                                    <div className="bg-green-600 text-white p-2 rounded-full shadow-lg">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                </div>
                            )}

                            <div className="p-6">
                                {/* Goal Header */}
                                <div className="flex items-start gap-4 mb-4">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                                      isAchieved 
                                        ? 'bg-green-100 text-green-600' 
                                        : isMain
                                          ? 'bg-amber-100 text-amber-600'
                                          : 'bg-gray-100 text-gray-500'
                                    }`}>
                                        {getIcon(goal.id)}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-xl text-gray-900 mb-1">{t(goal.nameKey)}</h3>
                                        <p className="text-sm text-gray-600 leading-relaxed">{t(goal.descKey)}</p>
                                    </div>
                                </div>

                                {/* Target Amount */}
                                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{t('goal_target')}</span>
                                        <span className="text-2xl font-bold text-gray-900 font-mono">₹{goal.targetAmount.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                {!isAchieved && (
                                    <div className="mb-4">
                                        <div className="flex justify-between text-sm font-bold text-gray-600 mb-2">
                                            <span>₹{state.savings.toLocaleString()}</span>
                                            <span>{progress.toFixed(0)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                            <div 
                                              className={`h-3 rounded-full transition-all duration-700 ${
                                                isMain 
                                                  ? 'bg-gradient-to-r from-amber-500 to-orange-500' 
                                                  : 'bg-gradient-to-r from-gray-400 to-gray-500'
                                              }`}
                                              style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                            
                                {/* Action Button */}
                                {!isAchieved && (
                                    <button 
                                        disabled={!canAfford}
                                        onClick={() => handleAchieve(goal, isMain)}
                                        className={`w-full py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2 ${
                                          canAfford 
                                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg hover:from-green-700 hover:to-emerald-700 active:scale-95' 
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                        {canAfford ? (
                                            <>
                                                <CheckCircle className="w-5 h-5" />
                                                {t('goals_pay_achieve')}
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="w-5 h-5" />
                                                {t('goals_need_more', { val: (goal.targetAmount - state.savings).toLocaleString() })}
                                            </>
                                        )}
                                    </button>
                                )}
                                
                                {isAchieved && (
                                    <div className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-center rounded-2xl flex items-center justify-center gap-2 shadow-md">
                                        <CheckCircle className="w-5 h-5" />
                                        {t('goals_completed')}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
                {/* Custom Confirmation Modal */}
            {confirmData && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 animate-scale-in">
                        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Target className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-center text-gray-900 mb-2">Achieve Goal?</h3>
                        <p className="text-center text-gray-600 mb-6">
                            Are you sure you want to spend <span className="font-bold text-gray-900">₹{confirmData.goal.targetAmount.toLocaleString()}</span> to complete {t(confirmData.goal.nameKey)}?
                        </p>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setConfirmData(null)}
                                className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmAchievement}
                                className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 active:scale-95 transition-all shadow-lg"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
};
