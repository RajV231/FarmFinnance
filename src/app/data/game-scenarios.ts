export interface Crop {
  id: string;
  nameKey: string; // CHANGED
  typeKey: string; // CHANGED
  costPerAcre: number;
  minYield: number;
  maxYield: number;
  pricePerUnit: number;
  riskFactor: number;
  waterReq: 'LOW' | 'MED' | 'HIGH';
}

export interface Asset {
  id: string;
  nameKey: string; // CHANGED
  typeKey: string; // CHANGED
  cost: number;
  maintenanceCost: number;
  descKey: string; // CHANGED
  effectType: 'COST_REDUCTION' | 'YIELD_BUFFER' | 'PRICE_BUFFER';
  targetEventTypes?: string[];
  effectValue: number;
}
export interface Loan {
  id: string;
  nameKey: string; // CHANGED
  interestRate: number;
  maxAmount: number;
  provider: 'BANK' | 'MONEYLENDER' | 'COOP';
  minCreditScore: number;
}
export interface Insurance {
  id: string;
  nameKey: string; // CHANGED
  premium: number;
  coverage: number;
}
export interface FinancialGoal {
  id: string;
  nameKey: string; // CHANGED
  targetAmount: number;
  descKey: string; // CHANGED
}

// --- REBALANCED CROPS ---
export const CROPS: Crop[] = [
  { id: 'cotton', nameKey: 'crop_cotton', typeKey: 'type_crop', costPerAcre: 15000, minYield: 12, maxYield: 16, pricePerUnit: 6200, riskFactor: 0.6, waterReq: 'HIGH' },
  { id: 'soybean', nameKey: 'crop_soybean', typeKey: 'type_crop', costPerAcre: 10000, minYield: 10, maxYield: 15, pricePerUnit: 4200, riskFactor: 0.3, waterReq: 'MED' },
  { id: 'wheat', nameKey: 'crop_wheat', typeKey: 'type_crop', costPerAcre: 8000, minYield: 18, maxYield: 25, pricePerUnit: 2400, riskFactor: 0.2, waterReq: 'LOW' },
  { id: 'onion', nameKey: 'crop_onion', typeKey: 'type_veg', costPerAcre: 25000, minYield: 100, maxYield: 150, pricePerUnit: 1400, riskFactor: 0.9, waterReq: 'MED' },
  { id: 'tomato', nameKey: 'crop_tomato', typeKey: 'type_veg', costPerAcre: 30000, minYield: 200, maxYield: 300, pricePerUnit: 600, riskFactor: 0.8, waterReq: 'HIGH' }
];

export const ASSETS: Asset[] = [
  { id: 'drip_irrigation', nameKey: 'asset_drip', typeKey: 'asset_type_infra', cost: 45000, maintenanceCost: 500, descKey: 'asset_drip_desc', effectType: 'YIELD_BUFFER', targetEventTypes: ['WEATHER', 'INFRASTRUCTURE'], effectValue: 0.8 },
  { id: 'mini_tractor', nameKey: 'asset_tractor', typeKey: 'asset_type_machinery', cost: 150000, maintenanceCost: 2000, descKey: 'asset_tractor_desc', effectType: 'COST_REDUCTION', targetEventTypes: ['PERSONAL', 'NEUTRAL'], effectValue: 0.3 },
  { id: 'greenhouse', nameKey: 'asset_greenhouse', typeKey: 'asset_type_infra', cost: 80000, maintenanceCost: 3000, descKey: 'asset_greenhouse_desc', effectType: 'YIELD_BUFFER', targetEventTypes: ['WEATHER'], effectValue: 0.9 },
  { id: 'solar_pump', nameKey: 'asset_solar', typeKey: 'asset_type_infra', cost: 120000, maintenanceCost: 100, descKey: 'asset_solar_desc', effectType: 'COST_REDUCTION', targetEventTypes: ['INFRASTRUCTURE'], effectValue: 0.8 },
  { id: 'warehouse', nameKey: 'asset_warehouse', typeKey: 'asset_type_infra', cost: 60000, maintenanceCost: 200, descKey: 'asset_warehouse_desc', effectType: 'PRICE_BUFFER', targetEventTypes: ['MARKET'], effectValue: 1.0 }
];

export const GOALS: FinancialGoal[] = [
  { id: 'tractor_big', nameKey: 'goal_tractor', targetAmount: 650000, descKey: 'goal_tractor_desc' },
  { id: 'education', nameKey: 'goal_edu', targetAmount: 300000, descKey: 'goal_edu_desc' },
  { id: 'land_expansion', nameKey: 'goal_land', targetAmount: 1000000, descKey: 'goal_land_desc' },
  { id: 'house', nameKey: 'goal_house', targetAmount: 800000, descKey: 'goal_house_desc' },
  { id: 'wedding', nameKey: 'goal_wedding', targetAmount: 500000, descKey: 'goal_wedding_desc' }
];

