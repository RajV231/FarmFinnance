import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import {
  Crop,
  Loan,
  Insurance,
  GameEvent,
  EVENTS,
  ASSETS,
  Asset,
} from "../data/game-scenarios"; //
import { saveGame, loadGame, clearGame } from "../utils/storage";
import {
  calculateInterest,
  calculateResilienceScore,
  detectPovertySpiral,
} from "../utils/game-calculations";

export type GamePhase =
  | "SPLASH"
  | "LANGUAGE"
  | "FARM_SETUP"
  | "DASHBOARD"
  | "PROFILE"
  | "REPORTS"
  | "SHOP"
  | "PLANNING"
  | "EVENT_EARLY"
  | "EVENT_MID"
  | "EVENT_LATE"
  | "HARVEST"
  | "RESILIENCE"
  | "GAME_OVER"
  | "SUMMARY";

export interface GameState {
  seasonNumber: number;
  maxSeasons: number;
  savings: number;
  debt: number;
  wellbeing: number;
  resilienceScore: number;
  resilienceBreakdown: {
    savingsScore: number;
    debtScore: number;
    riskScore: number;
  };
  isPovertySpiral: boolean;
  phase: GamePhase;

  farmSize: "<2" | "2-5" | ">5";
  farmType: "CROPS" | "VEGETABLES" | "MIXED";

  currentCrop: Crop | null;
  currentLoan: Loan | null;
  currentLoanAmount: number;
  currentInsurance: Insurance | null;
  currentEvent: GameEvent | null;

  creditScore: number;
  ownedAssets: string[];
  loanHistory: { amount: number; paid: number; defaulted: boolean }[];

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
  maxSeasons: 4,
  savings: 5000,
  debt: 0,
  wellbeing: 100,
  resilienceScore: 50,
  resilienceBreakdown: { savingsScore: 50, debtScore: 50, riskScore: 50 },
  isPovertySpiral: false,
  creditScore: 650,
  ownedAssets: [],
  loanHistory: [],
  phase: "SPLASH",
  farmSize: "2-5",
  farmType: "MIXED",
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

const getAcres = (size: string): number => {
  if (size === "<2") return 1.5;
  if (size === "2-5") return 3.5;
  if (size === ">5") return 8.0;
  return 2.0;
};

const getMitigatedCost = (
  originalCost: number,
  eventType: string,
  assets: string[],
) => {
  const relevantAssets = ASSETS.filter(
    (a) => assets.includes(a.id) && a.targetEventTypes?.includes(eventType),
  );

  let discountMultiplier = 1.0;
  relevantAssets.forEach((a) => {
    if (a.effectType === "COST_REDUCTION") discountMultiplier -= a.effectValue;
  });

  return Math.floor(originalCost * Math.max(0.1, discountMultiplier));
};

type Action =
  | { type: "LOAD_GAME"; payload: GameState }
  | { type: "SET_LANGUAGE_PHASE" }
  | { type: "SET_FARM_SETUP" }
  | { type: "CONFIRM_FARM_SETUP"; payload: { size: string; type: string } }
  | { type: "START_SEASON" }
  | { type: "GO_TO_DASHBOARD" }
  | { type: "GO_TO_PROFILE" }
  | { type: "GO_TO_REPORTS" }
  | { type: "GO_TO_SHOP" }
  | { type: "BUY_ASSET"; payload: Asset }
  | {
      type: "COMMIT_PLAN";
      payload: {
        crop: Crop;
        loan: Loan;
        loanAmount: number;
        insurance: Insurance;
        savingsAllocated: number;
      };
    }
  | { type: "TRIGGER_EVENT" }
  | {
      type: "RESOLVE_EVENT_CHOICE";
      payload: { cost: number; wellbeing: number };
    }
  | {
      type: "REPAY_LOAN";
      payload: { amount: number; type: "FULL" | "PARTIAL" | "DEFAULT" };
    }
  | { type: "SHOW_RESILIENCE" }
  | { type: "NEXT_SEASON" }
  | { type: "RESET_GAME" };

const performHarvestCalculation = (state: GameState): Partial<GameState> => {
  if (!state.currentCrop) return {};

  const acres = getAcres(state.farmSize);
  const variance = 0.9 + Math.random() * 0.2;

  const finalYieldPerAcre =
    state.currentCrop.minYield * variance * state.cumulativeYield;
  const totalYield = finalYieldPerAcre * acres;
  const finalPrice = state.currentCrop.pricePerUnit * state.cumulativePrice;
  const grossIncome = Math.floor(totalYield * finalPrice);

  const cropCost = state.currentCrop.costPerAcre * acres;
  const insuranceCost = (state.currentInsurance?.premium || 0) * acres;
  const interestRate = state.currentLoan ? state.currentLoan.interestRate : 0;
  const interestAmount = Math.floor(state.currentLoanAmount * interestRate);

  const totalExpenses =
    cropCost + insuranceCost + interestAmount + state.seasonFinancialHits;

  let insurancePayout = 0;
  const totalYieldDrop = variance * state.cumulativeYield;
  if (state.currentInsurance?.id !== "none" && totalYieldDrop < 0.7) {
    const expectedRevenue =
      state.currentCrop.maxYield * state.currentCrop.pricePerUnit * acres;
    insurancePayout = Math.floor(
      expectedRevenue * state.currentInsurance!.coverage,
    );
  }

  let liquidCash = state.savings + grossIncome + insurancePayout;
  let newDebt = state.debt + state.currentLoanAmount + interestAmount;

  if (liquidCash < 0) {
    newDebt += Math.abs(liquidCash);
    liquidCash = 0;
  }

  const isSpiral = detectPovertySpiral(newDebt, 50000 * acres);
  const resilienceData = calculateResilienceScore(
    liquidCash,
    newDebt,
    state.wellbeing,
    state.currentInsurance?.id !== "none",
  );

  return {
    savings: liquidCash,
    debt: newDebt,
    resilienceScore: resilienceData.total,
    resilienceBreakdown: resilienceData.breakdown,
    isPovertySpiral: isSpiral,
    lastHarvestStats: {
      grossIncome,
      totalExpenses,
      netProfit: grossIncome + insurancePayout - totalExpenses,
      yieldPercentage: totalYieldDrop * 100,
      insurancePayout,
      loanInterestPaid: interestAmount,
      eventCost: state.seasonFinancialHits,
    },
    history: [
      ...state.history,
      {
        season: state.seasonNumber,
        income: grossIncome,
        resilience: resilienceData.total,
      },
    ],
  };
};

const gameReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case "LOAD_GAME":
      return {
        ...INITIAL_STATE,
        ...action.payload,
        resilienceBreakdown:
          action.payload.resilienceBreakdown ||
          INITIAL_STATE.resilienceBreakdown,
      };
    case "SET_LANGUAGE_PHASE":
      return { ...state, phase: "LANGUAGE" };
    case "SET_FARM_SETUP":
      return { ...state, phase: "FARM_SETUP" };

