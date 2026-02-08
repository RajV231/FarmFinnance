export interface Crop {
  id: string;
  name: string;
  type: 'CROP' | 'VEGETABLE';
  costPerAcre: number;
  minYield: number;
  maxYield: number;
  pricePerUnit: number;
  riskFactor: number; // 0-1, higher is riskier
  waterReq: 'LOW' | 'MED' | 'HIGH';
}

export interface Loan {
  id: string;
  name: string;
  interestRate: number; // 0.04 = 4%
  maxAmount: number;
  provider: 'BANK' | 'MONEYLENDER' | 'COOP';
}

export interface Insurance {
  id: string;
  name: string;
  premium: number;
  coverage: number; // 0.8 = 80% coverage
}

export const CROPS: Crop[] = [
  // FIELD CROPS
  { id: 'cotton', name: 'Cotton', type: 'CROP', costPerAcre: 10000, minYield: 10, maxYield: 18, pricePerUnit: 6000, riskFactor: 0.6, waterReq: 'HIGH' },
  { id: 'soybean', name: 'Soybean', type: 'CROP', costPerAcre: 6000, minYield: 12, maxYield: 15, pricePerUnit: 4000, riskFactor: 0.3, waterReq: 'MED' },
  { id: 'wheat', name: 'Wheat', type: 'CROP', costPerAcre: 5000, minYield: 15, maxYield: 22, pricePerUnit: 2200, riskFactor: 0.2, waterReq: 'LOW' },
  
  // VEGETABLES (High Risk, High Reward)
  { id: 'onion', name: 'Onion', type: 'VEGETABLE', costPerAcre: 15000, minYield: 80, maxYield: 120, pricePerUnit: 1200, riskFactor: 0.9, waterReq: 'MED' },
  { id: 'tomato', name: 'Tomato', type: 'VEGETABLE', costPerAcre: 20000, minYield: 200, maxYield: 300, pricePerUnit: 500, riskFactor: 0.8, waterReq: 'HIGH' }
];

export const LOANS: Loan[] = [
  { id: 'kcc', name: 'Kisan Credit Card', interestRate: 0.07, maxAmount: 50000, provider: 'BANK' },
  { id: 'coop', name: 'Co-operative Society', interestRate: 0.12, maxAmount: 30000, provider: 'COOP' },
  { id: 'sahukar', name: 'Village Moneylender', interestRate: 0.36, maxAmount: 100000, provider: 'MONEYLENDER' }
];

export const INSURANCES: Insurance[] = [
  { id: 'none', name: 'No Insurance', premium: 0, coverage: 0 },
  { id: 'standard', name: 'Crop Insurance', premium: 1500, coverage: 0.8 }, // ₹1500 per acre
];

export interface GameEvent {
  id: string;
  timing: 'EARLY' | 'MID' | 'LATE';
  // Added 'FRAUD' and 'DIGITAL' to types
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

export const EVENTS: GameEvent[] = [
  // --- EARLY SEASON ---
  { 
    id: 'fake_loan_call', timing: 'EARLY', type: 'FRAUD', severity: 8,
    titleKey: 'OTP Scam Call', descKey: 'Caller claiming to be bank manager asks for OTP to approve your loan.',
    financialImpact: -5000, // You lose money if you fall for it
    choiceA: { label: 'Cut Call & Visit Bank', cost: 200, mitigatedWellbeing: 5 }, // Small travel cost, safe
    choiceB: { label: 'Share OTP', cost: 0 } // Free to do, but triggers the financialImpact
  },
  { 
    id: 'bad_seeds', timing: 'EARLY', type: 'INFRASTRUCTURE', severity: 5,
    titleKey: 'Poor Germination', descKey: 'The seeds are not sprouting well.',
    yieldImpact: 0.7,
    choiceA: { label: 'Re-sow Field', cost: 2500, mitigatedYield: 1.0 },
    choiceB: { label: 'Wait it out', cost: 0 }
  },

  // --- MID SEASON ---
  { 
    id: 'cash_theft', timing: 'MID', type: 'DIGITAL', severity: 6,
    titleKey: 'Cash Theft Risk', descKey: 'You are carrying large cash for fertilizer. Digital payment is safer.',
    financialImpact: -2000, // Risk of losing cash
    choiceA: { label: 'Pay via UPI/Digital', cost: 50, mitigatedWellbeing: 10 }, // Tiny internet cost
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

  // --- LATE SEASON ---
  { 
    id: 'market_middleman', timing: 'LATE', type: 'MARKET', severity: 5,
    titleKey: 'Trader vs Mandi', descKey: 'Local trader offers instant cash but lower rates. Mandi pays digitally but higher rates.',
    priceImpact: 0.8, // Trader pays less
    choiceA: { label: 'Sell at Mandi (Digital)', cost: 1000, mitigatedPrice: 1.0 }, // Transport cost, but better price
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
    choiceA: { label: 'Pay for Cold Storage', cost: 3000, mitigatedYield: 1.0 }, // Preserves price
    choiceB: { label: 'Sell at low price', cost: 0 }
  },
];