import React from 'react';
import { useGame } from '../context/game-context';
import { Trophy, TrendingUp, AlertTriangle, UserCheck, Clock, AlertOctagon, RefreshCw, MapPin, Target } from 'lucide-react';

export const SummaryScreen = () => {
    const { dispatch, state } = useGame();

    // NEW: Advanced Persona Logic based on Wealth, Land, and Goals
    const calculatePersona = () => {
        const { savings, debt, totalAcres, achievedGoals, financialGoal, bankBalance, creditScore } = state;
        
        // Calculate Total Net Worth (Cash + FD + Gold Value)
        const goldValue = bankBalance.goldGrams * 6000;
        const totalWealth = savings + bankBalance.fixedDeposit + goldValue;
        
        const hasMainGoal = financialGoal && achievedGoals.includes(financialGoal.id);
        const expandedLand = totalAcres >= 5; // Started with 2, reached 5+

        // 1. BAD ENDING: High Debt
        if (debt > 50000) return { 
            title: "The Debt Walker", 
            desc: `You survived, but left with ₹${debt.toLocaleString()} in debt. High interest loans ate your future. Next time, use the Bank to save for emergencies.`,
            color: "text-red-600",
            bg: "bg-red-50",
            icon: <AlertTriangle className="w-12 h-12 text-red-500" />
        };

        // 2. LEGENDARY ENDING: Goal + High Wealth
        if (hasMainGoal && totalWealth > 500000) return { 
            title: "The Krishi Ratna", 
            desc: "Master of farming! You achieved your Life Dream AND built a massive fortune of over ₹5 Lakhs. You are an inspiration to the village.",
            color: "text-green-700",
            bg: "bg-green-100",
            icon: <Trophy className="w-12 h-12 text-green-600" />
        };

        // 3. GOAL FOCUSED ENDING
        if (hasMainGoal) return { 
            title: "The Dream Chaser", 
            desc: `Congratulations! You focused on what matters and achieved your dream: ${financialGoal.name}. You are financially free.`,
            color: "text-purple-600",
            bg: "bg-purple-100",
            icon: <Target className="w-12 h-12 text-purple-600" />
        };

        // 4. LAND OWNER ENDING
        if (expandedLand) return {
            title: "The Zamindar",
            desc: `You grew your farm to ${totalAcres} Acres! You believe land is the only real wealth. You are the largest landowner in the region.`,
            color: "text-blue-800",
            bg: "bg-blue-100",
            icon: <MapPin className="w-12 h-12 text-blue-700" />
        };

        // 5. WEALTHY INVESTOR (Rich but missed goal)
        if (totalWealth > 300000) return {
            title: "The Savvy Investor",
            desc: "You accumulated great wealth through crops and banking, but you forgot to buy your main Life Goal. You are rich, but are you happy?",
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            icon: <TrendingUp className="w-12 h-12 text-emerald-600" />
        };

        // 6. CREDIT SCORE ENDING
        if (creditScore > 800) return {
            title: "The Bank's Favorite",
            desc: "You have an impeccable Credit Score (800+). You played it very safe. Next time, take some calculated risks to grow faster.",
            color: "text-yellow-600",
            bg: "bg-yellow-50",
            icon: <UserCheck className="w-12 h-12 text-yellow-600" />
        };

        // 7. SURVIVOR (Default)
        return { 
            title: "The Survivor", 
            desc: `You made it through ${state.maxSeasons} seasons. You survived the storms and pests, but just barely. Try planning your seeds and loans better next time.`,
            color: "text-gray-600",
            bg: "bg-gray-100",
            icon: <Clock className="w-12 h-12 text-gray-500" />
        };
    };

    const persona = calculatePersona();
    // Use consistent gold rate (₹6000 per gram) - matches bank-screen.tsx
    const goldRate = 6000;
    const goldValue = state.bankBalance.goldGrams * goldRate;
    const finalNetWorth = state.savings + state.bankBalance.fixedDeposit + goldValue;

    return (
        <div className="h-full p-6 bg-game-bg flex flex-col overflow-y-auto animate-fade-in">
             <div className="text-center mb-8 mt-4 flex flex-col items-center">
                <div className="inline-block p-4 bg-white rounded-full mb-4 shadow-md">
                    {persona.icon}
                </div>
                <h1 className="text-3xl font-bold text-game-primary">Simulation Complete</h1>
             </div>

             {/* PERSONA CARD */}
             <div className={`w-full ${persona.bg} p-6 rounded-2xl border-2 border-white shadow-lg mb-6 text-center`}>
                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Your Financial Identity</h2>
                <div className={`text-3xl font-bold ${persona.color} mb-3`}>{persona.title}</div>
                <p className="text-gray-700 text-sm leading-relaxed">{persona.desc}</p>
             </div>

             {/* FINAL STATS GRID */}
             <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
                 <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase border-b pb-2">Final Report Card</h3>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="text-xs text-gray-400">Total Net Worth</div>
                        <div className="text-lg font-bold text-game-primary">₹{finalNetWorth.toLocaleString()}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-400">Land Owned</div>
                        <div className="text-lg font-bold">{state.totalAcres} Acres</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-400">Goals Achieved</div>
                        <div className="text-lg font-bold">{state.achievedGoals.length}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-400">Final Debt</div>
                        <div className={`text-lg font-bold ${state.debt > 0 ? 'text-red-500' : 'text-green-500'}`}>
                            ₹{state.debt.toLocaleString()}
                        </div>
                    </div>
                 </div>
             </div>

             <button 
                onClick={() => dispatch({ type: 'RESET_GAME' })} 
                className="w-full bg-game-primary text-white py-4 rounded-xl font-bold shadow-lg hover:bg-game-primaryDark transition-all flex items-center justify-center gap-2"
            >
                <RefreshCw className="w-5 h-5" /> Start New Journey
            </button>
        </div>
    );
};
