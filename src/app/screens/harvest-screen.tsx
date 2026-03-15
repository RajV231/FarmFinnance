import React from 'react';
import { useGame } from '../context/game-context';
import { useLanguage } from '../context/language-context';
import { TrendingUp, TrendingDown, AlertTriangle, ShieldCheck } from 'lucide-react';
import { FarmVisualizer } from '../components/farm-visualizer';

export const HarvestScreen = () => {
  const { state, dispatch } = useGame();
  const { t } = useLanguage(); 
  
  const stats = state.lastHarvestStats || {
      grossIncome: 0, totalExpenses: 0, netProfit: 0, yieldPercentage: 0, insurancePayout: 0, assetMaintenanceCost: 0
  };

  const totalDebt = state.debt;
  const cashOnHand = state.savings; 
  const canPayFull = cashOnHand >= totalDebt;
  const minPayment = Math.floor(totalDebt * 0.1); 
  const isProfit = stats.netProfit >= 0;

  return (
    <div className="h-full flex flex-col bg-game-bg animate-fade-in overflow-y-auto">
        <div className="p-4 pb-0">
            <FarmVisualizer state={state} />
        </div>

        <div className="p-6">
            <h1 className="text-2xl font-bold text-game-primary mb-2 text-center">{t('ui_harvest_report')}</h1>
            <p className="text-gray-500 mb-6 text-center">{t('ui_season_results', { val: state.seasonNumber.toString() })}</p>

            <div className="bg-white w-full rounded-2xl shadow-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex flex-col">
                        <span className="text-sm text-gray-500 uppercase tracking-wider">{t('ui_net_profit')}</span>
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
                        <span className="text-gray-600">{t('ui_crop_sales')}</span>
                        <span className="font-bold">₹{stats.grossIncome.toLocaleString()}</span>
                    </div>
                    
                    {stats.insurancePayout > 0 && (
                        <div className="flex justify-between text-sm text-blue-600 bg-blue-50 p-2 rounded">
                            <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4"/> {t('ui_insurance_payout')}</span>
                            <span className="font-bold">+ ₹{stats.insurancePayout.toLocaleString()}</span>
                        </div>
                    )}

                    <div className="flex justify-between text-sm text-red-500">
                        <span>{t('ui_total_expenses')}</span>
                        <span>- ₹{stats.totalExpenses.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between items-center text-sm mb-2 pb-2 border-b">
                        <span className="text-gray-500">{t('ui_sold_at')}</span>
                        <span className="font-bold text-gray-800">{state.lastHarvestStats?.mandiName ? t(state.lastHarvestStats.mandiName) : ''}</span>
                    </div>

                    <div className="flex justify-between items-center text-sm text-red-500 mb-1">
                        <span>{t('ui_transport_cost')}</span>
                        <span>- ₹{state.lastHarvestStats?.transportCost?.toLocaleString()}</span>
                    </div>

                    {/* NEW: ASSET MAINTENANCE BLOCK */}
                    {stats.assetMaintenanceCost > 0 && (
                        <div className="flex justify-between items-center text-sm text-red-500 mb-1">
                            <span>{t('ui_maintenance')}</span>
                            <span>- ₹{stats.assetMaintenanceCost.toLocaleString()}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full mb-6">
                <div className="bg-game-primary text-white p-4 rounded-xl text-center shadow-lg">
                    <div className="text-xs opacity-80 mb-1">{t('ui_new_savings')}</div>
                    <div className="text-xl font-bold">₹{state.savings.toLocaleString()}</div>
                </div>
                <div className={`text-white p-4 rounded-xl text-center shadow-lg ${state.debt > 0 ? 'bg-red-500' : 'bg-green-500'}`}>
                    <div className="text-xs opacity-80 mb-1">{t('ui_current_debt')}</div>
                    <div className="text-xl font-bold">₹{state.debt.toLocaleString()}</div>
                </div>
            </div>

            {totalDebt > 0 ? (
                <div className="w-full bg-red-50 p-4 rounded-xl border border-red-200 mb-6">
                    <h3 className="font-bold text-red-800 mb-2">{t('ui_outstanding_debt')} ₹{totalDebt.toLocaleString()}</h3>
                    <p className="text-xs text-red-600 mb-4">{t('ui_repay_warning')}</p>

                    <div className="space-y-2">
                        <button 
                            disabled={!canPayFull}
                            onClick={() => dispatch({ type: 'REPAY_LOAN', payload: { amount: totalDebt, type: 'FULL' } })}
                            className={`w-full p-3 rounded-lg font-bold text-sm flex justify-between ${canPayFull ? 'bg-green-600 text-white shadow-md' : 'bg-gray-300 text-gray-500'}`}
                        >
                            <span>{t('ui_pay_full')}</span>
                            <span className="text-xs opacity-80">{t('ui_score_plus_50')}</span>
                        </button>

                        <button 
                            onClick={() => dispatch({ type: 'REPAY_LOAN', payload: { amount: minPayment, type: 'PARTIAL' } })}
                            className="w-full bg-white border border-yellow-500 text-yellow-700 p-3 rounded-lg font-bold text-sm flex justify-between hover:bg-yellow-50"
                        >
                            <span>{t('ui_pay_interest')} (₹{minPayment})</span>
                            <span className="text-xs opacity-80">{t('ui_score_minus_10')}</span>
                        </button>
                        
                        <button 
                            onClick={() => dispatch({ type: 'REPAY_LOAN', payload: { amount: 0, type: 'DEFAULT' } })}
                            className="w-full text-red-500 p-2 text-xs hover:underline text-center"
                        >
                            {t('ui_defer_pay')}
                        </button>
                    </div>
                </div>
            ) : (
                <button 
                    onClick={() => dispatch({ type: 'SHOW_RESILIENCE' })}
                    className="w-full bg-white border-2 border-game-primary text-game-primary hover:bg-green-50 py-4 rounded-xl font-bold shadow-sm transition-colors mt-auto mb-10"
                >
                    {t('ui_check_resilience')}
                </button>
            )}
        </div>
    </div>
  );
};