    case "CONFIRM_FARM_SETUP":
      const size = action.payload.size;
      let startSavings = 5000;
      if (size === "2-5") startSavings = 15000;
      if (size === ">5") startSavings = 40000;
      return {
        ...state,
        farmSize: action.payload.size as any,
        farmType: action.payload.type as any,
        savings: startSavings,
        phase: "DASHBOARD",
      };

    case "START_SEASON":
      return { ...state, phase: "PLANNING" };
    case "GO_TO_DASHBOARD":
      return { ...state, phase: "DASHBOARD" };
    case "GO_TO_PROFILE":
      return { ...state, phase: "PROFILE" };
    case "GO_TO_REPORTS":
      return { ...state, phase: "REPORTS" };
    case "GO_TO_SHOP":
      return { ...state, phase: "SHOP" };

    case "BUY_ASSET":
      if (state.savings < action.payload.cost) return state;
      return {
        ...state,
        savings: state.savings - action.payload.cost,
        ownedAssets: [...state.ownedAssets, action.payload.id],
      };

    case "COMMIT_PLAN":
      const { crop, loan, loanAmount, insurance, savingsAllocated } =
        action.payload;
      const acres = getAcres(state.farmSize);
      const totalCropCost = crop.costPerAcre * acres;
      const totalInsuranceCost = insurance.premium * acres;
      const upfrontCost = totalCropCost + totalInsuranceCost;
      const liquidCash = savingsAllocated + loanAmount;
      const remainingSavings = state.savings - savingsAllocated;
      const finalCashForSeason = Math.max(
        0,
        liquidCash - upfrontCost + remainingSavings,
      );

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

    case "TRIGGER_EVENT":
      let stage: "EARLY" | "MID" | "LATE" = "EARLY";
      if (state.phase === "EVENT_MID") stage = "MID";
      if (state.phase === "EVENT_LATE") stage = "LATE";
      const stageEvents = EVENTS.filter((e) => e.timing === stage);
      const randomEvt =
        stageEvents.length > 0
          ? stageEvents[Math.floor(Math.random() * stageEvents.length)]
          : EVENTS[0];
      return { ...state, currentEvent: randomEvt };

