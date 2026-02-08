import React from 'react';
import { useGame } from '../context/game-context';
import { Sprout, User, FileText } from 'lucide-react';

export const DashboardScreen = () => {
  const { state, dispatch } = useGame();

  return (
    <div className="h-full flex flex-col bg-game-bg p-6 animate-fade-in relative">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500 font-medium">Season {state.seasonNumber} of {state.maxSeasons}</span>
                <span className="text-gray-400 font-mono">{state.seasonNumber}/{state.maxSeasons}</span>
            </div>
            <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                <div 
                    className="bg-game-primary h-full rounded-full transition-all duration-1000"
                    style={{ width: `${(state.seasonNumber / state.maxSeasons) * 100}%` }}
                ></div>
            </div>
        </div>

        <div className="flex-grow flex flex-col items-center justify-center text-center opacity-80 py-10">
            <div className="w-32 h-32 md:w-48 md:h-48 bg-green-200 rounded-full flex items-center justify-center mb-4 text-6xl md:text-8xl shadow-inner transition-transform hover:scale-110">
                🌾
            </div>
            <h2 className="text-xl md:text-3xl font-bold text-gray-700">Ready to Plant?</h2>
            <p className="text-gray-500 md:text-lg">Prepare for the upcoming season</p>
        </div>

        <div className="space-y-4 mb-20 md:mb-0 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
             <button 
                onClick={() => dispatch({ type: 'START_SEASON' })}
                className="w-full bg-game-primary hover:bg-game-primaryDark text-white py-4 rounded-xl font-bold text-lg shadow-game-primary shadow-lg flex items-center justify-center gap-2 md:col-span-2 md:py-6 md:text-xl"
            >
                <Sprout className="w-6 h-6" /> Start New Season
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