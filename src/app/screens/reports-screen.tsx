import React from 'react';
import { useGame } from '../context/game-context';
import { ArrowLeft, BarChart } from 'lucide-react';

export const ReportsScreen = () => {
    const { state, dispatch } = useGame();
    return (
        <div className="p-6 h-full flex flex-col animate-slide-up bg-game-bg">
            <button onClick={() => dispatch({ type: 'GO_TO_DASHBOARD' })} className="flex items-center gap-2 text-gray-600 mb-6">
                <ArrowLeft className="w-5 h-5" /> Back
            </button>
            <h2 className="text-2xl font-bold text-game-primary mb-6 flex items-center gap-2">
                <BarChart className="w-6 h-6" /> Season Reports
            </h2>
            
            <div className="space-y-4">
                {state.history.length === 0 ? (
                    <div className="text-center text-gray-400 py-10">No harvest history yet.</div>
                ) : (
                    state.history.map((h, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl shadow-sm">
                            <div className="font-bold text-lg mb-2 text-game-primary">Season {h.season}</div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Income</span>
                                <span className="font-bold">₹{h.income.toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Resilience Score</span>
                                <span className="font-bold">{h.resilience}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};