    case "RESOLVE_EVENT_CHOICE":
      const cost = action.payload.cost;
      const evt = state.currentEvent!;
      let realCost = cost;

      if (realCost > 0) {
        realCost = getMitigatedCost(realCost, evt.type, state.ownedAssets);
      }

      let impactYield = evt.yieldImpact || 1;
      let impactPrice = evt.priceImpact || 1;
      let impactWellbeing = evt.wellbeingImpact || 0;
      let directCashHit = 0;

      const protectiveAssets = ASSETS.filter(
        (a) =>
          state.ownedAssets.includes(a.id) &&
          a.effectType === "YIELD_BUFFER" &&
          a.targetEventTypes?.includes(evt.type),
      );
      if (protectiveAssets.length > 0) {
        const loss = 1.0 - impactYield;
        const mitigation = loss * protectiveAssets[0].effectValue;
        impactYield = impactYield + mitigation;
      }

      if (cost > 0) {
        if (evt.choiceA.mitigatedYield)
          impactYield = evt.choiceA.mitigatedYield;
        if (evt.choiceA.mitigatedPrice)
          impactPrice = evt.choiceA.mitigatedPrice;
        if (evt.choiceA.mitigatedWellbeing)
          impactWellbeing += evt.choiceA.mitigatedWellbeing;
      } else {
        if (evt.financialImpact) directCashHit = Math.abs(evt.financialImpact);
      }

      const nextSavings = state.savings - realCost - directCashHit;
      const nextYield = state.cumulativeYield * impactYield;
      const nextPrice = state.cumulativePrice * impactPrice;
      const nextWellbeing = Math.max(
        0,
        Math.min(
          100,
          state.wellbeing + action.payload.wellbeing + impactWellbeing,
        ),
      );
      const nextLog = [...state.seasonEventsLog, evt.titleKey];
      const nextFinancialHits = state.seasonFinancialHits + directCashHit;

      let nextPhase: GamePhase = "HARVEST";
      if (state.phase === "EVENT_EARLY") nextPhase = "EVENT_MID";
      else if (state.phase === "EVENT_MID") nextPhase = "EVENT_LATE";

      const nextState = {
        ...state,
        savings: nextSavings,
        cumulativeYield: nextYield,
        cumulativePrice: nextPrice,
        wellbeing: nextWellbeing,
        seasonEventsLog: nextLog,
        seasonFinancialHits: nextFinancialHits,
        phase: nextPhase,
        currentEvent: null,
      };

      if (nextPhase === "HARVEST") {
        const harvestResults = performHarvestCalculation(nextState);
        return { ...nextState, ...harvestResults };
      }

      return nextState;

    // --- FIX: Prevent infinite loop by moving forward, not back to Dashboard ---
    case "REPAY_LOAN":
      const { amount, type } = action.payload;
      let scoreChange = 0;
      if (type === "FULL") scoreChange = 50;
      if (type === "PARTIAL") scoreChange = -10;
      if (type === "DEFAULT") scoreChange = -100;

      const remainingDebt = Math.max(0, state.debt - amount);
      const newScore = Math.min(
        900,
        Math.max(300, state.creditScore + scoreChange),
      );

      // CRITICAL FIX: If debt remains, we move to RESILIENCE to progress.
      // If cleared, we stay on HARVEST to show the clean slate.
      const phaseAfterRepay = remainingDebt === 0 ? "HARVEST" : "RESILIENCE";

      return {
        ...state,
        debt: remainingDebt,
        savings: state.savings - amount,
        creditScore: newScore,
        phase: phaseAfterRepay,
      };

    case "SHOW_RESILIENCE":
      return { ...state, phase: "RESILIENCE" };

    case "NEXT_SEASON":
      if (state.seasonNumber >= state.maxSeasons)
        return { ...state, phase: "SUMMARY" };
      return {
        ...state,
        seasonNumber: state.seasonNumber + 1,
        phase: "DASHBOARD",
        currentCrop: null,
        currentLoan: null,
        currentEvent: null,
      };

    case "RESET_GAME":
      clearGame();
      return INITIAL_STATE;

    default:
      return state;
  }
};

const GameContext = createContext<
  { state: GameState; dispatch: React.Dispatch<Action> } | undefined
>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);

  useEffect(() => {
    const saved = loadGame<GameState>();
    if (saved && saved.phase !== "SPLASH") {
      dispatch({ type: "LOAD_GAME", payload: saved });
    } else {
      setTimeout(() => dispatch({ type: "SET_LANGUAGE_PHASE" }), 2000);
    }
  }, []);

  useEffect(() => {
    if (state.phase !== "SPLASH") saveGame(state);
  }, [state]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within GameProvider");
  return context;
};