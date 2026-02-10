import React from 'react';
import { useGame } from '../context/game-context';
import { Trophy, TrendingUp, AlertTriangle, UserCheck, Clock, AlertOctagon, RefreshCw } from 'lucide-react';
import { ASSETS } from '../data/game-scenarios';

export const SummaryScreen = () => {
    const { dispatch, state } = useGame();

    const calculatePersona = () => {
        const { savingsScore, debtScore, riskScore } = state.resilienceBreakdown;
        const avgScore = state.resilienceScore;
        const hasPension = state.ownedAssets.includes('pension_scheme');

        if (state.phase === 'GAME_WIN') return {
            title: "The Financial Wizard",
            desc: "Incredible! You navigated risks and achieved your life goal.",
            color: "text-purple-600",
            bg: "bg-purple-100"
        };
        if (state.phase === 'GAME_LOSS') return {
            title: "The Lesson Learner",
            desc: "You took too many risks. Restart and try a safer approach.",
            color: "text-red-600",
            bg: "bg-red-100"
        };
        if (avgScore > 80) return { 
            title: "The Krishi Ratna", 
            desc: "Master of farming! You balanced risk and savings perfectly.",
            color: "text-green-600",
            bg: "bg-green-100"
        };
        if (debtScore < 40) return { 
            title: "The Debt Walker", 
            desc: "High interest loans are eating your future.",
            color: "text-red-600",
            bg: "bg-red-100"
        };
        if (savingsScore > 70 && riskScore < 50) return { 
            title: "The Cautious Saver", 
            desc: "Good savings, but you need better insurance.",
            color: "text-blue-600",
            bg: "bg-blue-100"
        };
        if (hasPension && state.savings > 0) return {
            title: "The Visionary",
            desc: "Outstanding! You secured your crops and your old age.",
            color: "text-indigo-600",
            bg: "bg-indigo-100"
        };
        return { 
            title: "The Survivor", 
            desc: "You made it through. Try planning ahead next time.",
            color: "text-orange-600",
            bg: "bg-orange-100"
        };
    };

    const persona = calculatePersona();

    const renderHeader = () => {
        if (state.phase === 'GAME_WIN') return { icon: <Trophy className="text-yellow-500 w-16 h-16" />, text: "Goal Achieved!" };
        if (state.phase === 'GAME_LOSS') return { icon: <AlertOctagon className="text-red-500 w-16 h-16" />, text: "Bankrupt" };
        return { icon: <Clock className="text-blue-500 w-16 h-16" />, text: "Simulation Complete" };
    };

    const header = renderHeader();

    return (
        <div className="h-full p-6 bg-game-bg flex flex-col overflow-y-auto animate-fade-in">
             <div className="text-center mb-8 mt-4 flex flex-col items-center">
                <div className="inline-block p-4 bg-white rounded-full mb-4 shadow-md">
                    {header.icon}
                </div>
                <h1 className="text-3xl font-bold text-game-primary">{header.text}</h1>
             </div>

             {/* PERSONA CARD */}
             <div className={`w-full ${persona.bg} p-6 rounded-2xl border-2 border-white shadow-lg mb-6 text-center`}>
                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Your Financial Persona</h2>
                <div className={`text-3xl font-bold ${persona.color} mb-2`}>{persona.title}</div>
                <p className="text-gray-700">{persona.desc}</p>
             </div>

             {/* FINAL STATS */}
             <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white p-4 rounded-xl shadow-sm">
                    <div className="text-xs text-gray-500">Final Wealth</div>
                    <div className="text-xl font-bold text-game-primary">₹{(state.savings + state.bankBalance.fixedDeposit).toLocaleString()}</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm">
                    <div className="text-xs text-gray-500">Seasons Played</div>
                    <div className="text-xl font-bold">{state.seasonNumber}/{state.maxSeasons}</div>
                </div>
             </div>
             
             {/* GOAL STATUS */}
             {state.financialGoal && (
                 <div className="bg-white p-4 rounded-xl shadow-sm mb-8 flex justify-between items-center">
                     <div>
                         <div className="text-xs text-gray-500">Target Goal</div>
                         <div className="font-bold">{state.financialGoal.name}</div>
                     </div>
                     <div className="font-mono text-xl text-gray-400">
                         ₹{state.financialGoal.targetAmount.toLocaleString()}
                     </div>
                 </div>
             )}

             <button 
                onClick={() => dispatch({ type: 'RESET_GAME' })} 
                className="w-full bg-game-primary text-white py-4 rounded-xl font-bold shadow-lg hover:bg-game-primaryDark transition-all flex items-center justify-center gap-2"
            >
                <RefreshCw className="w-5 h-5" /> Start New Simulation
            </button>
        </div>
    );
};