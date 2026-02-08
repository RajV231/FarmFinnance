import React from 'react';
import { useGame } from '../context/game-context';
import { TrendingUp, TrendingDown, AlertTriangle, ShieldCheck } from 'lucide-react';
import { FarmVisualizer } from '../components/farm-visualizer'; // IMPORT

export const HarvestScreen = () => {
  const { state, dispatch } = useGame();
  
  const stats = state.lastHarvestStats || {
      grossIncome: 0, totalExpenses: 0, netProfit: 0, yieldPercentage: 0, insurancePayout: 0
  };

  const totalDebt = state.debt;
  const cashOnHand = state.savings; 
  const canPayFull = cashOnHand >= totalDebt;
  const minPayment = Math.floor(totalDebt * 0.1); 
  const isProfit = stats.netProfit >= 0;

  return (
    <div className="h-full flex flex-col bg-game-bg animate-fade-in overflow-y-auto">
        
        {/* 1. VISUALIZER AT TOP */}
        <div className="p-4 pb-0">
            <FarmVisualizer state={state} />
        </div>

        <div className="p-6">
            <h1 className="text-2xl font-bold text-game-primary mb-2 text-center">Harvest Report</h1>
            <p className="text-gray-500 mb-6 text-center">Season {state.seasonNumber} Results</p>

            {/* Main Result Card */}
            <div className="bg-white w-full rounded-2xl shadow-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex flex-col">
                        <span className="text-sm text-gray-500 uppercase tracking-wider">Net Profit</span>
                        <span className={`text-3xl font-bold ${isProfit ? 'text-green-600' : 'text-red-500'}`}>
                            {isProfit ? '+' : ''}₹{stats.netProfit.toLocaleString()}
                        </span>
                    </div>
                    <div className={`p-3 rounded-full ${isProfit ? 'bg-green-100' : 'bg-red-100'}`}>
                        {isProfit ? <TrendingUp className="text-green-600" /> : <TrendingDown className="text-red-600" />}
                    </div>
                </div>

                <div className="space-y-3 border-t pt-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Crop Sales Income</span>
                        <span className="font-bold">₹{stats.grossIncome.toLocaleString()}</span>
                    </div>
                    
                    {stats.insurancePayout > 0 && (
                        <div className="flex justify-between text-sm text-blue-600 bg-blue-50 p-2 rounded">
                            <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4"/> Insurance Payout</span>
                            <span className="font-bold">+ ₹{stats.insurancePayout.toLocaleString()}</span>
                        </div>
                    )}

                    <div className="flex justify-between text-sm text-red-500">
                        <span>Total Expenses</span>
                        <span>- ₹{stats.totalExpenses.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Wallet Update */}
            <div className="grid grid-cols-2 gap-4 w-full mb-6">
                <div className="bg-game-primary text-white p-4 rounded-xl text-center shadow-lg">
                    <div className="text-xs opacity-80 mb-1">New Savings</div>
                    <div className="text-xl font-bold">₹{state.savings.toLocaleString()}</div>
                </div>
                <div className={`text-white p-4 rounded-xl text-center shadow-lg ${state.debt > 0 ? 'bg-red-500' : 'bg-green-500'}`}>
                    <div className="text-xs opacity-80 mb-1">Current Debt</div>
                    <div className="text-xl font-bold">₹{state.debt.toLocaleString()}</div>
                </div>
            </div>

            {/* Debt Management */}
            {totalDebt > 0 ? (
                <div className="w-full bg-red-50 p-4 rounded-xl border border-red-200 mb-6">
                    <h3 className="font-bold text-red-800 mb-2">Outstanding Debt: ₹{totalDebt.toLocaleString()}</h3>
                    <p className="text-xs text-red-600 mb-4">Repayment affects your Credit Score.</p>

                    <div className="space-y-2">
                        <button 
                            disabled={!canPayFull}
                            onClick={() => dispatch({ type: 'REPAY_LOAN', payload: { amount: totalDebt, type: 'FULL' } })}
                            className={`w-full p-3 rounded-lg font-bold text-sm flex justify-between ${canPayFull ? 'bg-green-600 text-white shadow-md' : 'bg-gray-300 text-gray-500'}`}
                        >
                            <span>Pay Full Amount</span>
                            <span className="text-xs opacity-80">(+50 Score)</span>
                        </button>

                        <button 
                            onClick={() => dispatch({ type: 'REPAY_LOAN', payload: { amount: minPayment, type: 'PARTIAL' } })}
                            className="w-full bg-white border border-yellow-500 text-yellow-700 p-3 rounded-lg font-bold text-sm flex justify-between hover:bg-yellow-50"
                        >
                            <span>Pay Interest Only (₹{minPayment})</span>
                            <span className="text-xs opacity-80">(-10 Score)</span>
                        </button>
                        
                        <button 
                            onClick={() => dispatch({ type: 'REPAY_LOAN', payload: { amount: 0, type: 'DEFAULT' } })}
                            className="w-full text-red-500 p-2 text-xs hover:underline text-center"
                        >
                            Defer Payment (Risk Default)
                        </button>
                    </div>
                </div>
            ) : (
                <button 
                    onClick={() => dispatch({ type: 'SHOW_RESILIENCE' })}
                    className="w-full bg-white border-2 border-game-primary text-game-primary hover:bg-green-50 py-4 rounded-xl font-bold shadow-sm transition-colors mt-auto mb-10"
                >
                    Check Resilience Score
                </button>
            )}
        </div>
    </div>
  );
};