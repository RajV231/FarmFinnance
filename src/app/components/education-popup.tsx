import React, { useState } from 'react';
import { useGame } from '../context/game-context';
import { useLanguage } from '../context/language-context';
import { Brain, CheckCircle, XCircle, Coins, X } from 'lucide-react';

export const EducationPopup = () => {
    const { state, dispatch } = useGame();
    const { t } = useLanguage();
    const quiz = state.activeQuiz;
    const [selected, setSelected] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);

    if (!quiz) return null;

    const handleSelect = (idx: number) => {
        if (showResult) return;
        setSelected(idx);
        setShowResult(true);
        
        const isCorrect = idx === quiz.correctIndex;
        dispatch({ 
            type: 'ANSWER_QUIZ', 
            payload: { isCorrect, reward: quiz.reward, quizId: quiz.id } 
        });
    };

    const handleClose = () => {
        dispatch({ type: 'CLOSE_QUIZ' });
        setSelected(null);
        setShowResult(false);
    };

    const isCorrect = selected === quiz.correctIndex;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white relative">
                    <button 
                        onClick={handleClose}
                        className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                            <Brain className="w-7 h-7" />
                        </div>
                        <div>
                            <h2 className="font-bold text-xl">{t('app_title')} Quiz</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <Coins className="w-4 h-4 text-yellow-300" />
                                <p className="text-purple-200 text-sm font-bold">Earn ₹{quiz.reward.toLocaleString()}!</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="p-6">
                    {/* Question */}
                    <p className="text-lg font-bold text-gray-800 mb-6 leading-relaxed">{t(quiz.questionKey)}</p>
                    
                    {/* Options */}
                    <div className="space-y-3 mb-6">
                        {quiz.optionsKeys.map((optKey, idx) => {
                            let btnClass = "border-gray-200 hover:border-purple-300 hover:bg-purple-50 text-gray-700";
                            if (showResult) {
                                if (idx === quiz.correctIndex) {
                                    btnClass = "border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 font-bold shadow-md";
                                } else if (idx === selected) {
                                    btnClass = "border-red-500 bg-gradient-to-r from-red-50 to-pink-50 text-red-800";
                                } else {
                                    btnClass = "border-gray-200 opacity-50";
                                }
                            }

                            return (
                                <button 
                                    key={idx}
                                    onClick={() => handleSelect(idx)}
                                    disabled={showResult}
                                    className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${btnClass}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>{t(optKey)}</span>
                                        {showResult && idx === quiz.correctIndex && (
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                        )}
                                        {showResult && idx === selected && idx !== quiz.correctIndex && (
                                            <XCircle className="w-5 h-5 text-red-600" />
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Result */}
                    {showResult && (
                        <div className={`rounded-2xl p-5 mb-6 ${
                            isCorrect 
                                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200' 
                                : 'bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200'
                        }`}>
                            <div className={`flex items-center gap-2 font-bold mb-2 ${
                                isCorrect ? 'text-green-800' : 'text-red-800'
                            }`}>
                                {isCorrect ? <CheckCircle className="w-5 h-5"/> : <XCircle className="w-5 h-5"/>}
                                {isCorrect ? 'Correct! Well done.' : 'Incorrect.'}
                            </div>
                            <p className={`text-sm leading-relaxed ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                {t(quiz.explanationKey)}
                            </p>
                            {isCorrect && (
                                <div className="mt-3 flex items-center gap-2 text-green-700 font-bold bg-green-100 w-fit px-4 py-2 rounded-xl">
                                    <Coins className="w-5 h-5 text-yellow-600"/> 
                                    <span>+₹{quiz.reward} Added to your savings!</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Continue Button */}
                    {showResult && (
                        <button 
                            onClick={handleClose} 
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-2xl font-bold hover:from-purple-700 hover:to-indigo-700 active:scale-95 transition-all shadow-lg"
                        >
                            Continue
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
