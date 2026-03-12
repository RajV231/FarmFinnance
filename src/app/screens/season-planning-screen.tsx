import React, { useState, useMemo, useEffect } from 'react';
import { useGame } from '../context/game-context';
import { CROPS, LOANS, INSURANCES, GOVERNMENT_SCHEMES } from '../data/game-scenarios';
import { Shield, Coins, Ruler, AlertTriangle, ArrowLeft, TrendingUp, TrendingDown, Info, BarChart3 } from 'lucide-react';
import clsx from 'clsx';
import { FarmVisualizer } from '../components/farm-visualizer';
import { EducationPopup, useEducationTip } from '../components/education-popup';
import { MarketPricesModal, useMarketModal } from '../components/market-prices-modal';

export const SeasonPlanningScreen = () => {
  const { dispatch, state } = useGame();
  
  // Initialize hooks for Phase 1 features
  const educationTip = useEducationTip();
  const marketModal = useMarketModal();
  
  const acres = state.totalAcres; 

  const availableCrops = useMemo(() => {
    if (state.farmType === 'MIXED') return CROPS;
    const targetType = state.farmType === 'CROPS' ? 'CROP' : 'VEGETABLE';
    return CROPS.filter(c => c.type === targetType);
  }, [state.farmType]);

  const [cropId, setCropId] = useState(availableCrops[0]?.id || CROPS[0].id);
  const [loanId, setLoanId] = useState<string | null>(null);
  const [loanAmount, setLoanAmount] = useState(0);
  const [hasInsurance, setInsurance] = useState(false);
  const [savingsAlloc, setSavingsAlloc] = useState(Math.min(5000, state.savings));

  const selectedCrop = CROPS.find(c => c.id === cropId)!;
  const selectedLoan = loanId ? LOANS.find(l => l.id === loanId)! : LOANS[0];

  const totalSeedCost = selectedCrop.costPerAcre * acres;
  const insuranceCost = hasInsurance ? (INSURANCES[1].premium * acres) : 0;
  const totalUpfrontCost = totalSeedCost + insuranceCost;

  // Trigger education tips based on user actions
  useEffect(() => {
    if (selectedCrop.riskFactor > 0.7) {
      educationTip.showTip('high_risk_crop_selected');
    }
  }, [cropId]);

  useEffect(() => {
    if (!loanId && totalUpfrontCost > state.savings) {
      educationTip.showTip('loan_selection');
    }
  }, [loanId, totalUpfrontCost]);

  useEffect(() => {
    if (!hasInsurance) {
      educationTip.showTip('insurance_selection');
    }
  }, [hasInsurance]);

  const handleConfirm = () => {
    const available = savingsAlloc + (loanId ? loanAmount : 0);
    if (available < totalUpfrontCost) {
        alert(`Insufficient Funds! You need ₹${totalUpfrontCost.toLocaleString()} for ${acres} acres. Increase Loan or Savings.`);
        return;
    }
    dispatch({
        type: 'COMMIT_PLAN',
        payload: {
            crop: selectedCrop,
            loan: selectedLoan,
            loanAmount: loanId ? loanAmount : 0,
            insurance: hasInsurance ? INSURANCES[1] : INSURANCES[0],
            savingsAllocated: savingsAlloc
        }
    });
  };

  return (
    <div className="bg-game-bg min-h-full flex flex-col">
        {/* HEADER WITH BACK BUTTON */}
        <div className="bg-white p-4 flex items-center gap-2 shadow-sm z-10">
            <button 
                onClick={() => dispatch({ type: 'GO_TO_DASHBOARD' })} 
                className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200"
            >
                <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-game-primary">Plan Season {state.seasonNumber}</h2>
        </div>

        <div className="p-4 pb-0">
            <FarmVisualizer state={state} />
        </div>

        <div className="flex-grow p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mt-1">
                    <Ruler className="w-3 h-3" /> {acres.toFixed(1)} Acres • {state.farmType} Farm
                </div>
                <div className="bg-white px-4 py-2 rounded-full shadow text-sm md:text-base font-mono font-bold text-game-primaryDark">
                    ₹{state.savings.toLocaleString()} Avail
                </div>
            </div>

            <div className="md:grid md:grid-cols-2 md:gap-6">
                
                {/* 1. Crop Selection */}
                <section className="mb-6 bg-white p-4 rounded-xl shadow-sm md:col-span-2">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Select Crop</h3>
                        {state.marketPrices.length > 0 && (
                            <button
                                onClick={marketModal.openModal}
                                className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full font-medium hover:bg-blue-200 transition-colors"
                            >
                                <BarChart3 className="w-3 h-3" />
                                View Market Prices
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {availableCrops.map(c => {
                            const cost = c.costPerAcre * acres;
                            return (
                                <button
                                    key={c.id}
                                    onClick={() => setCropId(c.id)}
                                    className={clsx(
                                        "p-3 rounded-lg border text-left transition-all hover:shadow-md flex flex-col justify-between",
                                        cropId === c.id ? "border-game-primary bg-green-50 ring-2 ring-game-primary" : "border-gray-100"
                                    )}
                                >
                                    <div>
                                        <div className="font-bold text-gray-800">{c.name}</div>
                                        <div className="text-[10px] text-gray-500 uppercase mt-1">{c.type}</div>
                                    </div>
                                    <div className="mt-2">
                                        <div className="text-xs text-game-primary font-bold">₹{cost.toLocaleString()}</div>
                                        <div className="text-[10px] text-gray-400">for {acres} acres</div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* 2. Savings Slider */}
                <section className="mb-6 bg-white p-4 rounded-xl shadow-sm">
                    <div className="flex justify-between mb-2">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Use Savings</h3>
                        <span className="font-bold text-game-primary">₹{savingsAlloc.toLocaleString()}</span>
                    </div>
                    <input 
                        type="range" min="0" max={state.savings} step="500"
                        value={savingsAlloc} onChange={(e) => setSavingsAlloc(Number(e.target.value))}
                        className="w-full accent-game-primary h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                </section>

                {/* 3. Loan Selection */}
                <section className="mb-6 bg-white p-4 rounded-xl shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                         <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                            <Coins className="w-4 h-4"/> Need Loan?
                        </h3>
                        {loanId && (
                            <button onClick={() => { setLoanId(null); setLoanAmount(0); }} className="text-xs text-red-500 font-bold hover:underline">
                                Clear Loan
                            </button>
                        )}
                    </div>
                   
                    <div className="space-y-3">
                        {LOANS.filter(l => l.maxAmount > 0).map(l => {
                            const realMaxAmount = l.maxAmount * (acres / 2); 
                            return (
                                <div key={l.id} className={clsx("rounded-lg border transition-all", loanId === l.id ? "border-game-primary bg-green-50 ring-1 ring-game-primary" : "border-gray-100")}>
                                    <button
                                        onClick={() => { setLoanId(l.id); setLoanAmount(Math.floor(realMaxAmount / 2)); }}
                                        className="w-full p-3 flex items-center justify-between"
                                    >
                                        <div>
                                            <div className="font-bold text-left text-sm">{l.name}</div>
                                            <div className={clsx("text-xs text-left", l.interestRate > 0.15 ? "text-red-500" : "text-green-600")}>
                                                {(l.interestRate * 100).toFixed(0)}% Interest
                                            </div>
                                        </div>
                                    </button>
                                    
                                    {loanId === l.id && (
                                        <div className="px-3 pb-3 pt-0 animate-fade-in">
                                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                <span>Amount:</span>
                                                <span className="font-bold text-game-primary">₹{loanAmount.toLocaleString()}</span>
                                            </div>
                                            <input 
                                                type="range" min="0" max={realMaxAmount} step="1000"
                                                value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))}
                                                className="w-full accent-game-primary h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                            />
                                            <div className="flex justify-between text-[10px] text-gray-400">
                                                <span>0</span>
                                                <span>₹{(realMaxAmount/1000).toFixed(0)}k</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* 4. Insurance Toggle */}
                <section className="mb-6 bg-white p-4 rounded-xl shadow-sm flex items-center justify-between md:col-span-2">
                    <div className="flex items-center gap-3">
                        <Shield className="w-8 h-8 text-game-primary" />
                        <div>
                            <div className="font-bold text-lg flex items-center gap-2">
                                Crop Insurance
                                {hasInsurance && (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                    PMFBY Subsidy: ₹{(INSURANCES[1].premium * acres * 0.9).toLocaleString()}
                                  </span>
                                )}
                            </div>
                            <div className="text-sm text-gray-500">
                              {hasInsurance 
                                ? `After 90% PMFBY subsidy: ₹{(insuranceCost * 0.1).toLocaleString()}`
                                : `Cost: ₹{insuranceCost.toLocaleString()} (for ${acres.toFixed(1)} acres)`
                              }
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={() => setInsurance(!hasInsurance)}
                        className={clsx("w-14 h-8 rounded-full transition-colors relative", hasInsurance ? "bg-game-primary" : "bg-gray-300")}
                    >
                        <div className={clsx("w-6 h-6 bg-white rounded-full absolute top-1 transition-all shadow-sm", hasInsurance ? "left-7" : "left-1")}></div>
                    </button>
                </section>

                {/* Government Schemes Info */}
                <section className="mb-6 bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-xl border border-blue-200 md:col-span-2">
                    <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                            <h4 className="font-bold text-blue-800 text-sm mb-2">Government Benefits This Season</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">PM-KISAN:</span>
                                    <span className="font-bold text-green-700">+₹2,000</span>
                                </div>
                                {hasInsurance && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">PMFBY Subsidy:</span>
                                        <span className="font-bold text-green-700">+₹{(INSURANCES[1].premium * acres * 0.9).toLocaleString()}</span>
                                    </div>
                                )}
                                {loanId === 'kcc' && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">KCC Interest Subvention:</span>
                                        <span className="font-bold text-green-700">2% off</span>
                                    </div>
                                )}
                            </div>
                            <div className="mt-2 pt-2 border-t border-blue-200">
                                <p className="text-xs text-blue-700">
                                    💡 These benefits are automatically credited via DBT (Direct Benefit Transfer)
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Total Cost */}
                <div className="md:col-span-2 bg-gray-50 p-4 rounded-xl flex justify-between items-center text-sm mb-10">
                    <div>
                        <span className="font-bold text-gray-600 block">Total Upfront Cost:</span>
                        {(savingsAlloc + (loanId ? loanAmount : 0)) < totalUpfrontCost && (
                             <span className="text-red-500 text-xs flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Short funds</span>
                        )}
                    </div>
                    <span className={clsx("font-bold text-lg", (savingsAlloc + (loanId ? loanAmount : 0)) < totalUpfrontCost ? "text-red-600" : "text-gray-800")}>
                        ₹{totalUpfrontCost.toLocaleString()}
                    </span>
                </div>
            </div>
        </div>

        <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t md:static md:bg-transparent md:border-0 md:p-8">
            <button 
                onClick={handleConfirm}
                className="w-full bg-game-primary hover:bg-game-primaryDark text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-transform hover:scale-[1.02]"
            >
                Confirm Season Plan
            </button>
        </div>

        {/* Education Popup */}
        {educationTip.isShowing && (
            <EducationPopup 
                context={educationTip.currentContext!} 
                onClose={educationTip.hideTip} 
            />
        )}

        {/* Market Prices Modal */}
        {marketModal.isOpen && (
            <MarketPricesModal onClose={marketModal.closeModal} />
        )}
    </div>
  );
};