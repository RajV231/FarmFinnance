import React, { useState, useMemo, useEffect } from 'react';
import { useGame } from '../context/game-context';
import { useLanguage } from '../context/language-context';
import { CROPS, LOANS, INSURANCES } from '../data/game-scenarios';
import { Shield, Coins, Ruler, ArrowLeft, CloudRain, AlertCircle, Check } from 'lucide-react';
import { FarmVisualizer } from '../components/farm-visualizer';
import { playSFX } from '../utils/fx-engine';

export const SeasonPlanningScreen = () => {
  const { dispatch, state } = useGame();
  const { t } = useLanguage();
  
  const acres = state.totalAcres; 

  const availableCrops = useMemo(() => {
    if (state.farmType === 'MIXED') return CROPS;
    const targetType = state.farmType === 'CROPS' ? 'CROP' : 'VEGETABLE';
    return CROPS.filter(c => c.typeKey === (targetType === 'CROP' ? 'type_crop' : 'type_veg'));
  }, [state.farmType]);

  const [cropId, setCropId] = useState(availableCrops[0]?.id || CROPS[0].id);
  const [loanId, setLoanId] = useState<string | null>(null);
  const [loanAmount, setLoanAmount] = useState(0);
  const [hasInsurance, setInsurance] = useState(false);
  const [savingsAlloc, setSavingsAlloc] = useState(0);

  const selectedCrop = CROPS.find(c => c.id === cropId)!;
  const selectedLoan = loanId ? LOANS.find(l => l.id === loanId)! : LOANS[0];

  const hasSoilHealth = state.activeSchemes.includes('soil_health');
  let selectedCropCost = selectedCrop.costPerAcre * acres;
  if (hasSoilHealth) selectedCropCost *= 0.90;

  const hasPmfby = state.activeSchemes.includes('pmfby');
  let baseInsPremium = INSURANCES[1].premium;
  if (hasPmfby) baseInsPremium *= 0.5;

  // The true required cost (Includes Insurance!)
  const insuranceCost = hasInsurance ? (baseInsPremium * acres) : 0;
  const totalUpfrontCost = selectedCropCost + insuranceCost;

  // FIX 1: THE AUTO-BALANCER (Runs whenever Crop or Insurance changes)
  useEffect(() => {
      // Default to paying as much as possible with savings
      const defaultSavings = Math.min(state.savings, totalUpfrontCost);
      setSavingsAlloc(defaultSavings);
      
      if (loanId) {
          // If they already clicked a loan, automatically fill the gap!
          setLoanAmount(Math.max(0, totalUpfrontCost - defaultSavings));
      } else {
          setLoanAmount(0);
      }
  }, [totalUpfrontCost, state.savings]); // Purposely excludes loanId

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleConfirm = () => {
    const available = savingsAlloc + (loanId ? loanAmount : 0);
    if (available < totalUpfrontCost) {
        setErrorMsg(t('plan_insufficient_funds', { cost: totalUpfrontCost.toLocaleString('en-IN'), acres: acres.toString() }) || `You need ₹${totalUpfrontCost.toLocaleString('en-IN')} to proceed.`);
        playSFX('error'); 
        return;
    }
    setErrorMsg(null);
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
    <div className="min-h-screen bg-gray-50 flex flex-col pb-32">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
            <div className="px-6 py-4 flex items-center justify-between">
                <button 
                    onClick={() => {
                        playSFX('click');
                        dispatch({ type: 'GO_TO_DASHBOARD' });
                    }} 
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 active:scale-95 transition-all"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-semibold">Back</span>
                </button>
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-900">{t('season')} {state.seasonNumber}</h2>
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mt-1">
                        <Ruler className="w-3 h-3" /> {acres.toFixed(1)} {t('ui_acres')}
                    </div>
                </div>
                <div className="bg-green-100 px-4 py-2 rounded-xl shadow-sm">
                    <div className="text-xs text-green-700 font-semibold mb-0.5">Balance</div>
                    <div className="text-sm font-bold text-green-900 font-mono">₹{state.savings.toLocaleString('en-IN')}</div>
                </div>
            </div>
        </div>

        <div className="p-4"><FarmVisualizer state={state} /></div>

        <div className="flex-1 px-4 space-y-4 overflow-y-auto pb-10">
            {state.weatherForecast && (
                <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-2xl flex items-center gap-3">
                    <CloudRain className="w-8 h-8 text-blue-500 flex-shrink-0" />
                    <div>
                        <div className="text-xs font-bold text-blue-800 uppercase tracking-wider">{t('forecast_label')}</div>
                        <div className="text-sm font-bold text-blue-900">{t(state.weatherForecast)}</div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-5">
                <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-3">{t('Select Crop')}</h3>
                <div className="grid grid-cols-2 gap-3">
                    {availableCrops.map(c => {
                        let costForThisCrop = c.costPerAcre * acres;
                        if (hasSoilHealth) costForThisCrop *= 0.90;
                        const isSelected = cropId === c.id;

                        return (
                            <button
                                key={c.id}
                                onClick={() => {
                                    setCropId(c.id);
                                    playSFX('select_crop');
                                }}
                                className={`p-4 rounded-2xl border-2 transition-all ${
                                    isSelected ? 'border-green-600 bg-gradient-to-br from-green-50 to-emerald-50 shadow-md scale-105' : 'border-gray-200 bg-white'
                                }`}
                            >
                                <div className="text-left">
                                    <div className={`font-bold mb-1 ${isSelected ? 'text-green-700' : 'text-gray-800'}`}>{t(c.nameKey)}</div>
                                    <div className={`text-sm font-bold font-mono ${isSelected ? 'text-green-600' : 'text-gray-600'}`}>
                                        ₹{costForThisCrop.toLocaleString('en-IN')}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* FIX 2: THE STRICTLY CAPPED SAVINGS SLIDER */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-5">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider">{t('Use Savings')}</h3>
                    <span className="font-bold text-green-700 font-mono">₹{savingsAlloc.toLocaleString('en-IN')}</span>
                </div>
                <input 
                    type="range" 
                    min="0" 
                    max={Math.min(state.savings, totalUpfrontCost)} 
                    step="500"
                    value={savingsAlloc} 
                    onChange={(e) => {
                        const newSavings = Number(e.target.value);
                        setSavingsAlloc(newSavings);
                        
                        // SEESAW: If loan is active, pull loan up to cover the gap!
                        if (loanId) {
                            setLoanAmount(Math.max(0, totalUpfrontCost - newSavings));
                        }
                        playSFX('slider_tick');
                    }}
                    className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-green-600"
                />
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-5">
                <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                        <Coins className="w-5 h-5 text-blue-600" />
                        <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider">{t('Need Loan?')}</h3>
                    </div>
                    {loanId && (
                        <button onClick={() => { setLoanId(null); setLoanAmount(0); playSFX('toggle_off'); }} className="text-xs text-red-600 font-bold hover:underline">{t('Clear')}</button>
                    )}
                </div>
                
                {state.debt > 0 ? (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-sm font-bold">
                        Bank Notice: You have an outstanding farming debt of ₹{state.debt.toLocaleString('en-IN')}. You cannot take a new crop loan until it is cleared.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {LOANS.filter(l => l.maxAmount > 0).map(l => {
                            const realMaxAmount = l.maxAmount * (acres / 2); 
                            let displayInterest = l.interestRate;
                            if (l.id === 'kcc' && state.activeSchemes.includes('miss')) displayInterest = 0.04;
                            const isSelected = loanId === l.id;

                            return (
                                <div key={l.id} className={`rounded-2xl border-2 transition-all ${isSelected ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-indigo-50' : 'border-gray-200 bg-white'}`}>
                                    <button
                                        onClick={() => { 
                                            setLoanId(l.id); 
                                            
                                            // FIX 3: INSTANT LOAN AUTO-CALCULATOR
                                            const neededLoan = Math.max(0, totalUpfrontCost - savingsAlloc);
                                            const actualLoan = Math.min(realMaxAmount, neededLoan);
                                            
                                            setLoanAmount(actualLoan);
                                            setSavingsAlloc(Math.max(0, totalUpfrontCost - actualLoan)); // Balance the savings perfectly
                                            
                                            playSFX('loan'); 
                                        }}
                                        className="w-full p-4 flex items-center justify-between"
                                    >
                                        <div className="text-left">
                                            <div className={`font-bold ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>{t(l.nameKey)}</div>
                                            <div className={`text-sm font-bold mt-1 ${displayInterest > 0.15 ? 'text-red-600' : 'text-green-600'}`}>
                                                {(displayInterest * 100).toFixed(0)}% interest
                                            </div>
                                        </div>
                                        {isSelected && <Check className="w-5 h-5 text-blue-600" />}
                                    </button>
                                    
                                    {isSelected && (
                                        <div className="px-4 pb-4 pt-0">
                                            <div className="flex justify-between text-sm font-bold text-blue-700 mb-2">
                                                <span>Amount</span>
                                                <span className="font-mono">₹{loanAmount.toLocaleString('en-IN')}</span>
                                            </div>
                                            {/* FIX 4: STRICTLY CAPPED LOAN SLIDER */}
                                            <input 
                                                type="range" min="0" 
                                                max={Math.min(realMaxAmount, totalUpfrontCost)} 
                                                step="500" value={loanAmount} 
                                                onChange={(e) => {
                                                    let newLoan = Number(e.target.value);
                                                    
                                                    // Prevent taking more loan than required!
                                                    if (newLoan > totalUpfrontCost) newLoan = totalUpfrontCost;
                                                    
                                                    // Prevent reducing loan so much that savings can't cover it
                                                    if (totalUpfrontCost - newLoan > state.savings) {
                                                        newLoan = totalUpfrontCost - state.savings;
                                                    }

                                                    setLoanAmount(newLoan);
                                                    
                                                    // SEESAW: Pull savings down to match perfectly!
                                                    setSavingsAlloc(Math.max(0, totalUpfrontCost - newLoan));
                                                    playSFX('slider_tick'); 
                                                }}
                                                className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                            <Shield className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <div className="font-bold text-gray-800">{t('ins_pmfby')}</div>
                            <div className="text-sm text-gray-500 font-mono">₹{insuranceCost.toLocaleString('en-IN')}</div>
                        </div>
                    </div>
                    <button 
                        onClick={() => {
                            const nextState = !hasInsurance;
                            setInsurance(nextState);
                            playSFX(nextState ? 'toggle_on' : 'toggle_off');
                        }}
                        className={`w-16 h-9 rounded-full transition-all relative ${hasInsurance ? 'bg-green-600' : 'bg-gray-300'}`}
                    >
                        <div className={`w-7 h-7 bg-white rounded-full absolute top-1 transition-all shadow-md ${hasInsurance ? 'left-8' : 'left-1'}`}></div>
                    </button>
                </div>
            </div>

            <div className={`rounded-3xl p-5 border-2 ${
                (savingsAlloc + (loanId ? loanAmount : 0)) >= totalUpfrontCost ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}>
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-1">{t('Total Upfront Cost')}</div>
                        <div className="text-2xl font-bold text-gray-900 font-mono">₹{totalUpfrontCost.toLocaleString('en-IN')}</div>
                    </div>
                    {(savingsAlloc + (loanId ? loanAmount : 0)) < totalUpfrontCost && ( <AlertCircle className="w-8 h-8 text-red-600" /> )}
                </div>
            </div>
        </div>

        <div className="fixed bottom-0 left-0 w-full p-4 bg-white/80 backdrop-blur-xl border-t border-gray-200 z-40">
            {errorMsg && (
                <div className="mb-3 bg-red-50 border-2 border-red-200 text-red-700 p-3 rounded-xl flex items-center gap-2 animate-slide-up">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-bold">{errorMsg}</span>
                </div>
            )}
            <button 
                onClick={handleConfirm}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-5 rounded-2xl font-bold text-lg shadow-lg hover:from-green-700 hover:to-emerald-700 active:scale-95 transition-all"
            >{t('ui_confirm')}</button>
        </div>
    </div>
  );
};