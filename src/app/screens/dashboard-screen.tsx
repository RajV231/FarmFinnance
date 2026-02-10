import React from 'react';
import { useGame } from '../context/game-context';
import { Sprout, User, FileText, ShoppingCart, Target, Landmark, LogOut } from 'lucide-react';
import { FarmVisualizer } from '../components/farm-visualizer';

export const DashboardScreen = () => {
  const { state, dispatch } = useGame();

  const handleReset = () => {
      if(confirm("Are you sure you want to quit and start a new game? Current progress will be lost.")) {
          dispatch({ type: 'RESET_GAME' });
      }
  };

  return (
    <div className="h-full flex flex-col bg-game-bg p-6 animate-fade-in relative overflow-y-auto">
        
        <div className="mb-6"><FarmVisualizer state={state} /></div>

        <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-yellow-500">
                 <div className="text-gray-500 text-xs font-bold uppercase">Credit Score</div>
                 <div className={`font-mono font-bold text-2xl ${state.creditScore >= 700 ? 'text-green-600' : 'text-yellow-600'}`}>{state.creditScore}</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-game-primary">
                 <div className="text-gray-500 text-xs font-bold uppercase">Season</div>
                 <div className="font-mono font-bold text-2xl text-game-primary">{state.seasonNumber}/{state.maxSeasons}</div>
            </div>
        </div>

        <div className="space-y-3 mb-20 md:mb-0 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
             
             {/* 1. START SEASON */}
             <button 
                onClick={() => dispatch({ type: 'START_SEASON' })} 
                className="w-full bg-game-primary text-white py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 md:col-span-2 hover:bg-game-primaryDark transition-transform active:scale-95"
            >
                <Sprout className="w-6 h-6" /> Start New Season
            </button>
            
            {/* 2. GOALS */}
            <button 
                onClick={() => dispatch({ type: 'GO_TO_GOALS' })} 
                className="bg-white p-4 rounded-xl shadow-sm font-medium text-purple-600 flex flex-col items-center gap-2 border-2 border-transparent hover:border-purple-200 transition-all"
            >
                <Target className="w-6 h-6" /> Life Goals
            </button>

            {/* 3. BANK */}
            <button 
                onClick={() => dispatch({ type: 'GO_TO_BANK' })} 
                className="bg-white p-4 rounded-xl shadow-sm font-medium text-blue-600 flex flex-col items-center gap-2 border-2 border-transparent hover:border-blue-200 transition-all"
            >
                <Landmark className="w-6 h-6" /> Bank & Gold
            </button>

            {/* 4. SHOP */}
            <button 
                onClick={() => dispatch({ type: 'GO_TO_SHOP' })} 
                className="bg-white p-4 rounded-xl shadow-sm font-medium text-green-700 flex flex-col items-center gap-2 border-2 border-transparent hover:border-green-200 transition-all"
            >
                <ShoppingCart className="w-6 h-6" /> Shop
            </button>

            {/* 5. REPORTS */}
            <button 
                onClick={() => dispatch({ type: 'GO_TO_REPORTS' })} 
                className="bg-white p-4 rounded-xl shadow-sm font-medium text-orange-600 flex flex-col items-center gap-2 border-2 border-transparent hover:border-orange-200 transition-all"
            >
                <FileText className="w-6 h-6" /> Reports
            </button>

            {/* 6. PROFILE */}
            <button 
                onClick={() => dispatch({ type: 'GO_TO_PROFILE' })} 
                className="bg-white p-4 rounded-xl shadow-sm font-medium text-gray-600 flex flex-col items-center gap-2 hover:bg-gray-50 transition-all"
            >
                <User className="w-6 h-6" /> My Profile
            </button>

            {/* 7. RESTART (DANGER BUTTON) */}
            <button 
                onClick={handleReset}
                className="bg-red-50 p-4 rounded-xl shadow-sm font-medium text-red-600 flex flex-col items-center gap-2 border-2 border-red-100 hover:bg-red-100 md:col-span-2 mt-6"
            >
                <LogOut className="w-5 h-5" /> Quit & Restart
            </button>
        </div>
    </div>
  );
};