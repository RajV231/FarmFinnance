import React, { useState } from 'react';
import { useGame } from '../context/game-context';
import { Landmark, Lock, ArrowLeft, Coins } from 'lucide-react';

export const BankScreen = () => {
    const { state, dispatch } = useGame();
    const [fdAmount, setFdAmount] = useState(0);
    const [goldGrams, setGoldGrams] = useState(0);

    const goldRate = 6000; // Per gram

    return (
        <div className="h-full bg-gray-50 p-6 flex flex-col animate-slide-up overflow-y-auto">
             <div className="flex items-center gap-2 mb-6">
                <button onClick={() => dispatch({ type: 'GO_TO_DASHBOARD' })}><ArrowLeft /></button>
                <h2 className="text-2xl font-bold text-gray-800">Gramin Bank</h2>
             </div>

             <div className="bg-game-primary text-white p-6 rounded-2xl shadow-lg mb-6">
                <div className="opacity-80 text-sm">Available Balance</div>
                <div className="text-3xl font-bold font-mono">₹{state.savings.toLocaleString()}</div>
             </div>

             {/* FIXED DEPOSIT */}
             <div className="bg-white p-5 rounded-xl shadow-sm mb-4 border-l-4 border-green-500">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg flex items-center gap-2"><Lock className="w-4 h-4" /> Fixed Deposit</h3>
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold">10% Return (2 Seasons)</span>
                </div>
                {state.bankBalance.fixedDeposit > 0 ? (
                    <div className="bg-gray-100 p-3 rounded text-center text-sm font-bold text-gray-600">
                        Locked: ₹{state.bankBalance.fixedDeposit} (Unlocks Season {state.bankBalance.fdMaturitySeason})
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <input type="number" placeholder="Amount" className="border p-2 rounded w-full" onChange={(e) => setFdAmount(Number(e.target.value))} />
                        <button 
                            onClick={() => dispatch({ type: 'BANK_TRANSACTION', payload: { type: 'DEPOSIT_FD', amount: fdAmount } })}
                            disabled={fdAmount > state.savings || fdAmount <= 0}
                            className="bg-green-600 text-white px-4 py-2 rounded font-bold disabled:opacity-50"
                        >Invest</button>
                    </div>
                )}
             </div>

             {/* GOLD INVESTMENT */}
             <div className="bg-white p-5 rounded-xl shadow-sm mb-4 border-l-4 border-yellow-500">
                 <h3 className="font-bold text-lg flex items-center gap-2 mb-2"><Coins className="w-4 h-4 text-yellow-600" /> Digital Gold</h3>
                 <div className="flex justify-between items-center bg-yellow-50 p-3 rounded mb-3">
                     <span className="text-sm text-yellow-800">Gold Held: {state.bankBalance.goldGrams}g</span>
                     <span className="font-bold text-yellow-700">Rate: ₹{goldRate}/g</span>
                 </div>
                 
                 <div className="flex gap-2 items-center mb-2">
                    <input type="number" placeholder="Grams" className="border p-2 rounded w-20" onChange={(e) => setGoldGrams(Number(e.target.value))} />
                    <button 
                        onClick={() => dispatch({ type: 'BANK_TRANSACTION', payload: { type: 'BUY_GOLD', amount: goldGrams * goldRate, grams: goldGrams } })}
                        disabled={(goldGrams * goldRate) > state.savings || goldGrams <= 0}
                        className="bg-yellow-600 text-white px-3 py-2 rounded text-sm font-bold flex-grow disabled:opacity-50"
                    >Buy (-₹{goldGrams * goldRate})</button>
                     <button 
                        onClick={() => dispatch({ type: 'BANK_TRANSACTION', payload: { type: 'SELL_GOLD', amount: goldGrams * goldRate, grams: goldGrams } })}
                        disabled={state.bankBalance.goldGrams < goldGrams || goldGrams <= 0}
                        className="bg-white border border-yellow-600 text-yellow-600 px-3 py-2 rounded text-sm font-bold flex-grow disabled:opacity-50"
                    >Sell (+₹{goldGrams * goldRate})</button>
                 </div>
             </div>
        </div>
    );
};