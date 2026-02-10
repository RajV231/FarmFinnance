import React from 'react';
import { useGame, FinancialGoal } from '../context/game-context';
import { Home, GraduationCap, Tractor } from 'lucide-react';

const GOALS: FinancialGoal[] = [
    { id: 'education', name: "Child's Education", targetAmount: 50000, description: "Secure a bright future for your children." },
    { id: 'tractor', name: "Buy a Tractor", targetAmount: 150000, description: "Mechanize your farm for higher yields." },
    { id: 'house', name: "Build Pucca House", targetAmount: 300000, description: "Safety and comfort for your family." },
];

export const GoalSelectionScreen = () => {
    const { dispatch } = useGame();

    return (
        <div className="h-full bg-game-bg p-6 flex flex-col justify-center animate-slide-up">
            <h1 className="text-3xl font-bold text-game-primary mb-2 text-center">What is your Dream?</h1>
            <p className="text-gray-500 text-center mb-8">Financial literacy helps you achieve life goals.</p>

            <div className="space-y-4">
                {GOALS.map(goal => (
                    <button 
                        key={goal.id}
                        onClick={() => dispatch({ type: 'SET_GOAL', payload: goal })}
                        className="w-full bg-white p-6 rounded-2xl shadow-sm border-2 border-transparent hover:border-game-primary transition-all flex items-center gap-4 text-left"
                    >
                        <div className="bg-green-100 p-3 rounded-full">
                            {goal.id === 'education' && <GraduationCap className="text-green-700 w-6 h-6" />}
                            {goal.id === 'tractor' && <Tractor className="text-green-700 w-6 h-6" />}
                            {goal.id === 'house' && <Home className="text-green-700 w-6 h-6" />}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-800">{goal.name}</h3>
                            <p className="text-sm text-gray-500">{goal.description}</p>
                            <div className="mt-1 font-mono font-bold text-game-primary">Target: ₹{goal.targetAmount.toLocaleString()}</div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};