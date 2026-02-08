import React from 'react';
import { useGame } from '../context/game-context';
import clsx from 'clsx';

const ResilienceItem = ({ label, score, color }: { label: string, score: number, color: string }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm mb-3">
        <div className="flex justify-between mb-2 font-bold text-sm text-gray-700">
            <span>{label}</span>
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
            {score < 40 ? "Needs improvement" : score > 80 ? "Excellent!" : "Good, keep going"}
        </p>
    </div>
);

export const ResilienceScreen = () => {
    const { dispatch, state } = useGame();
    // FIX: Read from state breakdown
    const { savingsScore, riskScore, debtScore } = state.resilienceBreakdown || { 
        savingsScore: 50, 
        riskScore: 50, 
        debtScore: 50 
    };

    return (
        <div className="h-full flex flex-col items-center animate-slide-up bg-game-bg">
            <div className="p-6 w-full flex flex-col items-center">
                <h2 className="text-xl font-bold text-game-primary mb-6">Financial Resilience</h2>
                
                {/* Score Circle */}
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
                        <span className="text-xs text-gray-400 uppercase tracking-wide">Index</span>
                    </div>
                </div>
                
                {/* Dynamic Breakdown List */}
                <div className="w-full w-max-md space-y-2 mb-20">
                    <ResilienceItem 
                        label="Savings Discipline" 
                        score={savingsScore} 
                        color="bg-green-500" 
                    />
                    <ResilienceItem 
                        label="Risk Preparedness" 
                        score={riskScore} 
                        color="bg-yellow-500" 
                    />
                    <ResilienceItem 
                        label="Debt Stability" 
                        score={debtScore} 
                        color="bg-blue-500" 
                    />
                </div>
            </div>

            <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t md:static md:bg-transparent md:border-0">
                <button 
                    onClick={() => dispatch({ type: 'NEXT_SEASON' })} 
                    className="w-full bg-game-primary hover:bg-game-primaryDark text-white py-4 rounded-xl font-bold shadow-lg transition-transform active:scale-95"
                >
                    Start Next Season
                </button>
            </div>
        </div>
    );
};