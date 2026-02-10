import React from 'react';
import { useGame } from '../context/game-context';
import { FileText, ArrowLeft, TrendingUp } from 'lucide-react';

export const ReportsScreen = () => {
  const { state, dispatch } = useGame();

  return (
    <div className="h-full bg-game-bg p-6 flex flex-col animate-slide-up overflow-y-auto">
        {/* NAV HEADER */}
        <div className="flex items-center gap-2 mb-6">
            <button 
                onClick={() => dispatch({ type: 'GO_TO_DASHBOARD' })} 
                className="p-2 bg-white rounded-full text-gray-600 hover:bg-gray-100 shadow-sm"
            >
                <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-game-primary">Seasonal Reports</h2>
        </div>

        {state.history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 opacity-50">
                <FileText className="w-16 h-16 text-gray-400 mb-4" />
                <p>No harvest history yet.</p>
            </div>
        ) : (
            <div className="space-y-4">
                {state.history.map((record, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-game-primary">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-gray-700">Season {record.season}</span>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">
                                Resilience: {record.resilience}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-green-600">
                            <TrendingUp className="w-4 h-4" />
                            <span className="font-mono font-bold">₹{record.income.toLocaleString()}</span>
                            <span className="text-xs text-gray-400 ml-auto">Gross Income</span>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
  );
};