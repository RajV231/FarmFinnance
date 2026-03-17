import React from 'react';
import { useGame } from '../context/game-context';
import { useLanguage } from '../context/language-context';
import { TrendingUp, TrendingDown, ShieldCheck, Coins, AlertTriangle } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col bg-gray-50 animate-fade-in overflow-y-auto pb-10">
        {/* Farm Visualizer */}
        <div className="p-4">
            <FarmVisualizer state={state} />
        </div>

        <div className="px-6 py-4">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{t('ui_harvest_report')}</h1>
                <p className="text-gray-500 font-medium">{t('ui_season_results', { val: state.seasonNumber.toString() })}</p>
            </div>

            {/* Net Profit Card */}
            <div className={`rounded-3xl shadow-xl overflow-hidden mb-6 ${
              isProfit ? 'bg-gradient-to-br from-green-50 to-emerald-50' : 'bg-gradient-to-br from-red-50 to-pink-50'
            }`}>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <span className="text-sm text-gray-600 font-semibold uppercase tracking-wider block mb-1">
                                {t('ui_net_profit')}
                            </span>
                            <span className={`text-4xl font-bold ${isProfit ? 'text-green-700' : 'text-red-600'}`}>
                                {isProfit ? '+' : ''}₹{stats.netProfit.toLocaleString('en-IN')}
                            </span>
                        </div>
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                          isProfit ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                            {isProfit ? <TrendingUp className="text-green-600 w-8 h-8" /> : <TrendingDown className="text-red-600 w-8 h-8" />}
                        </div>
                    </div>

                    {/* Income/Expense Breakdown */}
                    <div className="space-y-3 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 font-medium">{t('ui_crop_sales')}</span>
                            <span className="font-bold text-gray-900 font-mono">₹{stats.grossIncome.toLocaleString('en-IN')}</span>
                        </div>
                        
                        {stats.insurancePayout > 0 && (
                            <div className="flex justify-between items-center bg-blue-100 -mx-2 px-2 py-2 rounded-xl">
                                <div className="flex items-center gap-2 text-blue-700">
                                    <ShieldCheck className="w-4 h-4"/>
                                    <span className="text-sm font-medium">{t('ui_insurance_payout')}</span>
                                </div>
                                <span className="font-bold text-blue-800 font-mono">+ ₹{stats.insurancePayout.toLocaleString('en-IN')}</span>
                            </div>
                        )}

                        <div className="flex justify-between items-center text-red-600">
                            <span className="text-sm font-medium">{t('ui_total_expenses')}</span>
                            <span className="font-bold font-mono">- ₹{stats.totalExpenses.toLocaleString('en-IN')}</span>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                            <span className="text-sm text-gray-600 font-medium">{t('ui_sold_at')}</span>
                            <span className="font-bold text-gray-800">{state.lastHarvestStats?.mandiName ? t(state.lastHarvestStats.mandiName) : ''}</span>
                        </div>

                        <div className="flex justify-between items-center text-red-500">
                            <span className="text-sm font-medium">{t('ui_transport_cost')}</span>
                            <span className="font-bold font-mono">- ₹{state.lastHarvestStats?.transportCost?.toLocaleString('en-IN')}</span>
                        </div>

                        {stats.assetMaintenanceCost > 0 && (
                            <div className="flex justify-between items-center text-red-500">
                                <span className="text-sm font-medium">{t('ui_maintenance')}</span>
                                <span className="font-bold font-mono">- ₹{stats.assetMaintenanceCost.toLocaleString('en-IN')}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Financial Summary Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
    {/* NEW SAVINGS BLOCK */}
    {/* Added min-w-0 to prevent grid blowout */}
    <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-3xl text-white shadow-lg min-w-0">
        <div className="text-xs font-bold uppercase tracking-wider mb-1 opacity-90 truncate">
            {t('new_savings') || 'New Savings'}
        </div>
        {/* Added truncate and responsive text sizing */}
        <div className="text-xl sm:text-2xl md:text-3xl font-bold font-mono truncate" title={`₹${state.savings.toLocaleString('en-IN')}`}>
            ₹{state.savings.toLocaleString('en-IN')}
        </div>
    </div>

    {/* CURRENT DEBT BLOCK */}
    {/* Added min-w-0 to prevent grid blowout */}
    <div className="bg-gradient-to-br from-red-500 to-rose-600 p-4 rounded-3xl text-white shadow-lg min-w-0">
        <div className="text-xs font-bold uppercase tracking-wider mb-1 opacity-90 truncate">
            {t('current_debt') || 'Current Debt'}
        </div>
        {/* Added truncate and responsive text sizing */}
        <div className="text-xl sm:text-2xl md:text-3xl font-bold font-mono truncate" title={`₹${state.debt.toLocaleString('en-IN')}`}>
            ₹{state.debt.toLocaleString('en-IN')}
        </div>
    </div>
</div>

            {/* Debt Repayment Section */}
            {totalDebt > 0 ? (
                <div className="bg-gradient-to-br from-red-50 to-pink-50 p-5 rounded-3xl border-2 border-red-200 mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <h3 className="font-bold text-red-800">{t('ui_outstanding_debt')} ₹{totalDebt.toLocaleString('en-IN')}</h3>
                    </div>
                    <p className="text-xs text-red-600 mb-4 font-medium">{t('ui_repay_warning')}</p>

                    <div className="space-y-2">
                        <button 
                            disabled={!canPayFull}
                            onClick={() => dispatch({ type: 'REPAY_LOAN', payload: { amount: totalDebt, type: 'FULL' } })}
                            className={`w-full p-4 rounded-2xl font-bold transition-all flex items-center justify-between ${
                              canPayFull 
                                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg hover:from-green-700 hover:to-emerald-700 active:scale-95' 
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            <span>{t('ui_pay_full')}</span>
                            <span className="text-xs opacity-80">{t('ui_score_plus_50')}</span>
                        </button>

                        <button 
    disabled={cashOnHand < minPayment}
    onClick={() => dispatch({ type: 'REPAY_LOAN', payload: { amount: minPayment, type: 'PARTIAL' } })}
    className={`w-full p-4 rounded-2xl font-bold transition-all flex items-center justify-between ${
        cashOnHand >= minPayment 
            ? 'bg-white border-2 border-yellow-500 text-yellow-700 hover:bg-yellow-50 active:scale-95' 
            : 'bg-gray-100 border-2 border-gray-200 text-gray-400 cursor-not-allowed'
    }`}
>
    <span>{t('ui_pay_interest')} (₹{minPayment.toLocaleString('en-IN')})</span>
    <span className="text-xs opacity-80">{t('ui_score_minus_10')}</span>
</button>
                        
                        <button 
                            onClick={() => dispatch({ type: 'REPAY_LOAN', payload: { amount: 0, type: 'DEFAULT' } })}
                            className="w-full text-red-600 p-3 text-sm hover:underline text-center font-bold"
                        >
                            {t('ui_defer_pay')}
                        </button>
                    </div>
                </div>
            ) : (
                <button 
                    onClick={() => dispatch({ type: 'SHOW_RESILIENCE' })}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-5 rounded-2xl font-bold shadow-lg hover:from-green-700 hover:to-emerald-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    <Coins className="w-5 h-5" />
                    {t('ui_check_resilience')}
                </button>
            )}
        </div>
    </div>
  );
};
