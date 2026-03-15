import React from 'react';
import { useGame } from '../context/game-context';
import { useLanguage } from '../context/language-context';
import { Shield, TrendingUp, DollarSign, CreditCard, ArrowRight } from 'lucide-react';

export const ResilienceScreen = () => {
    const { dispatch, state } = useGame();
    const { t } = useLanguage();

    const { savingsScore, riskScore, debtScore } = state.resilienceBreakdown || { 
        savingsScore: 50, riskScore: 50, debtScore: 50 
    };

    const metrics = [
        { 
            labelKey: "resil_savings", 
            score: savingsScore, 
            icon: <DollarSign className="w-5 h-5" />,
            gradient: 'from-green-500 to-emerald-500'
        },
        { 
            labelKey: "resil_risk", 
            score: riskScore, 
            icon: <Shield className="w-5 h-5" />,
            gradient: 'from-yellow-500 to-amber-500'
        },
        { 
            labelKey: "resil_debt", 
            score: debtScore, 
            icon: <CreditCard className="w-5 h-5" />,
            gradient: 'from-blue-500 to-indigo-500'
        }
    ];

    const getStatusMessage = (score: number) => {
        if (score < 40) return t('resil_improve');
        if (score > 80) return t('resil_excellent');
        return t('resil_good');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col animate-slide-up">
            {/* Header */}
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-green-700 to-green-800"></div>
                <div className="relative px-6 py-12 text-white text-center">
                    <h2 className="text-2xl font-bold mb-1">{t('resil_title')}</h2>
                    <p className="text-green-100 font-medium">Your financial strength</p>
                </div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex-1 px-6 -mt-6 pb-32">
                {/* Circular Progress */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-6">
                    <div className="relative w-48 h-48 mx-auto mb-6">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle 
                                cx="96" cy="96" r="88" 
                                stroke="#e5e7eb" 
                                strokeWidth="12" 
                                fill="transparent" 
                            />
                            <circle 
                                cx="96" cy="96" r="88" 
                                stroke="url(#gradient)" 
                                strokeWidth="12" 
                                fill="transparent" 
                                strokeDasharray={553}
                                strokeDashoffset={553 - (553 * state.resilienceScore) / 100}
                                className="transition-all duration-1000 ease-out"
                                strokeLinecap="round"
                            />
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#10b981" />
                                    <stop offset="100%" stopColor="#059669" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-5xl font-bold text-green-700 font-mono mb-1">{state.resilienceScore}</span>
                            <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">{t('resil_index')}</span>
                        </div>
                    </div>

                    <div className={`text-center p-4 rounded-2xl ${
                        state.resilienceScore > 80 
                            ? 'bg-green-50 text-green-800' 
                            : state.resilienceScore > 50
                                ? 'bg-blue-50 text-blue-800'
                                : 'bg-yellow-50 text-yellow-800'
                    }`}>
                        <p className="font-bold">
                            {state.resilienceScore > 80 
                                ? '🎉 Excellent! Your farm is very resilient' 
                                : state.resilienceScore > 50
                                    ? '👍 Good! Keep building your resilience'
                                    : '💪 Keep going! Focus on building savings'
                            }
                        </p>
                    </div>
                </div>
                
                {/* Breakdown Metrics */}
                <div className="space-y-3 mb-6">
                    {metrics.map((metric, index) => (
                        <div key={index} className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className={`bg-gradient-to-r ${metric.gradient} p-4 text-white`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                            {metric.icon}
                                        </div>
                                        <span className="font-bold">{t(metric.labelKey)}</span>
                                    </div>
                                    <span className="text-2xl font-bold font-mono">{metric.score}</span>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-2">
                                    <div 
                                        className={`bg-gradient-to-r ${metric.gradient} h-3 rounded-full transition-all duration-1000`}
                                        style={{ width: `${metric.score}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-600 font-medium">
                                    {getStatusMessage(metric.score)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Fixed Bottom Button */}
<div className="fixed bottom-0 left-0 w-full p-4 bg-white/80 backdrop-blur-xl border-t border-gray-200 z-40">
                <button 
                    onClick={() => dispatch({ type: 'NEXT_SEASON' })} 
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-5 rounded-2xl font-bold shadow-lg hover:from-green-700 hover:to-emerald-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    {t('resil_next_season')}
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};
