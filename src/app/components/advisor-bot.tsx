import React from 'react';
import { useGame } from '../context/game-context';
import { useLanguage } from '../context/language-context';
import { getAdvisorTip } from '../engine/advisor-engine';
import { Bot, Sparkles } from 'lucide-react';

export const AdvisorBot = () => {
    const { state } = useGame();
    const { t } = useLanguage();
    
    const tip = getAdvisorTip(state);
    
    let translatedTip = t(tip.key);
    if (tip.val !== undefined) {
        translatedTip = translatedTip.replace('{val}', tip.val.toLocaleString('en-IN'));
    }

    return (
        <div className="bg-gradient-to-r from-emerald-700 to-green-600 rounded-3xl p-5 shadow-lg flex items-start gap-4 text-white animate-fade-in border-2 border-green-500/30">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl shrink-0 shadow-md">
                <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-green-200" />
                    <h3 className="font-bold text-sm text-green-100 uppercase tracking-wider">{t('advisory')}</h3>
                </div>
                <p className="text-sm leading-relaxed text-white font-medium">
                    {translatedTip}
                </p>
            </div>
        </div>
    );
};
