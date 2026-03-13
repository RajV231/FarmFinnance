import React, { useState } from 'react';
import { useGame } from '../context/game-context';
import { Building2, FileCheck, Coins, TrendingUp, Info, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { GOVERNMENT_SCHEMES, GovernmentScheme } from '../data/game-scenarios';
import clsx from 'clsx';

export const SchemesDashboard = () => {
  const { state } = useGame();
  const [selectedScheme, setSelectedScheme] = useState<GovernmentScheme | null>(null);

  // Calculate eligible schemes based on game state
  const getEligibleSchemes = () => {
    const eligible: GovernmentScheme[] = [];
    
    // PM-KISAN: All small farmers eligible
    if (state.totalAcres <= 5) {
      eligible.push(GOVERNMENT_SCHEMES.find(s => s.id === 'pm_kisan')!);
    }
    
    // PMFBY Subsidy: If buying insurance
    if (state.currentInsurance && state.currentInsurance.id !== 'none') {
      eligible.push(GOVERNMENT_SCHEMES.find(s => s.id === 'pmfby_subsidy')!);
    }
    
    // KCC Interest Subvention: If has KCC loan
    if (state.currentLoan && state.currentLoan.id === 'kcc') {
      eligible.push(GOVERNMENT_SCHEMES.find(s => s.id === 'kcc_interest')!);
    }
    
    // Asset subsidies: If farmer is small/marginal
    if (state.totalAcres <= 5) {
      eligible.push(GOVERNMENT_SCHEMES.find(s => s.id === 'drip_subsidy')!);
      eligible.push(GOVERNMENT_SCHEMES.find(s => s.id === 'solar_pump_subsidy')!);
    }
    
    return eligible;
  };

  const eligibleSchemes = getEligibleSchemes();
  
  const getSchemeStatus = (schemeId: string) => {
    if (state.activeSchemes.includes(schemeId)) {
      return { status: 'ACTIVE', label: 'Active', color: 'text-green-600 bg-green-100' };
    }
    if (eligibleSchemes.some(s => s.id === schemeId)) {
      return { status: 'ELIGIBLE', label: 'Available', color: 'text-blue-600 bg-blue-100' };
    }
    return { status: 'INELIGIBLE', label: 'Not Eligible', color: 'text-gray-400 bg-gray-100' };
  };

  const getSchemeIcon = (category: string) => {
    switch(category) {
      case 'INCOME_SUPPORT': return <Coins className="w-6 h-6" />;
      case 'INSURANCE_SUBSIDY': return <FileCheck className="w-6 h-6" />;
      case 'LOAN_BENEFIT': return <TrendingUp className="w-6 h-6" />;
      case 'ASSET_SUBSIDY': return <Building2 className="w-6 h-6" />;
      default: return <Info className="w-6 h-6" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'INCOME_SUPPORT': return 'bg-yellow-500';
      case 'INSURANCE_SUBSIDY': return 'bg-blue-500';
      case 'LOAN_BENEFIT': return 'bg-green-500';
      case 'ASSET_SUBSIDY': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl">
          <Building2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-800">Government Schemes</h3>
          <p className="text-xs text-gray-500">Direct Benefit Transfer (DBT) Portal</p>
        </div>
      </div>

      {/* DBT Summary Card */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-green-700 font-semibold mb-1">Total DBT Received</p>
            <p className="text-2xl font-bold text-green-800">₹{state.dbtReceived.toLocaleString()}</p>
          </div>
          <div className="bg-green-200 p-3 rounded-full">
            <Coins className="w-6 h-6 text-green-700" />
          </div>
        </div>
        <p className="text-xs text-green-600 mt-2">
          💡 Amount credited directly to your account via DBT
        </p>
      </div>

      {/* Active Schemes */}
      <div className="mb-6">
        <h4 className="font-bold text-sm text-gray-700 mb-3 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          Enrolled Schemes
        </h4>
        {state.activeSchemes.length === 0 ? (
          <div className="text-center py-4 bg-gray-50 rounded-lg">
            <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No active schemes yet</p>
            <p className="text-xs text-gray-400 mt-1">Enroll in schemes below to receive benefits</p>
          </div>
        ) : (
          <div className="space-y-2">
            {state.activeSchemes.map((schemeId) => {
              const scheme = GOVERNMENT_SCHEMES.find(s => s.id === schemeId);
              if (!scheme) return null;
              
              return (
                <div key={schemeId} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={clsx("p-2 rounded-lg", getCategoryColor(scheme.category))}>
                      {React.cloneElement(getSchemeIcon(scheme.category), { className: "w-4 h-4 text-white" })}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-green-800">{scheme.name}</p>
                      <p className="text-xs text-green-600">+₹{scheme.benefitAmount.toLocaleString()}/season</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-green-700 bg-green-200 px-2 py-1 rounded-full">
                    ACTIVE
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Available Schemes */}
      <div>
        <h4 className="font-bold text-sm text-gray-700 mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600" />
          Available for Enrollment
        </h4>
        <div className="space-y-3">
          {GOVERNMENT_SCHEMES.filter(s => !state.activeSchemes.includes(s.id)).map((scheme) => {
            const status = getSchemeStatus(scheme.id);
            const isEligible = status.status === 'ELIGIBLE' || status.status === 'ACTIVE';
            
            return (
              <div 
                key={scheme.id}
                onClick={() => isEligible && setSelectedScheme(scheme)}
                className={clsx(
                  "border rounded-xl p-4 transition-all cursor-pointer hover:shadow-md",
                  isEligible 
                    ? "border-blue-200 hover:border-blue-400 bg-white" 
                    : "border-gray-200 bg-gray-50 opacity-60"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={clsx("p-2 rounded-lg", getCategoryColor(scheme.category))}>
                      {React.cloneElement(getSchemeIcon(scheme.category), { className: "w-5 h-5 text-white" })}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h5 className="font-bold text-sm text-gray-800">{scheme.name}</h5>
                        <span className={clsx("text-[10px] font-bold px-2 py-0.5 rounded-full", status.color)}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{scheme.description}</p>
                      {scheme.benefitAmount > 0 && (
                        <p className="text-xs font-bold text-green-600 mt-2">
                          Benefit: ₹{scheme.benefitAmount.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {isEligible && !state.activeSchemes.includes(scheme.id) && (
                    <button className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-full font-bold hover:bg-blue-600 transition-colors">
                      Apply
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scheme Detail Modal */}
      {selectedScheme && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedScheme(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={clsx("p-6 rounded-t-2xl", getCategoryColor(selectedScheme.category))}>
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                  {getSchemeIcon(selectedScheme.category)}
                  <h3 className="text-xl font-bold">{selectedScheme.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedScheme(null)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <AlertCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-6">
                <h4 className="font-bold text-sm text-gray-700 mb-2">Description</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{selectedScheme.description}</p>
              </div>

              <div className="mb-6">
                <h4 className="font-bold text-sm text-gray-700 mb-2">Benefits</h4>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-lg font-bold text-green-700">
                    ₹{selectedScheme.benefitAmount.toLocaleString()} per season
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Credited directly via DBT to your bank account
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-bold text-sm text-gray-700 mb-2">Eligibility</h4>
                <ul className="space-y-1">
                  {selectedScheme.eligibility.map((criteria, idx) => (
                    <li key={idx} className="text-xs text-gray-600 flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      {criteria.replace('_', ' ')}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h4 className="font-bold text-sm text-gray-700 mb-2">DBT Status</h4>
                <div className="flex items-center gap-2 text-sm">
                  {selectedScheme.dbtEnabled ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-green-700 font-medium">DBT Enabled</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-4 h-4 text-orange-600" />
                      <span className="text-orange-700 font-medium">Manual Processing</span>
                    </>
                  )}
                </div>
              </div>

              {/* Action Button */}
              {!state.activeSchemes.includes(selectedScheme.id) && (
                <button
                  onClick={() => {
                    // In a real implementation, this would trigger enrollment
                    // For now, we'll just close the modal
                    setSelectedScheme(null);
                  }}
                  className="w-full bg-blue-500 text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors"
                >
                  Enroll Now
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
