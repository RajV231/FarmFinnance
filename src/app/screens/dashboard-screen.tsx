import React from 'react';
import { useGame } from '../context/game-context';
import { Sprout, User, FileText, ShoppingCart, Target, Landmark } from 'lucide-react';
import { FarmVisualizer } from '../components/farm-visualizer';

export const DashboardScreen = () => {
  const { state, dispatch } = useGame();

  return (
    <div className="h-full flex flex-col bg-game-bg p-6 animate-fade-in relative overflow-y-auto">
        <div className="mb-6"><FarmVisualizer state={state} /></div>

        <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-4">
                 <div className="text-gray-500 text-xs font-bold uppercase">Credit Score</div>
                 <div className={`font-mono font-bold text-2xl ${state.creditScore >= 700 ? 'text-green-600' : 'text-yellow-600'}`}>{state.creditScore}</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4">
                 <div className="text-gray-500 text-xs font-bold uppercase">Season</div>
                 <div className="font-mono font-bold text-2xl text-game-primary">{state.seasonNumber}/{state.maxSeasons}</div>
            </div>
        </div>

        <div className="space-y-4 mb-20 md:mb-0 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
             <button onClick={() => dispatch({ type: 'START_SEASON' })} className="w-full bg-game-primary text-white py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 md:col-span-2">
                <Sprout className="w-6 h-6" /> Start Season
            </button>
            
            <button onClick={() => dispatch({ type: 'GO_TO_GOALS' })} className="bg-white p-4 rounded-xl shadow-sm font-medium text-purple-600 flex flex-col items-center gap-2 border-2 border-transparent hover:border-purple-200">
                <Target className="w-6 h-6" /> Life Goals
            </button>
            <button onClick={() => dispatch({ type: 'GO_TO_BANK' })} className="bg-white p-4 rounded-xl shadow-sm font-medium text-blue-600 flex flex-col items-center gap-2 border-2 border-transparent hover:border-blue-200">
                <Landmark className="w-6 h-6" /> Bank & Gold
            </button>
            <button onClick={() => dispatch({ type: 'GO_TO_SHOP' })} className="bg-white p-4 rounded-xl shadow-sm font-medium text-game-primary flex flex-col items-center gap-2 border-2 border-transparent hover:border-game-primary">
                <ShoppingCart className="w-6 h-6" /> Shop
            </button>
            <button onClick={() => dispatch({ type: 'GO_TO_PROFILE' })} className="bg-white p-4 rounded-xl shadow-sm font-medium text-gray-600 flex flex-col items-center gap-2">
                <User className="w-6 h-6" /> Profile
            </button>
        </div>
    </div>
  );
};