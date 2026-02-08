export interface Crop {
  id: string;
  name: string;
  type: 'CROP' | 'VEGETABLE';
  costPerAcre: number;
  minYield: number;
  maxYield: number;
  pricePerUnit: number;
  riskFactor: number;
  waterReq: 'LOW' | 'MED' | 'HIGH';
}

export interface Asset {
  id: string;
  name: string;
  type: 'MACHINERY' | 'INFRASTRUCTURE' | 'PROTECTION';
  cost: number;
  maintenanceCost: number; 
  description: string;
  effectType: 'COST_REDUCTION' | 'YIELD_BUFFER' | 'PRICE_BUFFER';
  targetEventTypes?: string[]; 
  effectValue: number; 
}

export interface Loan {
  id: string;
  name: string;
  interestRate: number;
  maxAmount: number;
  provider: 'BANK' | 'MONEYLENDER' | 'COOP';
  minCreditScore: number;
}

export interface Insurance {
  id: string;
  name: string;
  premium: number;
  coverage: number;
}

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

  choiceA: {
    label: string;
    cost: number;
    mitigatedYield?: number;
    mitigatedPrice?: number;
    mitigatedWellbeing?: number;
  };

  choiceB: {
    label: string;
    cost: number;
  };
}

// --- DATA ---

export const CROPS: Crop[] = [
  { id: 'cotton', name: 'Cotton', type: 'CROP', costPerAcre: 10000, minYield: 10, maxYield: 18, pricePerUnit: 6000, riskFactor: 0.6, waterReq: 'HIGH' },
  { id: 'soybean', name: 'Soybean', type: 'CROP', costPerAcre: 6000, minYield: 12, maxYield: 15, pricePerUnit: 4000, riskFactor: 0.3, waterReq: 'MED' },
  { id: 'wheat', name: 'Wheat', type: 'CROP', costPerAcre: 5000, minYield: 15, maxYield: 22, pricePerUnit: 2200, riskFactor: 0.2, waterReq: 'LOW' },
  { id: 'onion', name: 'Onion', type: 'VEGETABLE', costPerAcre: 15000, minYield: 80, maxYield: 120, pricePerUnit: 1200, riskFactor: 0.9, waterReq: 'MED' },
  { id: 'tomato', name: 'Tomato', type: 'VEGETABLE', costPerAcre: 20000, minYield: 200, maxYield: 300, pricePerUnit: 500, riskFactor: 0.8, waterReq: 'HIGH' }
];

export const ASSETS: Asset[] = [
  {
    id: 'drip_irrigation',
    name: 'Drip Irrigation',
    type: 'INFRASTRUCTURE',
    cost: 25000,
    maintenanceCost: 500,
    description: 'Reduces water usage. Protects yield during Droughts.',
    effectType: 'YIELD_BUFFER',
    targetEventTypes: ['WEATHER', 'INFRASTRUCTURE'],
    effectValue: 0.8 
  },
  {
    id: 'tractor',
    name: 'Mini Tractor',
    type: 'MACHINERY',
    cost: 150000,
    maintenanceCost: 2000,
    description: 'Reduces labor costs for sowing and harvest.',
    effectType: 'COST_REDUCTION',
    targetEventTypes: ['PERSONAL', 'NEUTRAL'], 
    effectValue: 0.5 
  },
  {
    id: 'warehouse',
    name: 'Small Godown',
    type: 'INFRASTRUCTURE',
    cost: 40000,
    maintenanceCost: 200,
    description: 'Store crops safely. Protects against Market Crashes.',
    effectType: 'PRICE_BUFFER',
    targetEventTypes: ['MARKET'],
    effectValue: 1.0 
  }
];

export const LOANS: Loan[] = [
  { id: 'kcc', name: 'Kisan Credit Card (Govt)', interestRate: 0.07, maxAmount: 50000, provider: 'BANK', minCreditScore: 700 },
  { id: 'coop', name: 'Co-operative Society', interestRate: 0.12, maxAmount: 30000, provider: 'COOP', minCreditScore: 600 },
  { id: 'sahukar', name: 'Village Moneylender', interestRate: 0.36, maxAmount: 100000, provider: 'MONEYLENDER', minCreditScore: 0 }
];

