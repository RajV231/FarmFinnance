import React, { useState, useMemo } from 'react';
import { useGame } from '../context/game-context';
import { useLanguage } from '../context/language-context';
import { CROPS, LOANS, INSURANCES } from '../data/game-scenarios';
import { Shield, Coins, Ruler, AlertTriangle, ArrowLeft } from 'lucide-react';
import clsx from 'clsx';
import { FarmVisualizer } from '../components/farm-visualizer';

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
  const [savingsAlloc, setSavingsAlloc] = useState(Math.min(5000, state.savings));

  const selectedCrop = CROPS.find(c => c.id === cropId)!;
  const selectedLoan = loanId ? LOANS.find(l => l.id === loanId)! : LOANS[0];

  const hasSoilHealth = state.activeSchemes.includes('soil_health');
  let selectedCropCost = selectedCrop.costPerAcre * acres;
  if (hasSoilHealth) selectedCropCost *= 0.90;

  const hasPmfby = state.activeSchemes.includes('pmfby');
  let baseInsPremium = INSURANCES[1].premium;
  if (hasPmfby) baseInsPremium *= 0.5;

  const insuranceCost = hasInsurance ? (baseInsPremium * acres) : 0;
  const totalUpfrontCost = selectedCropCost + insuranceCost;

  const handleConfirm = () => {
    const available = savingsAlloc + (loanId ? loanAmount : 0);
    if (available < totalUpfrontCost) {
        alert(t('plan_insufficient_funds', { cost: totalUpfrontCost.toLocaleString(), acres: acres.toString() }));
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
        <div className="bg-white p-4 flex items-center gap-2 shadow-sm z-10">
            <button onClick={() => dispatch({ type: 'GO_TO_DASHBOARD' })} className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-game-primary">{t('season')} {state.seasonNumber}</h2>
        </div>

        <div className="p-4 pb-0">
            <FarmVisualizer state={state} />
        </div>

        <div className="flex-grow p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mt-1">
                    <Ruler className="w-3 h-3" /> {acres.toFixed(1)} Acres
                </div>
                <div className="bg-white px-4 py-2 rounded-full shadow text-sm md:text-base font-mono font-bold text-game-primaryDark">
                    ₹{state.savings.toLocaleString()} Avail
                </div>
            </div>

            <div className="md:grid md:grid-cols-2 md:gap-6">
                <section className="mb-6 bg-white p-4 rounded-xl shadow-sm md:col-span-2">
                    <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider flex items-center justify-between">
                        {t('Select Crop')}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {availableCrops.map(c => {
                            let costForThisCrop = c.costPerAcre * acres;
                            if (hasSoilHealth) costForThisCrop *= 0.90;

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
                                        <div className="font-bold text-gray-800">{t(c.nameKey)}</div>
                                        <div className="text-[10px] text-gray-500 uppercase mt-1">{t(c.typeKey)}</div>
                                    </div>
                                    <div className="mt-2">
                                        <div className="text-xs text-game-primary font-bold">₹{costForThisCrop.toLocaleString()}</div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </section>

                <section className="mb-6 bg-white p-4 rounded-xl shadow-sm">
                    <div className="flex justify-between mb-2">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{t('Use Savings')}</h3>
                        <span className="font-bold text-game-primary">₹{savingsAlloc.toLocaleString()}</span>
                    </div>
                    <input 
                        type="range" min="0" max={state.savings} step="500"
                        value={savingsAlloc} onChange={(e) => setSavingsAlloc(Number(e.target.value))}
                        className="w-full accent-game-primary h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                </section>

                <section className="mb-6 bg-white p-4 rounded-xl shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                         <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                            <Coins className="w-4 h-4"/> {t('Need Loan?')}
                        </h3>
                        {loanId && (
                            <button onClick={() => { setLoanId(null); setLoanAmount(0); }} className="text-xs text-red-500 font-bold hover:underline">
                                {t('Clear')}
                            </button>
                        )}
                    </div>
                   
                    <div className="space-y-3">
                        {LOANS.filter(l => l.maxAmount > 0).map(l => {
                            const realMaxAmount = l.maxAmount * (acres / 2); 
                            let displayInterest = l.interestRate;
                            if (l.id === 'kcc' && state.activeSchemes.includes('miss')) displayInterest = 0.04;

                            return (
                                <div key={l.id} className={clsx("rounded-lg border transition-all", loanId === l.id ? "border-game-primary bg-green-50 ring-1 ring-game-primary" : "border-gray-100")}>
                                    <button
                                        onClick={() => { setLoanId(l.id); setLoanAmount(Math.floor(realMaxAmount / 2)); }}
                                        className="w-full p-3 flex items-center justify-between"
                                    >
                                        <div>
                                            <div className="font-bold text-left text-sm flex items-center gap-2">
                                                {t(l.nameKey)}
                                            </div>
                                            <div className={clsx("text-xs text-left font-bold mt-1", displayInterest > 0.15 ? "text-red-500" : "text-green-600")}>
                                                {(displayInterest * 100).toFixed(0)}%
                                            </div>
                                        </div>
                                    </button>
                                    
                                    {loanId === l.id && (
                                        <div className="px-3 pb-3 pt-0 animate-fade-in">
                                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                <span className="font-bold text-game-primary">₹{loanAmount.toLocaleString()}</span>
                                            </div>
                                            <input 
                                                type="range" min="0" max={realMaxAmount} step="1000"
                                                value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))}
                                                className="w-full accent-game-primary h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>

                <section className="mb-6 bg-white p-4 rounded-xl shadow-sm flex items-center justify-between md:col-span-2">
                    <div className="flex items-center gap-3">
                        <Shield className="w-8 h-8 text-game-primary" />
                        <div>
                            <div className="font-bold text-lg flex items-center gap-2">
                                {t('ins_pmfby')}
                            </div>
                            <div className="text-sm text-gray-500">
                                ₹{insuranceCost.toLocaleString()}
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

                <div className="md:col-span-2 bg-gray-50 p-4 rounded-xl flex justify-between items-center text-sm mb-10">
                    <div>
                        <span className="font-bold text-gray-600 block">{t('Total Upfront Cost')}</span>
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
                {t('Confirm')}
            </button>
        </div>
    </div>
  );
};