export const LOANS: Loan[] = [
  { id: 'kcc', nameKey: 'loan_kcc', interestRate: 0.07, maxAmount: 100000, provider: 'BANK', minCreditScore: 700 },
  { id: 'coop', nameKey: 'loan_coop', interestRate: 0.12, maxAmount: 50000, provider: 'COOP', minCreditScore: 600 },
  { id: 'sahukar', nameKey: 'loan_sahukar', interestRate: 0.36, maxAmount: 200000, provider: 'MONEYLENDER', minCreditScore: 0 }
];

export const INSURANCES: Insurance[] = [
  { id: 'none', nameKey: 'ins_none', premium: 0, coverage: 0 },
  { id: 'standard', nameKey: 'ins_pmfby', premium: 1800, coverage: 0.8 },
];
export interface GameEvent {
  id: string;
  timing: 'EARLY' | 'MID' | 'LATE';
  type: 'WEATHER' | 'MARKET' | 'PERSONAL' | 'SHOCK' | 'INFRASTRUCTURE' | 'FRAUD' | 'DIGITAL' | 'NEUTRAL';
  titleKey: string;
  descKey: string;
  severity: number;
  yieldImpact?: number;
  priceImpact?: number;
  financialImpact?: number;
  wellbeingImpact?: number;
  choiceA: { labelKey: string; cost: number; mitigatedYield?: number; mitigatedPrice?: number; mitigatedWellbeing?: number; };
  choiceB: { labelKey: string; cost: number; };
}

export const EVENTS: GameEvent[] = [
  { id: 'fake_loan_call', timing: 'EARLY', type: 'FRAUD', severity: 8, titleKey: 'evt_fraud_title', descKey: 'evt_fraud_desc', financialImpact: -10000, choiceA: { labelKey: 'evt_fraud_a', cost: 0, mitigatedWellbeing: 5 }, choiceB: { labelKey: 'evt_fraud_b', cost: 0 } },
  { id: 'bad_seeds', timing: 'EARLY', type: 'INFRASTRUCTURE', severity: 5, titleKey: 'evt_seeds_title', descKey: 'evt_seeds_desc', yieldImpact: 0.7, choiceA: { labelKey: 'evt_seeds_a', cost: 3000, mitigatedYield: 1.0 }, choiceB: { labelKey: 'evt_seeds_b', cost: 0 } },
  { id: 'monsoon_delay', timing: 'EARLY', type: 'WEATHER', severity: 6, titleKey: 'evt_monsoon_title', descKey: 'evt_monsoon_desc', yieldImpact: 0.8, choiceA: { labelKey: 'evt_monsoon_a', cost: 5000, mitigatedYield: 0.95 }, choiceB: { labelKey: 'evt_monsoon_b', cost: 0 } },
  { id: 'cash_theft', timing: 'MID', type: 'DIGITAL', severity: 6, titleKey: 'evt_theft_title', descKey: 'evt_theft_desc', financialImpact: -5000, choiceA: { labelKey: 'evt_theft_a', cost: 50, mitigatedWellbeing: 10 }, choiceB: { labelKey: 'evt_theft_b', cost: 0 } },
  { id: 'pest_attack', timing: 'MID', type: 'WEATHER', severity: 8, titleKey: 'evt_pest_title', descKey: 'evt_pest_desc', yieldImpact: 0.6, choiceA: { labelKey: 'evt_pest_a', cost: 4000, mitigatedYield: 0.95 }, choiceB: { labelKey: 'evt_pest_b', cost: 500 } },
  { id: 'borewell_fail', timing: 'MID', type: 'INFRASTRUCTURE', severity: 7, titleKey: 'evt_motor_title', descKey: 'evt_motor_desc', yieldImpact: 0.7, choiceA: { labelKey: 'evt_motor_a', cost: 8000, mitigatedYield: 1.0 }, choiceB: { labelKey: 'evt_motor_b', cost: 0 } },
  { id: 'market_middleman', timing: 'LATE', type: 'MARKET', severity: 5, titleKey: 'evt_mandi_title', descKey: 'evt_mandi_desc', priceImpact: 0.85, choiceA: { labelKey: 'evt_mandi_a', cost: 1500, mitigatedPrice: 1.0 }, choiceB: { labelKey: 'evt_mandi_b', cost: 0 } },
  { id: 'unseasonal_rain', timing: 'LATE', type: 'WEATHER', severity: 9, titleKey: 'evt_hail_title', descKey: 'evt_hail_desc', yieldImpact: 0.5, choiceA: { labelKey: 'evt_hail_a', cost: 6000, mitigatedYield: 0.8 }, choiceB: { labelKey: 'evt_hail_b', cost: 0 } },
  { id: 'market_crash', timing: 'LATE', type: 'MARKET', severity: 9, titleKey: 'evt_crash_title', descKey: 'evt_crash_desc', priceImpact: 0.6, yieldImpact: 1.0, choiceA: { labelKey: 'evt_crash_a', cost: 4000, mitigatedPrice: 1.0 }, choiceB: { labelKey: 'evt_crash_b', cost: 0 } },
];