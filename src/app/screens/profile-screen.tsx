import React from 'react';
import { useGame } from '../context/game-context';
import { User, Shield, Award, ArrowLeft } from 'lucide-react';

export const ProfileScreen = () => {
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
            <h2 className="text-2xl font-bold text-game-primary">Farmer Profile</h2>
        </div>

        {/* Profile Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <User className="w-10 h-10 text-green-700" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Farmer</h3>
            <div className="text-sm text-gray-500">{state.totalAcres} Acres • {state.farmType}</div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500">
                <div className="flex items-center gap-2 mb-2 text-blue-600">
                    <Shield className="w-4 h-4" /> <span className="text-xs font-bold uppercase">Resilience</span>
                </div>
                <div className="text-2xl font-bold">{state.resilienceScore}</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-yellow-500">
                <div className="flex items-center gap-2 mb-2 text-yellow-600">
                    <Award className="w-4 h-4" /> <span className="text-xs font-bold uppercase">Credit Score</span>
                </div>
                <div className="text-2xl font-bold">{state.creditScore}</div>
            </div>
        </div>
        
        {/* Asset List */}
        <div className="mt-6">
            <h4 className="font-bold text-gray-600 mb-3">Owned Assets</h4>
            {state.ownedAssets.length === 0 ? (
                <div className="text-gray-400 text-sm italic">No assets purchased yet. Visit the shop!</div>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {state.ownedAssets.map(asset => (
                        <span key={asset} className="bg-white px-3 py-1 rounded-full text-xs font-bold text-gray-600 shadow-sm border">
                            {asset.replace(/_/g, ' ')}
                        </span>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
};