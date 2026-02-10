import React, { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { Crop, Loan, Insurance, GameEvent, EVENTS, ASSETS, Asset, FinancialGoal } from "../data/game-scenarios";
import { saveGame, loadGame, clearGame } from "../utils/storage";
import { calculateResilienceScore, detectPovertySpiral } from "../utils/game-calculations";

export type GamePhase =
  | "SPLASH" | "LANGUAGE" | "GOAL_SELECTION" | "FARM_SETUP" | "DASHBOARD"
  | "PROFILE" | "REPORTS" | "SHOP" | "BANK" | "GOALS"
  | "PLANNING" | "EVENT_EARLY" | "EVENT_MID" | "EVENT_LATE"
  | "HARVEST" | "RESILIENCE" | "GAME_WIN" | "GAME_LOSS" | "SUMMARY";

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

  totalAcres: number; 
  farmSize: "<2" | "2-5" | ">5"; 
  farmType: "CROPS" | "VEGETABLES" | "MIXED";

  landLoan: {
    principal: number;
    seasonEmi: number;
    missedPayments: number;
  };

  currentCrop: Crop | null;
  currentLoan: Loan | null;
  currentLoanAmount: number;
  currentInsurance: Insurance | null;
  currentEvent: GameEvent | null;

  creditScore: number;
  ownedAssets: string[];
  loanHistory: { amount: number; paid: number; defaulted: boolean }[];
  
  financialGoal: FinancialGoal | null;
  achievedGoals: string[];
  bankBalance: { fixedDeposit: number; fdMaturitySeason: number; goldGrams: number };
  dbtBalance: number;

  cumulativeYield: number;
  cumulativePrice: number;
  seasonEventsLog: string[];
  seasonFinancialHits: number;
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
  maxSeasons: 10,
  savings: 20000, 
  debt: 0,
  wellbeing: 100,
  resilienceScore: 50,
  resilienceBreakdown: { savingsScore: 50, debtScore: 50, riskScore: 50 },
  isPovertySpiral: false,
  creditScore: 650,
  ownedAssets: [],
  loanHistory: [],
  
  totalAcres: 2.0,
  farmSize: "2-5",
  farmType: "MIXED",
  landLoan: { principal: 0, seasonEmi: 0, missedPayments: 0 },

  financialGoal: null,
  achievedGoals: [],
  bankBalance: { fixedDeposit: 0, fdMaturitySeason: 0, goldGrams: 0 },
  dbtBalance: 0,

  phase: "SPLASH",
  currentCrop: null,
  currentLoan: null,
  currentLoanAmount: 0,
  currentInsurance: null,
  currentEvent: null,
  cumulativeYield: 1.0,
  cumulativePrice: 1.0,
  seasonEventsLog: [],
  seasonFinancialHits: 0,
  lastHarvestStats: null,
  history: [],
};

const getMitigatedCost = (originalCost: number, eventType: string, assets: string[]) => {
  const relevantAssets = ASSETS.filter(a => assets.includes(a.id) && a.targetEventTypes?.includes(eventType));
  let discountMultiplier = 1.0;
  relevantAssets.forEach(a => { if (a.effectType === "COST_REDUCTION") discountMultiplier -= a.effectValue; });
  return Math.floor(originalCost * Math.max(0.1, discountMultiplier));
};

const getOperationalCost = (baseCost: number, assets: string[]) => {
    let discount = 0;
    if (assets.includes('mini_tractor')) discount += 0.15;
    if (assets.includes('solar_pump')) discount += 0.10;
    return Math.floor(baseCost * (1 - discount));
};

type Action =
  | { type: "LOAD_GAME"; payload: GameState }
  | { type: "SET_LANGUAGE_PHASE" } | { type: "SET_FARM_SETUP" }
  | { type: "CONFIRM_FARM_SETUP"; payload: { size: string; type: string } }
  | { type: "START_SEASON" } | { type: "GO_TO_DASHBOARD" } | { type: "GO_TO_PROFILE" }
  | { type: "GO_TO_REPORTS" } | { type: "GO_TO_SHOP" } | { type: "GO_TO_BANK" } | { type: "GO_TO_GOALS" }
  | { type: "BUY_ASSET"; payload: Asset }
  | { type: "BUY_LAND"; payload: { acres: number; cost: number; downPayment: number } } 
  | { type: "SET_GOAL"; payload: FinancialGoal }
  | { type: "ACHIEVE_GOAL"; payload: { goal: FinancialGoal; isMain: boolean } }
  | { type: "BANK_TRANSACTION"; payload: { type: "DEPOSIT_FD" | "BUY_GOLD" | "SELL_GOLD" | "PAY_LAND_PRINCIPAL"; amount: number; grams?: number; } }
  | { type: "COMMIT_PLAN"; payload: { crop: Crop; loan: Loan; loanAmount: number; insurance: Insurance; savingsAllocated: number; } }
  | { type: "TRIGGER_EVENT" }
  | { type: "RESOLVE_EVENT_CHOICE"; payload: { cost: number; wellbeing: number; } }
  | { type: "REPAY_LOAN"; payload: { amount: number; type: "FULL" | "PARTIAL" | "DEFAULT"; } }
  | { type: "SHOW_RESILIENCE" } | { type: "NEXT_SEASON" } | { type: "RESET_GAME" };

