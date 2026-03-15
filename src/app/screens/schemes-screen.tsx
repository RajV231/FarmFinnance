import React from 'react';
import { useGame } from '../context/game-context';
import { useLanguage } from '../context/language-context';
import { Landmark, Shield, Sun, CheckCircle, ArrowLeft, Info, Droplet, Tractor, Sprout, TrendingUp, Percent } from 'lucide-react';

export const SchemesScreen = () => {
    const { state, dispatch } = useGame();
    const { t } = useLanguage();

    const schemes = [
        { id: 'pm_kisan', nameKey: 'sch_pmkisan_n', descKey: 'sch_pmkisan_d', benKey: 'sch_pmkisan_b', isEligible: state.totalAcres <= 5.0, eligKey: 'sch_pmkisan_e', icon: <Landmark className="w-full h-full" />, gradient: 'from-blue-600 to-indigo-600' },
        { id: 'pmfby', nameKey: 'sch_pmfby_n', descKey: 'sch_pmfby_d', benKey: 'sch_pmfby_b', isEligible: true, eligKey: 'sch_all_e', icon: <Shield className="w-full h-full" />, gradient: 'from-green-600 to-emerald-600' },
        { id: 'miss', nameKey: 'sch_miss_n', descKey: 'sch_miss_d', benKey: 'sch_miss_b', isEligible: state.creditScore >= 600, eligKey: 'sch_miss_e', icon: <Percent className="w-full h-full" />, gradient: 'from-purple-600 to-pink-600' },
        { id: 'soil_health', nameKey: 'sch_soil_n', descKey: 'sch_soil_d', benKey: 'sch_soil_b', isEligible: true, eligKey: 'sch_all_e', icon: <Sprout className="w-full h-full" />, gradient: 'from-emerald-600 to-green-600' },
        { id: 'enam', nameKey: 'sch_enam_n', descKey: 'sch_enam_d', benKey: 'sch_enam_b', isEligible: true, eligKey: 'sch_all_e', icon: <TrendingUp className="w-full h-full" />, gradient: 'from-orange-600 to-amber-600' },
        { id: 'pm_kusum', nameKey: 'sch_kusum_n', descKey: 'sch_kusum_d', benKey: 'sch_kusum_b', isEligible: true, eligKey: 'sch_all_e', icon: <Sun className="w-full h-full" />, gradient: 'from-yellow-600 to-amber-600' },
        { id: 'per_drop', nameKey: 'sch_drop_n', descKey: 'sch_drop_d', benKey: 'sch_drop_b', isEligible: true, eligKey: 'sch_all_e', icon: <Droplet className="w-full h-full" />, gradient: 'from-cyan-600 to-blue-600' },
        { id: 'smam', nameKey: 'sch_smam_n', descKey: 'sch_smam_d', benKey: 'sch_smam_b', isEligible: true, eligKey: 'sch_all_e', icon: <Tractor className="w-full h-full" />, gradient: 'from-red-600 to-orange-600' }
    ];

    const handleApply = (schemeId: string) => {
        dispatch({ type: 'APPLY_SCHEME', payload: schemeId });
    };

    const enrolledCount = state.activeSchemes.length;

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* MODERN HEADER */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800"></div>
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
                      <Shield className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{t('schemes')}</h2>
                      <p className="text-sm text-blue-100 font-medium">Government support programs</p>
                    </div>
                </div>

                {/* Enrollment Stats */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-xs font-semibold text-blue-100 uppercase tracking-wider mb-1">Enrolled Programs</div>
                            <div className="text-3xl font-bold font-mono">{enrolledCount} / {schemes.length}</div>
                        </div>
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                            <div className="text-2xl font-bold">{Math.round((enrolledCount / schemes.length) * 100)}%</div>
                        </div>
                    </div>
                </div>
              </div>
            </div>

            {/* CONTENT */}
            <div className="relative z-10 px-4 -mt-4 space-y-4 overflow-y-auto pb-10">
                {/* Info Card */}
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800 font-medium">
                        {t('sch_info')}
                    </p>
                </div>

                {/* Schemes Grid */}
                {schemes.map(scheme => {
                    const isEnrolled = state.activeSchemes.includes(scheme.id);
                    
                    return (
                        <div 
                          key={scheme.id} 
                          className={`relative overflow-hidden rounded-3xl border-2 transition-all ${
                            isEnrolled 
                              ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg' 
                              : scheme.isEligible
                                ? 'bg-white border-gray-200 shadow-md hover:shadow-lg hover:border-blue-300'
                                : 'bg-gray-50 border-gray-200 opacity-75'
                          }`}
                        >
                            {/* Enrolled Badge */}
                            {isEnrolled && (
                                <div className="absolute top-4 right-4 z-10">
                                    <div className="bg-green-600 text-white p-2 rounded-full shadow-lg">
                                        <CheckCircle className="w-5 h-5" />
                                    </div>
                                </div>
                            )}

                            <div className="p-6">
                                {/* Scheme Header */}
                                <div className="flex items-start gap-4 mb-4">
                                    <div className={`w-16 h-16 bg-gradient-to-br ${scheme.gradient} rounded-2xl flex items-center justify-center flex-shrink-0 text-white shadow-lg`}>
                                        {scheme.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-xl text-gray-900 mb-1">{t(scheme.nameKey)}</h3>
                                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                                          scheme.isEligible 
                                            ? 'bg-green-100 text-green-700' 
                                            : 'bg-red-100 text-red-700'
                                        }`}>
                                            {t('sch_eligibility')}: {t(scheme.eligKey)}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Description */}
                                <p className="text-sm text-gray-600 leading-relaxed mb-4">{t(scheme.descKey)}</p>
                                
                                {/* Benefit Badge */}
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-800 p-3 rounded-xl mb-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <TrendingUp className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase tracking-wider">{t('sch_benefit')}</span>
                                    </div>
                                    <p className="text-sm font-bold">{t(scheme.benKey)}</p>
                                </div>
                                
                                {/* Action Button */}
                                {isEnrolled ? (
                                    <div className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-center rounded-2xl flex items-center justify-center gap-2 shadow-md">
                                        <CheckCircle className="w-5 h-5" />
                                        {t('sch_enrolled')}
                                    </div>
                                ) : scheme.isEligible ? (
                                    <button 
                                      onClick={() => handleApply(scheme.id)} 
                                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl shadow-lg hover:from-blue-700 hover:to-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Shield className="w-5 h-5" />
                                        {t('sch_apply')}
                                    </button>
                                ) : (
                                    <div className="w-full py-4 bg-gray-200 text-gray-500 font-bold text-center rounded-2xl">
                                        {t('sch_not_eligible')}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
