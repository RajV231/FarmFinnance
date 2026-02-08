import React from 'react';
import { useGame } from '../context/game-context';
import { Sprout, User, FileText, ShoppingCart } from 'lucide-react';
import { FarmVisualizer } from '../components/farm-visualizer';

export const DashboardScreen = () => {
  const { state, dispatch } = useGame();

  return (
    <div className="h-full flex flex-col bg-game-bg p-6 animate-fade-in relative overflow-y-auto">
        {/* Visual Header */}
        <div className="mb-6">
             <FarmVisualizer state={state} />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-4">
                 <div className="text-gray-500 text-xs font-bold uppercase">Credit Score</div>
                 <div className={`font-mono font-bold text-2xl ${state.creditScore >= 700 ? 'text-green-600' : state.creditScore < 600 ? 'text-red-600' : 'text-yellow-600'}`}>
                     {state.creditScore}
                 </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4">
                 <div className="text-gray-500 text-xs font-bold uppercase">Season</div>
                 <div className="font-mono font-bold text-2xl text-game-primary">
                     {state.seasonNumber}/{state.maxSeasons}
                 </div>
            </div>
        </div>

        {/* Hero Text */}
        <div className="flex-grow flex flex-col items-center justify-center text-center opacity-80 py-4">
            <h2 className="text-xl md:text-3xl font-bold text-gray-700">Ready to Plant?</h2>
            <p className="text-gray-500 md:text-lg">Prepare for the upcoming season</p>
        </div>

        {/* Actions */}
        <div className="space-y-4 mb-20 md:mb-0 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
             <button 
                onClick={() => dispatch({ type: 'START_SEASON' })}
                className="w-full bg-game-primary hover:bg-game-primaryDark text-white py-4 rounded-xl font-bold text-lg shadow-game-primary shadow-lg flex items-center justify-center gap-2 md:col-span-2 md:py-6 md:text-xl"
            >
                <Sprout className="w-6 h-6" /> Start New Season
            </button>
            
            <button 
                onClick={() => dispatch({ type: 'GO_TO_SHOP' })}
                className="w-full bg-white p-4 rounded-xl shadow-sm font-medium text-game-primary flex flex-col items-center gap-2 hover:bg-gray-50 transition border-2 border-transparent hover:border-game-primary"
            >
                <ShoppingCart className="w-6 h-6" /> Asset Store
            </button>

            <button 
                onClick={() => dispatch({ type: 'GO_TO_PROFILE' })}
                className="w-full bg-white p-4 rounded-xl shadow-sm font-medium text-gray-600 flex flex-col items-center gap-2 hover:bg-gray-50 transition"
            >
                <User className="w-6 h-6" /> My Profile
            </button>
            <button 
                onClick={() => dispatch({ type: 'GO_TO_REPORTS' })}
                className="w-full bg-white p-4 rounded-xl shadow-sm font-medium text-gray-600 flex flex-col items-center gap-2 hover:bg-gray-50 transition"
            >
                <FileText className="w-6 h-6" /> Reports
            </button>
        </div>
    </div>
  );
};