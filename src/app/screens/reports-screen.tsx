import React from 'react';
import { useGame } from '../context/game-context';
import { useLanguage } from '../context/language-context';
import { FileText, ArrowLeft, TrendingUp, Coins, Shield } from 'lucide-react';

export const ReportsScreen = () => {
  const { state, dispatch } = useGame();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
        {/* Header */}
        <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800"></div>
            <div className="relative px-6 py-6 text-white">
                <div className="flex justify-between items-center mb-4">
                    <button 
                        onClick={() => dispatch({ type: 'GO_TO_DASHBOARD' })} 
                        className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl hover:bg-white/30 transition-all active:scale-95"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-semibold">Back</span>
                    </button>
                </div>

                <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center ring-2 ring-white/30">
                        <FileText className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">{t('reports')}</h2>
                        <p className="text-sm text-blue-100 font-medium">Season {state.seasonNumber} of {state.maxSeasons}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Content */}
        <div className="relative z-10 px-4 -mt-4 space-y-4 pb-10">
            {state.history.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-12">
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mb-4">
                            <FileText className="w-10 h-10 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">{t('reports_empty')}</p>
                        <p className="text-sm text-gray-400 mt-2">Complete seasons to see your reports here</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Summary Stats */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-gradient-to-br from-green-600 to-emerald-600 text-white p-4 rounded-2xl shadow-lg">
                            <div className="text-xs font-semibold opacity-90 uppercase tracking-wider mb-1">Total Income</div>
                            <div className="text-lg font-bold font-mono">
                                ₹{state.history.reduce((sum, record) => sum + record.income, 0).toLocaleString()}
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-4 rounded-2xl shadow-lg">
                            <div className="text-xs font-semibold opacity-90 uppercase tracking-wider mb-1">Seasons</div>
                            <div className="text-lg font-bold font-mono">{state.history.length}</div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white p-4 rounded-2xl shadow-lg">
                            <div className="text-xs font-semibold opacity-90 uppercase tracking-wider mb-1">Avg Resilience</div>
                            <div className="text-lg font-bold font-mono">
                                {Math.round(state.history.reduce((sum, record) => sum + record.resilience, 0) / state.history.length)}
                            </div>
                        </div>
                    </div>

                    {/* Season History */}
                    <div className="space-y-3">
                        {state.history.map((record, idx) => (
                            <div key={idx} className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                                <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 text-white">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center font-bold">
                                                {record.season}
                                            </div>
                                            <div>
                                                <span className="text-sm font-semibold opacity-90 uppercase tracking-wider block">{t('season')} {record.season}</span>
                                                <span className="text-xs opacity-80">Completed</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold font-mono">₹{record.income.toLocaleString()}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Shield className="w-4 h-4" />
                                            <span className="text-sm font-medium">{t('profile_resilience')}</span>
                                        </div>
                                        <span className="font-bold text-green-700 text-lg">{record.resilience}/100</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    </div>
  );
};
