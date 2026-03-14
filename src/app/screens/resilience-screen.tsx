import React from 'react';
import { useGame } from '../context/game-context';
import { useLanguage } from '../context/language-context'; // NEW
import clsx from 'clsx';

export const ResilienceScreen = () => {
    const { dispatch, state } = useGame();
    const { t } = useLanguage(); // NEW

    const { savingsScore, riskScore, debtScore } = state.resilienceBreakdown || { 
        savingsScore: 50, riskScore: 50, debtScore: 50 
    };

    // Moved inside to access `t`
    const ResilienceItem = ({ labelKey, score, color }: { labelKey: string, score: number, color: string }) => (
        <div className="bg-white p-4 rounded-xl shadow-sm mb-3">
            <div className="flex justify-between mb-2 font-bold text-sm text-gray-700">
                <span>{t(labelKey)}</span>
                <span className={clsx("px-2 py-0.5 rounded text-xs text-white", score < 50 ? "bg-red-500" : "bg-green-600")}>
                    {score}/100
                </span>
            </div>
            <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                <div 
                    className={`h-full transition-all duration-1000 ease-out ${color}`} 
                    style={{ width: `${score}%` }}
                ></div>
            </div>
            <p className="text-xs text-gray-400 mt-1">
                {score < 40 ? t('resil_improve') : score > 80 ? t('resil_excellent') : t('resil_good')}
            </p>
        </div>
    );

    return (
        <div className="h-full flex flex-col items-center animate-slide-up bg-game-bg">
            <div className="p-6 w-full flex flex-col items-center">
                <h2 className="text-xl font-bold text-game-primary mb-6">{t('resil_title')}</h2>
                
                <div className="relative mb-8">
                    <svg className="w-40 h-40 transform -rotate-90">
                        <circle cx="80" cy="80" r="70" stroke="#e5e7eb" strokeWidth="10" fill="transparent" />
                        <circle 
                            cx="80" cy="80" r="70" 
                            stroke="#4a7c59" 
                            strokeWidth="10" 
                            fill="transparent" 
                            strokeDasharray={440}
                            strokeDashoffset={440 - (440 * state.resilienceScore) / 100}
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                        <span className="text-4xl font-bold text-game-primary block">{state.resilienceScore}</span>
                        <span className="text-xs text-gray-400 uppercase tracking-wide">{t('resil_index')}</span>
                    </div>
                </div>
                
                <div className="w-full w-max-md space-y-2 mb-20">
                    <ResilienceItem labelKey="resil_savings" score={savingsScore} color="bg-green-500" />
                    <ResilienceItem labelKey="resil_risk" score={riskScore} color="bg-yellow-500" />
                    <ResilienceItem labelKey="resil_debt" score={debtScore} color="bg-blue-500" />
                </div>
            </div>

            <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t md:static md:bg-transparent md:border-0">
                <button 
                    onClick={() => dispatch({ type: 'NEXT_SEASON' })} 
                    className="w-full bg-game-primary hover:bg-game-primaryDark text-white py-4 rounded-xl font-bold shadow-lg transition-transform active:scale-95"
                >
                    {t('resil_next_season')}
                </button>
            </div>
        </div>
    );
};