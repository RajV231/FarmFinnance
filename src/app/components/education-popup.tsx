import React, { useState } from 'react';
import { useGame } from '../context/game-context';
import { useLanguage } from '../context/language-context';
import { Brain, CheckCircle, XCircle, Coins } from 'lucide-react';

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
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                <div className="bg-purple-600 p-4 text-white flex items-center gap-3">
                    <Brain className="w-8 h-8" />
                    <div>
                        <h2 className="font-bold text-xl">{t('app_title')} Quiz</h2>
                        <p className="text-purple-200 text-sm">Earn ₹{quiz.reward.toLocaleString()}!</p>
                    </div>
                </div>
                
                <div className="p-6">
                    <p className="text-lg font-medium text-gray-800 mb-6">{t(quiz.questionKey)}</p>
                    
                    <div className="space-y-3 mb-6">
                        {quiz.optionsKeys.map((optKey, idx) => {
                            let btnClass = "border-gray-200 hover:border-purple-300 hover:bg-purple-50 text-gray-700";
                            if (showResult) {
                                if (idx === quiz.correctIndex) btnClass = "border-green-500 bg-green-50 text-green-800 font-bold";
                                else if (idx === selected) btnClass = "border-red-500 bg-red-50 text-red-800";
                                else btnClass = "border-gray-200 opacity-50";
                            }

                            return (
                                <button 
                                    key={idx}
                                    onClick={() => handleSelect(idx)}
                                    disabled={showResult}
                                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${btnClass}`}
                                >
                                    {t(optKey)}
                                </button>
                            );
                        })}
                    </div>

                    {showResult && (
                        <div className={`p-4 rounded-xl mb-6 ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            <div className="flex items-center gap-2 font-bold mb-1">
                                {isCorrect ? <CheckCircle className="w-5 h-5"/> : <XCircle className="w-5 h-5"/>}
                                {isCorrect ? 'Correct! Well done.' : 'Incorrect.'}
                            </div>
                            <p className="text-sm">{t(quiz.explanationKey)}</p>
                            {isCorrect && (
                                <div className="mt-3 flex items-center gap-1 text-green-700 font-bold bg-green-200 w-fit px-3 py-1 rounded-full text-sm">
                                    <Coins className="w-4 h-4"/> +₹{quiz.reward} Added
                                </div>
                            )}
                        </div>
                    )}

                    {showResult && (
                        <button onClick={handleClose} className="w-full bg-gray-800 text-white py-3 rounded-xl font-bold hover:bg-gray-900 transition-colors">
                            Continue
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};