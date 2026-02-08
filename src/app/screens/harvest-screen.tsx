import React from 'react';
import { useGame } from '../context/game-context';
import { TrendingUp, TrendingDown, AlertTriangle, ShieldCheck } from 'lucide-react';

export const HarvestScreen = () => {
  const { state, dispatch } = useGame();
  
  // FAILSAFE: If no stats exist (bug), default to zeros to prevent crash
  const stats = state.lastHarvestStats || {
      grossIncome: 0, totalExpenses: 0, netProfit: 0, yieldPercentage: 0, insurancePayout: 0
  };

  const isProfit = stats.netProfit >= 0;

  return (
    <div className="h-full p-6 flex flex-col items-center bg-game-bg animate-fade-in overflow-y-auto">
        <h1 className="text-2xl font-bold text-game-primary mb-2 mt-4">Harvest Report</h1>
        <p className="text-gray-500 mb-6">Season {state.seasonNumber} Results</p>

        {/* 1. Main Result Card */}
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

            {/* Detailed Breakdown */}
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

        {/* 2. Wallet Update */}
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

        {/* 3. Poverty Warning (Logic Check) */}
        {state.isPovertySpiral && (
             <div className="w-full bg-red-100 border-l-4 border-red-500 p-4 rounded mb-6 flex items-start gap-3">
                <AlertTriangle className="text-red-600 w-6 h-6 flex-shrink-0" />
                <div>
                    <h3 className="font-bold text-red-800">Debt Trap Warning</h3>
                    <p className="text-xs text-red-700 mt-1">
                        Your debt is growing faster than your income. You need to cut costs or increase yield immediately.
                    </p>
                </div>
            </div>
        )}

        <button 
            onClick={() => dispatch({ type: 'SHOW_RESILIENCE' })}
            className="w-full bg-white border-2 border-game-primary text-game-primary hover:bg-green-50 py-4 rounded-xl font-bold shadow-sm transition-colors mt-auto"
        >
            Check Resilience Score
        </button>
    </div>
  );
};