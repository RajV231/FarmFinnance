import React from 'react';
import { useGame } from '../context/game-context';
import { useLanguage } from '../context/language-context';
import { GOALS, FinancialGoal } from '../data/game-scenarios'; 
import { Home, GraduationCap, Tractor, Target, Heart, ArrowRight } from 'lucide-react';

export const GoalSelectionScreen = () => {
    const { dispatch } = useGame();
    const { t } = useLanguage();

    const getIcon = (id: string) => {
        if(id.includes('education')) return <GraduationCap className="w-8 h-8" />;
        if(id.includes('tractor')) return <Tractor className="w-8 h-8" />;
        if(id.includes('house')) return <Home className="w-8 h-8" />;
        if(id.includes('wedding')) return <Heart className="w-8 h-8" />;
        return <Target className="w-8 h-8" />;
    };

    const getGradient = (id: string) => {
        if(id.includes('education')) return 'from-blue-600 to-indigo-600';
        if(id.includes('tractor')) return 'from-green-600 to-emerald-600';
        if(id.includes('house')) return 'from-orange-600 to-amber-600';
        if(id.includes('wedding')) return 'from-pink-600 to-rose-600';
        return 'from-purple-600 to-indigo-600';
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col animate-slide-up">
            {/* Header */}
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-orange-700 to-red-600"></div>
                <div className="relative px-6 py-12 text-white text-center">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-4 ring-4 ring-white/30">
                        <Target className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">{t('goal_sel_title')}</h1>
                    <p className="text-orange-100 font-medium max-w-md mx-auto">{t('goal_sel_subtitle')}</p>
                </div>
            </div>

            {/* Goals List */}
            <div className="relative z-10 flex-1 px-4 -mt-6 pb-10 space-y-4">
                {GOALS.map((goal: FinancialGoal) => (
                    <button 
                        key={goal.id}
                        onClick={() => dispatch({ type: 'SET_GOAL', payload: goal })}
                        className="w-full bg-white rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-green-300 active:scale-98 transition-all overflow-hidden"
                    >
                        <div className="p-6 flex items-center gap-4">
                            <div className={`w-16 h-16 bg-gradient-to-br ${getGradient(goal.id)} rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-md`}>
                                {getIcon(goal.id)}
                            </div>
                            <div className="flex-1 text-left">
                                <h3 className="font-bold text-lg text-gray-800 mb-1">{t(goal.nameKey)}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed mb-2">{t(goal.descKey)}</p>
                                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-1.5 rounded-xl border border-green-200">
                                    <span className="text-xs font-semibold text-gray-600">{t('goal_target')}</span>
                                    <span className="font-mono font-bold text-green-700">₹{goal.targetAmount.toLocaleString()}</span>
                                </div>
                            </div>
                            <ArrowRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};
