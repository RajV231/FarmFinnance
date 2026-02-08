import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Crop, Loan, Insurance, GameEvent, EVENTS } from '../data/game-scenarios';
import { saveGame, loadGame, clearGame } from '../utils/storage';
import { calculateInterest, calculateResilienceScore, detectPovertySpiral } from '../utils/game-calculations';

export type GamePhase = 
  | 'SPLASH' | 'LANGUAGE' | 'FARM_SETUP' | 'DASHBOARD' | 'PROFILE' | 'REPORTS'
  | 'PLANNING' 
  | 'EVENT_EARLY' | 'EVENT_MID' | 'EVENT_LATE' 
  | 'HARVEST' | 'RESILIENCE' | 'GAME_OVER' | 'SUMMARY';

export interface GameState {
  seasonNumber: number;
  maxSeasons: number;
  savings: number;
  debt: number;
  wellbeing: number;
  resilienceScore: number;
  resilienceBreakdown: { savingsScore: number; debtScore: number; riskScore: number };
  isPovertySpiral: boolean;
  phase: GamePhase;
  
  farmSize: '<2' | '2-5' | '>5';
  farmType: 'CROPS' | 'VEGETABLES' | 'MIXED';

  currentCrop: Crop | null;
  currentLoan: Loan | null;
  currentLoanAmount: number;
  currentInsurance: Insurance | null;
  currentEvent: GameEvent | null;
  
  // NEW: Multi-stage tracking
  cumulativeYield: number; 
  cumulativePrice: number;
  seasonEventsLog: string[];

  lastHarvestStats: {
    grossIncome: number;
    totalExpenses: number;
    netProfit: number;
    yieldPercentage: number;
    insurancePayout: number;
    loanInterestPaid: number;
    eventCost: number;
  } | null;
  
  history: any[];
}

const INITIAL_STATE: GameState = {
  seasonNumber: 1,
  maxSeasons: 4,
  savings: 5000,
  debt: 0,
  wellbeing: 100,
  resilienceScore: 50,
  resilienceBreakdown: { savingsScore: 50, debtScore: 50, riskScore: 50 },
  isPovertySpiral: false,
  phase: 'SPLASH',
  farmSize: '2-5',
  farmType: 'MIXED',
  currentCrop: null,
  currentLoan: null,
  currentLoanAmount: 0,
  currentInsurance: null,
  currentEvent: null,
  cumulativeYield: 1.0,
  cumulativePrice: 1.0,
  seasonEventsLog: [],
  lastHarvestStats: null,
  history: []
};

const getAcres = (size: string): number => {
    if (size === '<2') return 1.5;   // Small Farm
    if (size === '2-5') return 3.5;  // Medium Farm
    if (size === '>5') return 8.0;   // Large Farm
    return 2.0; // Fallback
};

type Action = 
  | { type: 'LOAD_GAME'; payload: GameState }
  | { type: 'SET_LANGUAGE_PHASE' }
  | { type: 'SET_FARM_SETUP' }
  | { type: 'CONFIRM_FARM_SETUP'; payload: { size: string, type: string } }
  | { type: 'START_SEASON' }
  | { type: 'GO_TO_DASHBOARD' }
  | { type: 'GO_TO_PROFILE' }
  | { type: 'GO_TO_REPORTS' }
  | { type: 'COMMIT_PLAN'; payload: { crop: Crop; loan: Loan; loanAmount: number; insurance: Insurance; savingsAllocated: number } }
  | { type: 'TRIGGER_EVENT' }
  | { type: 'RESOLVE_EVENT_CHOICE'; payload: { cost: number; wellbeing: number } }
  | { type: 'SHOW_RESILIENCE' }
  | { type: 'NEXT_SEASON' }
  | { type: 'RESET_GAME' };

