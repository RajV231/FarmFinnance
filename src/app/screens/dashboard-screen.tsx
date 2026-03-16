import React from 'react';
import { useGame } from '../context/game-context';
import { useLanguage } from '../context/language-context';
import { Sprout, Award, Shield, Target, User, TrendingUp, Coins, Home } from 'lucide-react';
import { FarmVisualizer } from '../components/farm-visualizer';
import { EducationPopup } from '../components/education-popup';
import { AdvisorBot } from '../components/advisor-bot';
import { BottomNav } from '../components/bottom-nav';

export const DashboardScreen = () => {
  const { state, dispatch } = useGame();
  const { t } = useLanguage();

  const creditPct = Math.min(100, Math.max(0, ((state.creditScore - 300) / 600) * 100));
  const goalPct = state.financialGoal ? Math.min(100, (state.savings / state.financialGoal.targetAmount) * 100) : 0;
  const dbtReceived = state.dbtBalance || 0;

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50 relative pb-24">
        <EducationPopup />
        
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 rounded-b-[2.5rem]"></div>
          <div className="relative px-6 pt-8 pb-6 text-white">
            <div className="flex justify-between items-center mb-6">
              <div 
                className="flex items-center gap-3 cursor-pointer active:scale-95 transition-transform" 
                onClick={() => dispatch({ type: 'GO_TO_PROFILE' })}
              >
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center ring-2 ring-white/30">
                  <User className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-xl leading-tight">{t('app_title')}</h2>
                  <p className="text-xs text-green-100 font-medium">
                    {t('season')} {state.seasonNumber} / {state.maxSeasons} • {state.totalAcres} {t('ui_acres')}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-1">
                  <Coins className="w-4 h-4 text-green-200" />
                  <span className="text-xs font-semibold text-green-100 uppercase tracking-wider">{t('header_savings')}</span>
                </div>
                <div className="text-2xl font-bold font-mono text-white">₹{state.savings.toLocaleString()}</div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-green-200" />
                  <span className="text-xs font-semibold text-green-100 uppercase tracking-wider">{t('header_wellbeing')}</span>
                </div>
                <div className="text-2xl font-bold font-mono text-white">{state.wellbeing}%</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex-1 overflow-y-auto scrollbar-hide px-4 -mt-4">
            <div className="mb-4"><AdvisorBot /></div>

            <div className="mb-6">
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                     <FarmVisualizer state={state} />
                     <div className="p-4 bg-gradient-to-br from-gray-50 to-white border-t border-gray-100">
                         <div className="flex justify-between items-center">
                            <div>
                              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">{t('setup_title')}</span>
                              <span className="text-sm font-bold text-gray-800">{state.totalAcres} {t('ui_acres')}</span>
                            </div>
                            <button 
                              onClick={() => dispatch({ type: 'START_SEASON' })} 
                              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2 hover:from-green-700 hover:to-emerald-700 active:scale-95 transition-all"
                            >
                              <Sprout className="w-5 h-5" /> {t('start_season')}
                            </button>
                         </div>
                     </div>
                </div>
            </div>

            <div className="mb-6">
                <div className="flex justify-between items-center mb-3 px-1">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">{t('dashboard_fin_health')}</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-2xl border border-green-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-green-600 rounded-xl flex items-center justify-center"><Coins className="w-4 h-4 text-white" /></div>
                          <div className="text-xs text-green-700 font-semibold uppercase tracking-wide">{t('header_savings')}</div>
                        </div>
                        <div className="text-2xl font-bold text-green-900 font-mono">₹{state.savings.toLocaleString()}</div>
                    </div>
                    <div className={`bg-gradient-to-br ${state.debt > 0 ? 'from-red-50 to-pink-50' : 'from-green-50 to-emerald-50'} p-5 rounded-2xl border ${state.debt > 0 ? 'border-red-100' : 'border-green-100'} shadow-sm`}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-8 h-8 ${state.debt > 0 ? 'bg-red-600' : 'bg-green-600'} rounded-xl flex items-center justify-center`}><TrendingUp className="w-4 h-4 text-white" /></div>
                          <div className={`text-xs font-semibold uppercase tracking-wide ${state.debt > 0 ? 'text-red-700' : 'text-green-700'}`}>{t('header_debt')}</div>
                        </div>
                        <div className={`text-2xl font-bold font-mono ${state.debt > 0 ? 'text-red-900' : 'text-green-900'}`}>
                            {state.debt > 0 ? `₹${state.debt.toLocaleString()}` : t('dashboard_debt_free')}
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center"><Shield className="w-4 h-4 text-white" /></div>
                          <div className="text-xs text-blue-700 font-semibold uppercase tracking-wide">{t('dashboard_govt_benefits')}</div>
                        </div>
                        <div className="text-2xl font-bold text-blue-900 font-mono">₹{dbtReceived.toLocaleString()}</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-2xl border border-purple-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-purple-600 rounded-xl flex items-center justify-center"><Home className="w-4 h-4 text-white" /></div>
                          <div className="text-xs text-purple-700 font-semibold uppercase tracking-wide">{t('header_wellbeing')}</div>
                        </div>
                        <div className="text-2xl font-bold text-purple-900 font-mono">{state.wellbeing}%</div>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center"><Award className="w-6 h-6" /></div>
                                <div><span className="text-sm font-semibold opacity-90 uppercase tracking-wider block">{t('credit_score')}</span><span className="text-3xl font-bold font-mono">{state.creditScore}</span></div>
                            </div>
                        </div>
                    </div>
                    <div className="p-5">
                        <div className="w-full bg-gray-100 rounded-full h-3 mb-3 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-1000" style={{ width: `${creditPct}%` }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 font-bold mb-4">
                            <span>{t('dashboard_poor')}</span><span>{t('dashboard_good')}</span><span>{t('dashboard_excellent')}</span>
                        </div>
                        <div className={`${state.creditScore >= 700 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'} text-sm p-3 rounded-xl border font-medium`}>
                            {state.creditScore >= 700 ? t('dashboard_kcc_qualify') : t('dashboard_repay_tip')}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-6 space-y-4">
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-5 text-white">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center"><Shield className="w-6 h-6" /></div>
                                <div><span className="text-sm font-semibold opacity-90 uppercase tracking-wider block">{t('dashboard_resil_score')}</span><span className="text-3xl font-bold font-mono">{state.resilienceScore}/100</span></div>
                            </div>
                        </div>
                    </div>
                    <div className="p-5">
                        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                            <div className="bg-gradient-to-r from-emerald-500 to-green-500 h-3 rounded-full transition-all duration-1000" style={{ width: `${state.resilienceScore}%` }}></div>
                        </div>
                    </div>
                </div>

                {state.financialGoal && (
                    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden cursor-pointer active:scale-98 transition-transform" onClick={() => dispatch({ type: 'GO_TO_GOALS' })}>
                        <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-5 text-white">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center"><Target className="w-6 h-6" /></div>
                                <div><span className="text-sm font-semibold opacity-90 uppercase tracking-wider block">{t('dashboard_dream_goal')}</span><span className="text-lg font-bold">{t(state.financialGoal.nameKey)}</span></div>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between text-sm font-bold text-gray-600 mb-2">
                                <span>{t('dashboard_saved')} ₹{state.savings.toLocaleString()}</span>
                                <span>{t('dashboard_target')} ₹{state.financialGoal.targetAmount.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-3 rounded-full transition-all duration-700" style={{ width: `${goalPct}%` }}></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

        <BottomNav />
    </div>
  );
};