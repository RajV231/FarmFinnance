import React from 'react';
import { useGame } from '../context/game-context';
import { useLanguage } from '../context/language-context'; // NEW
import { GOALS, FinancialGoal } from '../data/game-scenarios'; 
import { Home, GraduationCap, Tractor, Target, Heart } from 'lucide-react';

export const GoalSelectionScreen = () => {
    const { dispatch } = useGame();
    const { t } = useLanguage(); // NEW

    const getIcon = (id: string) => {
        if(id.includes('education')) return <GraduationCap className="text-green-700 w-6 h-6" />;
        if(id.includes('tractor')) return <Tractor className="text-green-700 w-6 h-6" />;
        if(id.includes('house')) return <Home className="text-green-700 w-6 h-6" />;
        if(id.includes('wedding')) return <Heart className="text-green-700 w-6 h-6" />;
        return <Target className="text-green-700 w-6 h-6" />;
    };

    return (
        <div className="h-full bg-game-bg p-6 flex flex-col justify-center animate-slide-up">
            <h1 className="text-3xl font-bold text-game-primary mb-2 text-center">{t('goal_sel_title')}</h1>
            <p className="text-gray-500 text-center mb-8">{t('goal_sel_subtitle')}</p>

            <div className="space-y-4">
                {GOALS.map((goal: FinancialGoal) => (
                    <button 
                        key={goal.id}
                        onClick={() => dispatch({ type: 'SET_GOAL', payload: goal })}
                        className="w-full bg-white p-6 rounded-2xl shadow-sm border-2 border-transparent hover:border-game-primary transition-all flex items-center gap-4 text-left"
                    >
                        <div className="bg-green-100 p-3 rounded-full">
                            {getIcon(goal.id)}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-800">{t(goal.nameKey)}</h3>
                            <p className="text-sm text-gray-500">{t(goal.descKey)}</p>
                            <div className="mt-1 font-mono font-bold text-game-primary">{t('goal_target')} ₹{goal.targetAmount.toLocaleString()}</div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};