const performHarvestCalculation = (state: GameState): Partial<GameState> => {
    if (!state.currentCrop) return {};

    const acres = getAcres(state.farmSize); // GET ACRES
    // 1. Calculate Income
    // Base variance (random weather luck) + Cumulative Event Impacts
    const variance = 0.9 + (Math.random() * 0.2); 
    
    // Apply the cumulative damage from Early -> Mid -> Late
    const finalYieldPerAcre = state.currentCrop.minYield * variance * state.cumulativeYield;
    const totalYield = finalYieldPerAcre * acres; // REAL SCALE
    
    const finalPrice = state.currentCrop.pricePerUnit * state.cumulativePrice;

    const grossIncome = Math.floor(totalYield * finalPrice);

    // 2. Calculate Expenses
    const cropCost = state.currentCrop.costPerAcre * acres; // Cost for whole farm
    const insuranceCost = (state.currentInsurance?.premium || 0) * acres; // Premium for whole farm
    // Note: Event *Choice* costs were deducted live. 
    // We add baseEventCost here if there was a "forced" financial impact (like medical bill)
    // For simplicity in this version, we assume financial impacts were handled in Resolve Choice.
    
    const interestRate = state.currentLoan ? state.currentLoan.interestRate : 0;
    const interestAmount = Math.floor(state.currentLoanAmount * interestRate);

    const totalExpenses = cropCost + insuranceCost + interestAmount;

    // 3. Insurance Payout Logic
    let insurancePayout = 0;
    const totalYieldDrop = (variance * state.cumulativeYield);
    
    if (state.currentInsurance?.id !== 'none' && totalYieldDrop < 0.7) {
        // Payout based on Expected Revenue per acre * acres
        const expectedRevenue = state.currentCrop.maxYield * state.currentCrop.pricePerUnit * acres;
        insurancePayout = Math.floor(expectedRevenue * state.currentInsurance!.coverage);
    }

    // 4. Update Wallet
    // Savings already reflects choice costs.
    let liquidCash = state.savings + grossIncome + insurancePayout;
    let newDebt = state.debt + state.currentLoanAmount + interestAmount;

    if (liquidCash >= newDebt) {
        liquidCash -= newDebt;
        newDebt = 0;
    } else {
        newDebt -= liquidCash;
        liquidCash = 0;
    }

    // 5. Resilience
    const isSpiral = detectPovertySpiral(newDebt, 50000 * acres); // Spiral threshold scales with farm size
    const resilienceData = calculateResilienceScore(liquidCash, newDebt, state.wellbeing, state.currentInsurance?.id !== 'none');

    return {
        savings: Math.max(0, liquidCash),
        debt: newDebt,
        resilienceScore: resilienceData.total,
        resilienceBreakdown: resilienceData.breakdown,
        isPovertySpiral: isSpiral,
        lastHarvestStats: {
            grossIncome,
            totalExpenses,
            netProfit: (grossIncome + insurancePayout) - totalExpenses,
            yieldPercentage: totalYieldDrop * 100,
            insurancePayout,
            loanInterestPaid: interestAmount,
            eventCost: 0 // Tracked via cumulative yield now
        },
        history: [...state.history, { season: state.seasonNumber, income: grossIncome, resilience: resilienceData.total }]
    };
};

const gameReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case 'LOAD_GAME':
       return { ...INITIAL_STATE, ...action.payload, resilienceBreakdown: action.payload.resilienceBreakdown || INITIAL_STATE.resilienceBreakdown };
    case 'SET_LANGUAGE_PHASE': return { ...state, phase: 'LANGUAGE' };
    case 'SET_FARM_SETUP': return { ...state, phase: 'FARM_SETUP' };
    
    case 'CONFIRM_FARM_SETUP':
      // REALISM LOGIC: Large farms start with more money, small farms with less
      const size = action.payload.size;
      let startSavings = 5000;
      if (size === '2-5') startSavings = 15000;
      if (size === '>5') startSavings = 40000;

      return { 
          ...state, 
          farmSize: action.payload.size as any, 
          farmType: action.payload.type as any,
          savings: startSavings, // Set realistic starting cash
          phase: 'DASHBOARD' 
      };

    case 'START_SEASON': return { ...state, phase: 'PLANNING' };
    case 'GO_TO_DASHBOARD': return { ...state, phase: 'DASHBOARD' };
    case 'GO_TO_PROFILE': return { ...state, phase: 'PROFILE' };
    case 'GO_TO_REPORTS': return { ...state, phase: 'REPORTS' };

    case 'COMMIT_PLAN':
      const { crop, loan, loanAmount, insurance, savingsAllocated } = action.payload;
      const acres = getAcres(state.farmSize);

      // REALISM LOGIC: Multiply costs by acres
      const totalCropCost = crop.costPerAcre * acres;
      const totalInsuranceCost = insurance.premium * acres;
      
      const upfrontCost = totalCropCost + totalInsuranceCost;
      const liquidCash = savingsAllocated + loanAmount;
      const remainingSavings = state.savings - savingsAllocated;
      
      const finalCashForSeason = Math.max(0, liquidCash - upfrontCost + remainingSavings); 

      return {
        ...state,
        currentCrop: crop,
        currentLoan: loan,
        currentLoanAmount: loanAmount,
        currentInsurance: insurance,
        phase: 'EVENT_EARLY',
        savings: finalCashForSeason,
        debt: state.debt,
        cumulativeYield: 1.0,
        cumulativePrice: 1.0,
        seasonEventsLog: []
      };

    case 'TRIGGER_EVENT':
      // 1. Determine Phase
      let stage: 'EARLY' | 'MID' | 'LATE' = 'EARLY';
      if (state.phase === 'EVENT_MID') stage = 'MID';
      if (state.phase === 'EVENT_LATE') stage = 'LATE';

      // 2. Filter events for this phase
      const stageEvents = EVENTS.filter(e => e.timing === stage);
      const randomEvt = stageEvents.length > 0 
        ? stageEvents[Math.floor(Math.random() * stageEvents.length)] 
        : EVENTS[0]; // Fallback
      
      return { ...state, currentEvent: randomEvt };

    case 'RESOLVE_EVENT_CHOICE':
      const cost = action.payload.cost;
      const evt = state.currentEvent!;
      
      let impactYield = evt.yieldImpact || 1;
      let impactPrice = evt.priceImpact || 1;
      let impactWellbeing = evt.wellbeingImpact || 0;
      
      // NEW: Direct Cash Hit logic (for Fraud/Scams)
      let directCashHit = 0;

      if (cost > 0) {
          // Choice A (Mitigation) taken
          if (evt.choiceA.mitigatedYield) impactYield = evt.choiceA.mitigatedYield;
          if (evt.choiceA.mitigatedPrice) impactPrice = evt.choiceA.mitigatedPrice;
          if (evt.choiceA.mitigatedWellbeing) impactWellbeing += evt.choiceA.mitigatedWellbeing;
      } else {
          // Choice B (Risky) taken
          // If it's a FRAUD or DIGITAL event, the financial impact happens NOW
          if (evt.financialImpact) {
             directCashHit = Math.abs(evt.financialImpact);
          }
      }

      // 2. Update Stats
      const nextSavings = state.savings - cost - directCashHit;
      const nextYield = state.cumulativeYield * impactYield;
      const nextPrice = state.cumulativePrice * impactPrice;
      const nextWellbeing = Math.max(0, Math.min(100, state.wellbeing + action.payload.wellbeing + impactWellbeing));
      const nextLog = [...state.seasonEventsLog, evt.titleKey];

      // 3. Transition Logic
      let nextPhase: GamePhase = 'HARVEST';
      if (state.phase === 'EVENT_EARLY') nextPhase = 'EVENT_MID';
      else if (state.phase === 'EVENT_MID') nextPhase = 'EVENT_LATE';
      
      // 4. Construct Intermediate State
      const nextState = {
          ...state,
          savings: nextSavings,
          cumulativeYield: nextYield,
          cumulativePrice: nextPrice,
          wellbeing: nextWellbeing,
          seasonEventsLog: nextLog,
          phase: nextPhase,
          currentEvent: null // Clear for next trigger
      };

      // 5. If Final Phase, Calculate Harvest
      if (nextPhase === 'HARVEST') {
          const harvestResults = performHarvestCalculation(nextState);
          return { ...nextState, ...harvestResults };
      }

      return nextState;

    case 'SHOW_RESILIENCE': return { ...state, phase: 'RESILIENCE' };

    case 'NEXT_SEASON':
        if(state.seasonNumber >= state.maxSeasons) return { ...state, phase: 'SUMMARY' };
        return { 
            ...state, 
            seasonNumber: state.seasonNumber + 1, 
            phase: 'DASHBOARD',
            currentCrop: null, currentLoan: null, currentEvent: null 
        };

    case 'RESET_GAME': 
        clearGame();
        return INITIAL_STATE;
        
    default: return state;
  }
};

const GameContext = createContext<{ state: GameState; dispatch: React.Dispatch<Action> } | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);
  
  useEffect(() => {
    const saved = loadGame<GameState>();
    if (saved && saved.phase !== 'SPLASH') {
        dispatch({ type: 'LOAD_GAME', payload: saved });
    } else {
        setTimeout(() => dispatch({ type: 'SET_LANGUAGE_PHASE' }), 2000); 
    }
  }, []);

  useEffect(() => {
    if (state.phase !== 'SPLASH') saveGame(state);
  }, [state]);

  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) throw new Error("useGame must be used within GameProvider");
    return context;
};