const performHarvestCalculation = (state: GameState): Partial<GameState> => {
  if (!state.currentCrop) return {};

  const acres = state.totalAcres; 
  const variance = 0.85 + Math.random() * 0.3; 

  const finalYieldPerAcre = state.currentCrop.minYield * variance * state.cumulativeYield;
  const totalYield = finalYieldPerAcre * acres;
  const finalPrice = state.currentCrop.pricePerUnit * state.cumulativePrice;
  const grossIncome = Math.floor(totalYield * finalPrice);

  // Apply Operational Discounts
  const baseCropCost = state.currentCrop.costPerAcre * acres;
  const cropCost = getOperationalCost(baseCropCost, state.ownedAssets);

  const insuranceCost = (state.currentInsurance?.premium || 0) * acres;
  const interestRate = state.currentLoan ? state.currentLoan.interestRate : 0;
  const interestAmount = Math.floor(state.currentLoanAmount * interestRate);
  
  const totalExpenses = cropCost + insuranceCost + interestAmount + state.seasonFinancialHits;

  let insurancePayout = 0;
  const totalYieldDrop = variance * state.cumulativeYield;
  if (state.currentInsurance?.id !== "none" && totalYieldDrop < 0.7) {
    const expectedRevenue = state.currentCrop.maxYield * state.currentCrop.pricePerUnit * acres;
    insurancePayout = Math.floor(expectedRevenue * state.currentInsurance!.coverage);
  }

  let liquidCash = state.savings + grossIncome + insurancePayout;
  let newDebt = state.debt + state.currentLoanAmount + interestAmount;

  if (liquidCash < 0) {
    newDebt += Math.abs(liquidCash);
    liquidCash = 0;
  }

  const isSpiral = detectPovertySpiral(newDebt, 50000 * acres);
  const resilienceData = calculateResilienceScore(liquidCash, newDebt, state.wellbeing, state.currentInsurance?.id !== "none");

  return {
    savings: liquidCash,
    debt: newDebt,
    resilienceScore: resilienceData.total,
    resilienceBreakdown: resilienceData.breakdown,
    isPovertySpiral: isSpiral,
    lastHarvestStats: {
      grossIncome, totalExpenses, netProfit: grossIncome + insurancePayout - totalExpenses,
      yieldPercentage: totalYieldDrop * 100, insurancePayout, loanInterestPaid: interestAmount,
      eventCost: state.seasonFinancialHits,
    },
    history: [...state.history, { season: state.seasonNumber, income: grossIncome, resilience: resilienceData.total }],
  };
};

const gameReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case "LOAD_GAME": return { ...INITIAL_STATE, ...action.payload };
    case "SET_LANGUAGE_PHASE": return { ...state, phase: "LANGUAGE" };
    case "SET_FARM_SETUP": return { ...state, phase: "GOAL_SELECTION" }; 
    case "SET_GOAL": return { ...state, financialGoal: action.payload, phase: "FARM_SETUP" }; 
    
    case "CONFIRM_FARM_SETUP": {
      const sizeStr = action.payload.size; 
      let acres = 2.0;
      if(sizeStr === '<2') acres = 1.5;
      if(sizeStr === '2-5') acres = 3.5;
      if(sizeStr === '>5') acres = 8.0;
      let startSavings = acres * 8000 + 5000; 

      return { ...state, farmSize: action.payload.size as any, totalAcres: acres, farmType: action.payload.type as any, savings: startSavings, phase: "DASHBOARD" };
    }

    case "START_SEASON": return { ...state, phase: "PLANNING" };
    case "GO_TO_DASHBOARD": return { ...state, phase: "DASHBOARD" };
    case "GO_TO_PROFILE": return { ...state, phase: "PROFILE" };
    case "GO_TO_REPORTS": return { ...state, phase: "REPORTS" };
    case "GO_TO_SHOP": return { ...state, phase: "SHOP" };
    case "GO_TO_BANK": return { ...state, phase: "BANK" };
    case "GO_TO_GOALS": return { ...state, phase: "GOALS" };

    case "BUY_ASSET":
      if (state.savings < action.payload.cost) return state;
      return { ...state, savings: state.savings - action.payload.cost, ownedAssets: [...state.ownedAssets, action.payload.id] };

    case "BUY_LAND": {
        const { acres, cost, downPayment } = action.payload;
        if(state.savings < downPayment) return state;
        
        const loanAmount = cost - downPayment;
        const emi = Math.ceil(loanAmount / 20); 

        return {
            ...state,
            savings: state.savings - downPayment,
            totalAcres: state.totalAcres + acres,
            landLoan: {
                principal: state.landLoan.principal + loanAmount,
                seasonEmi: state.landLoan.seasonEmi + emi,
                missedPayments: state.landLoan.missedPayments
            },
            phase: 'DASHBOARD'
        };
    }
      
    case "ACHIEVE_GOAL": {
        const { goal } = action.payload;
        // 1. Check affordability
        if (state.savings < goal.targetAmount) return state;
        
        // 2. Deduct money
        const newSavings = state.savings - goal.targetAmount;
        const newGoals = [...state.achievedGoals, goal.id];
        
        // 3. FIX: Do NOT end game automatically. Keep playing.
        // The player can choose to restart from Dashboard if they are done.
        return { 
            ...state, 
            savings: newSavings, 
            achievedGoals: newGoals, 
            phase: "GOALS" // Stay on goals screen to see the "Completed" badge
        };
    }

    case "BANK_TRANSACTION": {
      const { type, amount, grams } = action.payload;
      if (type === "DEPOSIT_FD") {
        if (state.savings < amount) return state;
        return { ...state, savings: state.savings - amount, bankBalance: { ...state.bankBalance, fixedDeposit: state.bankBalance.fixedDeposit + amount, fdMaturitySeason: state.seasonNumber + 2 } };
      }
      if (type === "BUY_GOLD") {
        if (state.savings < amount || !grams) return state;
        return { ...state, savings: state.savings - amount, bankBalance: { ...state.bankBalance, goldGrams: state.bankBalance.goldGrams + grams } };
      }
      if (type === "SELL_GOLD") {
        if (!grams || state.bankBalance.goldGrams < grams) return state;
        return { ...state, savings: state.savings + amount, bankBalance: { ...state.bankBalance, goldGrams: state.bankBalance.goldGrams - grams } };
      }
      if (type === "PAY_LAND_PRINCIPAL") {
          if(state.savings < amount) return state;
          let newPrincipal = Math.max(0, state.landLoan.principal - amount);
          let newEmi = newPrincipal === 0 ? 0 : state.landLoan.seasonEmi;
          return {
              ...state,
              savings: state.savings - amount,
              landLoan: { ...state.landLoan, principal: newPrincipal, seasonEmi: newEmi }
          };
      }
      return state;
    }

    case "COMMIT_PLAN": {
      const { crop, loan, loanAmount, insurance, savingsAllocated } = action.payload;
      const acres = state.totalAcres;
      
      const baseTotalCost = crop.costPerAcre * acres;
      const totalCropCost = getOperationalCost(baseTotalCost, state.ownedAssets);

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
        phase: "EVENT_EARLY",
        savings: finalCashForSeason,
        debt: state.debt,
        cumulativeYield: 1.0,
        cumulativePrice: 1.0,
        seasonEventsLog: [],
        seasonFinancialHits: 0,
      };
    }

    case "TRIGGER_EVENT":
      let stage: "EARLY" | "MID" | "LATE" = "EARLY";
      if (state.phase === "EVENT_MID") stage = "MID";
      if (state.phase === "EVENT_LATE") stage = "LATE";
      const stageEvents = EVENTS.filter((e) => e.timing === stage);
      const randomEvt = stageEvents.length > 0 ? stageEvents[Math.floor(Math.random() * stageEvents.length)] : EVENTS[0];
      return { ...state, currentEvent: randomEvt };

    case "RESOLVE_EVENT_CHOICE": {
      const cost = action.payload.cost;
      const evt = state.currentEvent!;
      let realCost = cost;
      if (realCost > 0) realCost = getMitigatedCost(realCost, evt.type, state.ownedAssets);

      let impactYield = evt.yieldImpact || 1;
      let impactPrice = evt.priceImpact || 1;
      let impactWellbeing = evt.wellbeingImpact || 0;
      let directCashHit = 0;

      const protectiveAssets = ASSETS.filter(a => state.ownedAssets.includes(a.id) && a.effectType === "YIELD_BUFFER" && a.targetEventTypes?.includes(evt.type));
      if (protectiveAssets.length > 0) {
        const loss = 1.0 - impactYield;
        const mitigation = loss * protectiveAssets[0].effectValue;
        impactYield = impactYield + mitigation;
      }

      if (cost > 0) {
        if (evt.choiceA.mitigatedYield) impactYield = evt.choiceA.mitigatedYield;
        if (evt.choiceA.mitigatedPrice) impactPrice = evt.choiceA.mitigatedPrice;
        if (evt.choiceA.mitigatedWellbeing) impactWellbeing += evt.choiceA.mitigatedWellbeing;
      } else {
        if (evt.financialImpact) directCashHit = Math.abs(evt.financialImpact);
      }

      const nextSavings = state.savings - realCost - directCashHit;
      const nextYield = state.cumulativeYield * impactYield;
      const nextPrice = state.cumulativePrice * impactPrice;
      const nextWellbeing = Math.max(0, Math.min(100, state.wellbeing + action.payload.wellbeing + impactWellbeing));
      const nextLog = [...state.seasonEventsLog, evt.titleKey];
      const nextFinancialHits = state.seasonFinancialHits + directCashHit;

      let nextPhase: GamePhase = "HARVEST";
      if (state.phase === "EVENT_EARLY") nextPhase = "EVENT_MID";
      else if (state.phase === "EVENT_MID") nextPhase = "EVENT_LATE";

      const nextState = {
        ...state, savings: nextSavings, cumulativeYield: nextYield, cumulativePrice: nextPrice,
        wellbeing: nextWellbeing, seasonEventsLog: nextLog, seasonFinancialHits: nextFinancialHits,
        phase: nextPhase, currentEvent: null,
      };

      if (nextPhase === "HARVEST") {
        const harvestResults = performHarvestCalculation(nextState);
        return { ...nextState, ...harvestResults };
      }
      return nextState;
    }

    case "REPAY_LOAN": {
      const { amount, type } = action.payload;
      let scoreChange = 0;
      if (type === "FULL") scoreChange = 50;
      if (type === "PARTIAL") scoreChange = -10;
      if (type === "DEFAULT") scoreChange = -100;

      const remainingDebt = Math.max(0, state.debt - amount);
      const newScore = Math.min(900, Math.max(300, state.creditScore + scoreChange));
      const phaseAfterRepay = remainingDebt === 0 ? "HARVEST" : "RESILIENCE";

      return { ...state, debt: remainingDebt, savings: state.savings - amount, creditScore: newScore, phase: phaseAfterRepay };
    }

    case "SHOW_RESILIENCE": return { ...state, phase: "RESILIENCE" };

    case "NEXT_SEASON":
        if (state.debt > 200000) return { ...state, phase: 'GAME_LOSS' };
        if (state.seasonNumber >= state.maxSeasons) return { ...state, phase: "SUMMARY" };

        let maturedamount = 0;
        let newFD = state.bankBalance.fixedDeposit;
        if (state.seasonNumber >= state.bankBalance.fdMaturitySeason && state.bankBalance.fixedDeposit > 0) {
            maturedamount = Math.floor(state.bankBalance.fixedDeposit * 1.1); 
            newFD = 0; 
        }
        const dbt = 2000; 

        let newSavings = state.savings + maturedamount + dbt;
        let newLandLoan = { ...state.landLoan };
        let penaltyDebt = 0;

        if (state.landLoan.principal > 0) {
            if (newSavings >= state.landLoan.seasonEmi) {
                newSavings -= state.landLoan.seasonEmi;
                newLandLoan.principal = Math.max(0, newLandLoan.principal - (state.landLoan.seasonEmi * 0.7)); 
                if(newLandLoan.principal === 0) newLandLoan.seasonEmi = 0;
            } else {
                penaltyDebt = 5000;
                newLandLoan.missedPayments += 1;
            }
        }

        return {
            ...state,
            seasonNumber: state.seasonNumber + 1,
            phase: "DASHBOARD",
            savings: newSavings, 
            debt: state.debt + penaltyDebt,
            bankBalance: { ...state.bankBalance, fixedDeposit: newFD },
            dbtBalance: state.dbtBalance + dbt,
            landLoan: newLandLoan,
            
            currentCrop: null, currentLoan: null, currentEvent: null,
            cumulativeYield: 1.0, cumulativePrice: 1.0, 
            seasonEventsLog: [], seasonFinancialHits: 0
        };

    case "RESET_GAME": clearGame(); return INITIAL_STATE;
    default: return state;
  }
};

const GameContext = createContext<{ state: GameState; dispatch: React.Dispatch<Action> } | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);

  useEffect(() => {
    // UPDATED LOGIC: Always wait 2.5s for splash, then load game OR start new
    setTimeout(() => {
        const saved = loadGame<GameState>();
        if (saved && saved.phase !== "SPLASH") {
            dispatch({ type: "LOAD_GAME", payload: saved });
        } else {
            dispatch({ type: "SET_LANGUAGE_PHASE" });
        }
    }, 2500);
  }, []);

  useEffect(() => { if (state.phase !== "SPLASH") saveGame(state); }, [state]);
  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within GameProvider");
  return context;
};