export const INSURANCES: Insurance[] = [
  { id: 'none', name: 'No Insurance', premium: 0, coverage: 0 },
  { id: 'standard', name: 'Crop Insurance', premium: 1500, coverage: 0.8 },
];

export const EVENTS: GameEvent[] = [
  // --- EARLY SEASON (3 Events) ---
  { 
    id: 'fake_loan_call', timing: 'EARLY', type: 'FRAUD', severity: 8,
    titleKey: 'OTP Scam Call', descKey: 'Caller claiming to be bank manager asks for OTP to approve your loan.',
    financialImpact: -5000, 
    choiceA: { label: 'Cut Call & Visit Bank', cost: 200, mitigatedWellbeing: 5 },
    choiceB: { label: 'Share OTP', cost: 0 }
  },
  { 
    id: 'bad_seeds', timing: 'EARLY', type: 'INFRASTRUCTURE', severity: 5,
    titleKey: 'Poor Germination', descKey: 'The seeds are not sprouting well.',
    yieldImpact: 0.7,
    choiceA: { label: 'Re-sow Field', cost: 2500, mitigatedYield: 1.0 },
    choiceB: { label: 'Wait it out', cost: 0 }
  },
  { 
    id: 'monsoon_delay', timing: 'EARLY', type: 'WEATHER', severity: 6,
    titleKey: 'Monsoon Delayed', descKey: 'Rains are late. Soil is drying up fast.',
    yieldImpact: 0.8,
    choiceA: { label: 'Rent Water Tanker', cost: 3500, mitigatedYield: 0.95 },
    choiceB: { label: 'Hope for rain', cost: 0 }
  },

  // --- MID SEASON (3 Events) ---
  { 
    id: 'cash_theft', timing: 'MID', type: 'DIGITAL', severity: 6,
    titleKey: 'Cash Theft Risk', descKey: 'You are carrying large cash for fertilizer. Digital payment is safer.',
    financialImpact: -2000,
    choiceA: { label: 'Pay via UPI/Digital', cost: 50, mitigatedWellbeing: 10 },
    choiceB: { label: 'Pay via Cash', cost: 0 }
  },
  { 
    id: 'pest_attack', timing: 'MID', type: 'WEATHER', severity: 8,
    titleKey: 'Pest Attack', descKey: 'Bollworms are damaging the leaves rapidly.',
    yieldImpact: 0.6,
    choiceA: { label: 'Spray Pesticide', cost: 3000, mitigatedYield: 0.95 },
    choiceB: { label: 'Use Home Remedy', cost: 200 }
  },
  { 
    id: 'borewell_fail', timing: 'MID', type: 'INFRASTRUCTURE', severity: 7,
    titleKey: 'Motor Burnt', descKey: 'Voltage fluctuation burnt your irrigation motor.',
    yieldImpact: 0.7,
    choiceA: { label: 'Repair Immediately', cost: 5000, mitigatedYield: 1.0 },
    choiceB: { label: 'Skip Irrigation', cost: 0 }
  },

  // --- LATE SEASON (3 Events) ---
  { 
    id: 'market_middleman', timing: 'LATE', type: 'MARKET', severity: 5,
    titleKey: 'Trader vs Mandi', descKey: 'Local trader offers instant cash but lower rates. Mandi pays digitally but higher rates.',
    priceImpact: 0.8,
    choiceA: { label: 'Sell at Mandi (Digital)', cost: 1000, mitigatedPrice: 1.0 },
    choiceB: { label: 'Sell to Trader (Cash)', cost: 0 }
  },
  { 
    id: 'unseasonal_rain', timing: 'LATE', type: 'WEATHER', severity: 9,
    titleKey: 'Hailstorm', descKey: 'Heavy hail just before harvest.',
    yieldImpact: 0.5,
    choiceA: { label: 'Emergency Harvest', cost: 4500, mitigatedYield: 0.8 },
    choiceB: { label: 'Do nothing', cost: 0 }
  } ,
  { 
    id: 'market_crash', timing: 'LATE', type: 'MARKET', severity: 9, 
    titleKey: 'Price Crash', descKey: 'Market prices dropped by 40%.',
    priceImpact: 0.6,
    yieldImpact: 1.0,
    choiceA: { label: 'Pay for Cold Storage', cost: 3000, mitigatedYield: 1.0 },
    choiceB: { label: 'Sell at low price', cost: 0 }
  },
];