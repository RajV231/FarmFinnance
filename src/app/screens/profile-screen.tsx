import React from 'react';
import { useGame } from '../context/game-context';
import { ArrowLeft, User } from 'lucide-react';

export const ProfileScreen = () => {
    const { state, dispatch } = useGame();
    return (
        <div className="p-6 h-full flex flex-col animate-slide-up bg-game-bg">
            <button onClick={() => dispatch({ type: 'GO_TO_DASHBOARD' })} className="flex items-center gap-2 text-gray-600 mb-6">
                <ArrowLeft className="w-5 h-5" /> Back
            </button>
            <h2 className="text-2xl font-bold text-game-primary mb-6 flex items-center gap-2">
                <User className="w-6 h-6" /> Farmer Profile
            </h2>
            
            <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
                <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">Farm Type</span>
                    <span className="font-bold">{state.farmType}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">Land Size</span>
                    <span className="font-bold">{state.farmSize} Acres</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Current Wellbeing</span>
                    <span className="font-bold text-green-600">{state.wellbeing}%</span>
                </div>
            </div>
        </div>
    );
};