import React from 'react';
import { useGame } from '../context/game-context';
import { useLanguage } from '../context/language-context'; // NEW
import { Landmark, Shield, Sun, CheckCircle, ArrowLeft, Info, Droplet, Tractor, Sprout, TrendingUp, Percent } from 'lucide-react';

export const SchemesScreen = () => {
    const { state, dispatch } = useGame();
    const { t } = useLanguage(); // NEW

    // Data is now keyed!
    const schemes = [
        { id: 'pm_kisan', nameKey: 'sch_pmkisan_n', descKey: 'sch_pmkisan_d', benKey: 'sch_pmkisan_b', isEligible: state.totalAcres <= 5.0, eligKey: 'sch_pmkisan_e', icon: <Landmark className="w-8 h-8 text-blue-600" /> },
        { id: 'pmfby', nameKey: 'sch_pmfby_n', descKey: 'sch_pmfby_d', benKey: 'sch_pmfby_b', isEligible: true, eligKey: 'sch_all_e', icon: <Shield className="w-8 h-8 text-green-600" /> },
        { id: 'miss', nameKey: 'sch_miss_n', descKey: 'sch_miss_d', benKey: 'sch_miss_b', isEligible: state.creditScore >= 600, eligKey: 'sch_miss_e', icon: <Percent className="w-8 h-8 text-purple-600" /> },
        { id: 'soil_health', nameKey: 'sch_soil_n', descKey: 'sch_soil_d', benKey: 'sch_soil_b', isEligible: true, eligKey: 'sch_all_e', icon: <Sprout className="w-8 h-8 text-emerald-600" /> },
        { id: 'enam', nameKey: 'sch_enam_n', descKey: 'sch_enam_d', benKey: 'sch_enam_b', isEligible: true, eligKey: 'sch_all_e', icon: <TrendingUp className="w-8 h-8 text-orange-600" /> },
        { id: 'pm_kusum', nameKey: 'sch_kusum_n', descKey: 'sch_kusum_d', benKey: 'sch_kusum_b', isEligible: true, eligKey: 'sch_all_e', icon: <Sun className="w-8 h-8 text-yellow-600" /> },
        { id: 'per_drop', nameKey: 'sch_drop_n', descKey: 'sch_drop_d', benKey: 'sch_drop_b', isEligible: true, eligKey: 'sch_all_e', icon: <Droplet className="w-8 h-8 text-cyan-600" /> },
        { id: 'smam', nameKey: 'sch_smam_n', descKey: 'sch_smam_d', benKey: 'sch_smam_b', isEligible: true, eligKey: 'sch_all_e', icon: <Tractor className="w-8 h-8 text-red-600" /> }
    ];

    const handleApply = (schemeId: string) => {
        dispatch({ type: 'APPLY_SCHEME', payload: schemeId });
    };

    return (
        <div className="h-full bg-game-bg p-6 flex flex-col animate-slide-up overflow-y-auto">
             <div className="flex items-center gap-2 mb-6">
                <button onClick={() => dispatch({ type: 'GO_TO_DASHBOARD' })} className="p-2 bg-white rounded-full text-gray-600 hover:bg-gray-100 shadow-sm">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-2xl font-bold text-game-primary">{t('schemes')}</h2>
             </div>

             <div className="bg-blue-50 text-blue-800 p-4 rounded-xl mb-6 flex items-start gap-3 shadow-sm border border-blue-200">
                 <Info className="w-6 h-6 flex-shrink-0 mt-1" />
                 <p className="text-sm">{t('sch_info')}</p>
             </div>

             <div className="space-y-4 pb-10">
                 {schemes.map(scheme => {
                     const isEnrolled = state.activeSchemes.includes(scheme.id);
                     return (
                         <div key={scheme.id} className={`p-5 rounded-2xl border-2 shadow-sm bg-white transition-all ${isEnrolled ? 'border-green-500' : 'border-gray-200'}`}>
                             <div className="flex items-start justify-between mb-3">
                                 <div className="flex items-center gap-3">
                                     <div className={`p-3 rounded-xl ${isEnrolled ? 'bg-green-50' : 'bg-gray-50'}`}>
                                         {scheme.icon}
                                     </div>
                                     <div>
                                         <h3 className="font-bold text-lg text-gray-800">{t(scheme.nameKey)}</h3>
                                         <div className={`text-xs font-medium ${scheme.isEligible ? 'text-gray-500' : 'text-red-500'}`}>
                                            {t('sch_eligibility')}: {t(scheme.eligKey)}
                                         </div>
                                     </div>
                                 </div>
                             </div>
                             <p className="text-sm text-gray-600 mb-3">{t(scheme.descKey)}</p>
                             <div className="bg-green-50 text-green-800 text-xs font-bold px-3 py-2 rounded-lg mb-4">
                                 {t('sch_benefit')}: {t(scheme.benKey)}
                             </div>
                             {isEnrolled ? (
                                 <div className="w-full flex items-center justify-center gap-2 py-3 bg-green-100 text-green-700 font-bold rounded-xl">
                                     <CheckCircle className="w-5 h-5" /> {t('sch_enrolled')}
                                 </div>
                             ) : scheme.isEligible ? (
                                 <button onClick={() => handleApply(scheme.id)} className="w-full py-3 bg-game-primary text-white font-bold rounded-xl shadow-md hover:bg-game-primaryDark transition-all">
                                     {t('sch_apply')}
                                 </button>
                             ) : (
                                 <div className="w-full py-3 bg-gray-100 text-gray-400 font-bold text-center rounded-xl">
                                     {t('sch_not_eligible')}
                                 </div>
                             )}
                         </div>
                     );
                 })}
             </div>
        </div>
    );
};