import React from 'react';
import { useGame } from '../context/game-context';
import { Trophy, TrendingUp, AlertTriangle, UserCheck } from 'lucide-react';

export const SummaryScreen = () => {
    const { dispatch, state } = useGame();

    // CALCULATE PERSONA LOGIC
    const calculatePersona = () => {
        const { savingsScore, debtScore, riskScore } = state.resilienceBreakdown;
        const avgScore = state.resilienceScore;

        if (avgScore > 80) return { 
            title: "The Krishi Ratna", 
            desc: "Master of farming and finance! You balanced risk and savings perfectly.",
            color: "text-green-600",
            bg: "bg-green-100"
        };
        if (debtScore < 40) return { 
            title: "The Debt Walker", 
            desc: "You survived, but high interest loans are eating your future.",
            color: "text-red-600",
            bg: "bg-red-100"
        };
        if (savingsScore > 70 && riskScore < 50) return { 
            title: "The Cautious Saver", 
            desc: "Good savings habits, but you need better insurance protection.",
            color: "text-blue-600",
            bg: "bg-blue-100"
        };
        return { 
            title: "The Survivor", 
            desc: "You made it through, but every season is a struggle. Try planning ahead.",
            color: "text-orange-600",
            bg: "bg-orange-100"
        };
    };

    const persona = calculatePersona();

    return (
        <div className="h-full p-6 bg-game-bg flex flex-col overflow-y-auto animate-fade-in">
             <div className="text-center mb-8 mt-4">
                <div className="inline-block p-4 bg-yellow-100 rounded-full mb-4 shadow-sm">
                    <Trophy className="w-12 h-12 text-yellow-600" />
                </div>
                <h1 className="text-3xl font-bold text-game-primary">Simulation Complete</h1>
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
                    <div className="text-xs text-gray-500">Final Savings</div>
                    <div className="text-xl font-bold text-game-primary">₹{state.savings.toLocaleString()}</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm">
                    <div className="text-xs text-gray-500">Total Seasons</div>
                    <div className="text-xl font-bold">{state.seasonNumber}</div>
                </div>
             </div>

             <button 
                onClick={() => dispatch({ type: 'RESET_GAME' })} 
                className="w-full bg-game-primary text-white py-4 rounded-xl font-bold shadow-lg hover:bg-game-primaryDark transition-all"
            >
                Start New Simulation
            </button>
        </div>
    );
};