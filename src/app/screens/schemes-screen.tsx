import React from 'react';
import { useGame } from '../context/game-context';
import { Landmark, Shield, Sun, CheckCircle, ArrowLeft, Info, Droplet, Tractor, Sprout, TrendingUp, Percent } from 'lucide-react';

export const SchemesScreen = () => {
    const { state, dispatch } = useGame();

    const schemes = [
        {
            id: 'pm_kisan', name: 'PM-KISAN Yojana', icon: <Landmark className="w-8 h-8 text-blue-600" />,
            desc: 'Direct Benefit Transfer (DBT) providing income support to farmers.',
            benefit: 'Receives ₹2,000 per season directly into bank account.',
            isEligible: state.totalAcres <= 5.0, eligibilityText: 'Must own 5 acres or less of land.'
        },
        {
            id: 'pmfby', name: 'PMFBY Crop Insurance', icon: <Shield className="w-8 h-8 text-green-600" />,
            desc: 'Pradhan Mantri Fasal Bima Yojana protects against natural calamities.',
            benefit: 'Reduces PMFBY crop insurance premiums by 50%.',
            isEligible: true, eligibilityText: 'All farmers are eligible.'
        },
        {
            id: 'miss', name: 'MISS (Interest Subvention)', icon: <Percent className="w-8 h-8 text-purple-600" />,
            desc: 'Modified Interest Subvention Scheme for short-term agricultural loans.',
            benefit: 'Reduces KCC Loan interest rate from 7% to 4%.',
            isEligible: state.creditScore >= 600, eligibilityText: 'Requires Credit Score of 600+.'
        },
        {
            id: 'soil_health', name: 'Soil Health Card', icon: <Sprout className="w-8 h-8 text-emerald-600" />,
            desc: 'Provides crop-wise recommendations of nutrients and fertilizers required.',
            benefit: 'Reduces seasonal crop input costs by 10%.',
            isEligible: true, eligibilityText: 'All farmers are eligible.'
        },
        {
            id: 'enam', name: 'e-NAM Portal', icon: <TrendingUp className="w-8 h-8 text-orange-600" />,
            desc: 'National Agriculture Market connects farmers to nationwide buyers digitally.',
            benefit: 'Increases final crop selling price by 10%.',
            isEligible: true, eligibilityText: 'All farmers are eligible.'
        },
        {
            id: 'pm_kusum', name: 'PM-KUSUM Subsidy', icon: <Sun className="w-8 h-8 text-yellow-600" />,
            desc: 'Government subsidy scheme for solar-powered irrigation.',
            benefit: '50% Off capital cost when buying a Solar Water Pump.',
            isEligible: true, eligibilityText: 'All farmers are eligible.'
        },
        {
            id: 'per_drop', name: 'Per Drop More Crop', icon: <Droplet className="w-8 h-8 text-cyan-600" />,
            desc: 'Promotes micro-irrigation technologies to ensure water efficiency.',
            benefit: '50% Off capital cost when buying Drip Irrigation.',
            isEligible: true, eligibilityText: 'All farmers are eligible.'
        },
        {
            id: 'smam', name: 'SMAM (Mechanization)', icon: <Tractor className="w-8 h-8 text-red-600" />,
            desc: 'Sub-Mission on Agricultural Mechanization to make machinery affordable.',
            benefit: '50% Off capital cost when buying a Mini Tractor.',
            isEligible: true, eligibilityText: 'All farmers are eligible.'
        }
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
                <h2 className="text-2xl font-bold text-game-primary">Govt. Schemes</h2>
             </div>

             <div className="bg-blue-50 text-blue-800 p-4 rounded-xl mb-6 flex items-start gap-3 shadow-sm border border-blue-200">
                 <Info className="w-6 h-6 flex-shrink-0 mt-1" />
                 <p className="text-sm">Applying for government schemes is free. They provide crucial financial safety nets and subsidies to help your farm grow.</p>
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
                                         <h3 className="font-bold text-lg text-gray-800">{scheme.name}</h3>
                                         <div className={`text-xs font-medium ${scheme.isEligible ? 'text-gray-500' : 'text-red-500'}`}>
                                            Eligibility: {scheme.eligibilityText}
                                         </div>
                                     </div>
                                 </div>
                             </div>
                             <p className="text-sm text-gray-600 mb-3">{scheme.desc}</p>
                             <div className="bg-green-50 text-green-800 text-xs font-bold px-3 py-2 rounded-lg mb-4">
                                 Benefit: {scheme.benefit}
                             </div>
                             {isEnrolled ? (
                                 <div className="w-full flex items-center justify-center gap-2 py-3 bg-green-100 text-green-700 font-bold rounded-xl">
                                     <CheckCircle className="w-5 h-5" /> Enrolled & Active
                                 </div>
                             ) : scheme.isEligible ? (
                                 <button onClick={() => handleApply(scheme.id)} className="w-full py-3 bg-game-primary text-white font-bold rounded-xl shadow-md hover:bg-game-primaryDark transition-all">
                                     Apply Now
                                 </button>
                             ) : (
                                 <div className="w-full py-3 bg-gray-100 text-gray-400 font-bold text-center rounded-xl">
                                     Not Eligible
                                 </div>
                             )}
                         </div>
                     );
                 })}
             </div>
        </div>
    );
};