import React from 'react';
import { useGame } from '../context/game-context';
import { getAdvisorTip } from '../engine/advisor-engine';
import { Bot, Sparkles } from 'lucide-react';

export const AdvisorBot = () => {
    const { state } = useGame();
    
    // Fetch the dynamic tip based on the current game state
    const tip = getAdvisorTip(state);

    return (
        <div className="bg-gradient-to-r from-emerald-800 to-green-700 rounded-2xl p-4 shadow-lg mb-6 flex items-start gap-4 text-white animate-fade-in border border-green-600">
            <div className="bg-white/20 p-2 rounded-full shrink-0 mt-1 shadow-sm">
                <Bot className="w-6 h-6 text-green-100" />
            </div>
            <div>
                <h3 className="font-bold text-sm text-green-100 mb-1 flex items-center gap-1.5 uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" /> Krishi Mitra Advisory
                </h3>
                <p className="text-sm leading-relaxed text-white/95 font-medium">
                    {tip}
                </p>
            </div>
        </div>
    );
};