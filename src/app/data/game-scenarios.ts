export interface Crop {
  id: string;
  name: string;
  type: 'CROP' | 'VEGETABLE';
  costPerAcre: number; // Includes seeds, fertilizer, labor
  minYield: number;
  maxYield: number;
  pricePerUnit: number;
  riskFactor: number;
  waterReq: 'LOW' | 'MED' | 'HIGH';
}

export interface MarketData {
  cropId: string;
  currentPrice: number;
  basePrice: number;
  priceChange: number; // Percentage change from base
  trend: 'UP' | 'DOWN' | 'STABLE';
  mandiName: string;
  lastUpdated: string;
}

export interface GovernmentScheme {
  id: string;
  name: string;
  description: string;
  benefitAmount: number;
  eligibility: string[];
  category: 'INCOME_SUPPORT' | 'INSURANCE_SUBSIDY' | 'LOAN_BENEFIT' | 'ASSET_SUBSIDY';
  isActive: boolean;
  dbtEnabled: boolean;
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
export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  description: string;
}

// --- REBALANCED CROPS (Realistic ROI ~30-60%) ---
export const CROPS: Crop[] = [
  { 
    id: 'cotton', name: 'Cotton', type: 'CROP', 
    costPerAcre: 15000, // Reduced from 18k
    minYield: 12, maxYield: 16, // Increased yield (was 8-12)
    pricePerUnit: 6200, // Increased price (was 5800)
    riskFactor: 0.6, waterReq: 'HIGH' 
  },
  { 
    id: 'soybean', name: 'Soybean', type: 'CROP', 
    costPerAcre: 10000, // Reduced from 12k
    minYield: 10, maxYield: 15, 
    pricePerUnit: 4200, // Increased price
    riskFactor: 0.3, waterReq: 'MED' 
  },
  { 
    id: 'wheat', name: 'Wheat', type: 'CROP', 
    costPerAcre: 8000, // Very cheap input
    minYield: 18, maxYield: 25, 
    pricePerUnit: 2400, 
    riskFactor: 0.2, waterReq: 'LOW' 
  },
  // Veggies: High Risk, MASSIVE Reward
  { 
    id: 'onion', name: 'Onion', type: 'VEGETABLE', 
    costPerAcre: 25000, // Reduced cost
    minYield: 100, maxYield: 150, // Huge yield potential
    pricePerUnit: 1400, 
    riskFactor: 0.9, waterReq: 'MED' 
  },
  { 
    id: 'tomato', name: 'Tomato', type: 'VEGETABLE', 
    costPerAcre: 30000, 
    minYield: 200, maxYield: 300, 
    pricePerUnit: 600, // Volume based profit
    riskFactor: 0.8, waterReq: 'HIGH' 
  }
];

export const ASSETS: Asset[] = [
  { id: 'drip_irrigation', name: 'Drip Irrigation', type: 'INFRASTRUCTURE', cost: 45000, maintenanceCost: 500, description: 'Saves water. Protects yield during Droughts.', effectType: 'YIELD_BUFFER', targetEventTypes: ['WEATHER', 'INFRASTRUCTURE'], effectValue: 0.8 },
  { id: 'mini_tractor', name: 'Power Tiller (Mini Tractor)', type: 'MACHINERY', cost: 150000, maintenanceCost: 2000, description: 'Good for small fields. Reduces labor cost slightly.', effectType: 'COST_REDUCTION', targetEventTypes: ['PERSONAL', 'NEUTRAL'], effectValue: 0.3 },
  { id: 'greenhouse', name: 'Polyhouse Net', type: 'INFRASTRUCTURE', cost: 80000, maintenanceCost: 3000, description: 'Protects vegetables from pests and unseasonal rain.', effectType: 'YIELD_BUFFER', targetEventTypes: ['WEATHER'], effectValue: 0.9 },
  { id: 'solar_pump', name: 'Solar Water Pump', type: 'INFRASTRUCTURE', cost: 120000, maintenanceCost: 100, description: 'Free electricity for irrigation. Reduces infrastructure risks.', effectType: 'COST_REDUCTION', targetEventTypes: ['INFRASTRUCTURE'], effectValue: 0.8 },
  { id: 'warehouse', name: 'Small Godown', type: 'INFRASTRUCTURE', cost: 60000, maintenanceCost: 200, description: 'Store crops safely to avoid selling at a loss.', effectType: 'PRICE_BUFFER', targetEventTypes: ['MARKET'], effectValue: 1.0 }
];
export const GOALS: FinancialGoal[] = [
  { id: 'tractor_big', name: 'Heavy Duty Tractor', targetAmount: 650000, description: 'A 45HP Tractor for large scale farming and renting out.' },
  { id: 'education', name: "Children's Higher Ed", targetAmount: 300000, description: 'Engineering or Medical college fees for your kids.' },
  { id: 'land_expansion', name: "Buy Neighbor's Field", targetAmount: 1000000, description: 'Expand your farm by 5 acres to become a Zamindar.' },
  { id: 'house', name: "Build Pucca House", targetAmount: 800000, description: 'A concrete house to protect your family from seasons.' },
  { id: 'wedding', name: "Grand Wedding", targetAmount: 500000, description: 'A respectable wedding ceremony for your family member.' }
];
export const LOANS: Loan[] = [
  { id: 'kcc', name: 'Kisan Credit Card', interestRate: 0.07, maxAmount: 100000, provider: 'BANK', minCreditScore: 700 },
  { id: 'coop', name: 'Co-operative Soc.', interestRate: 0.12, maxAmount: 50000, provider: 'COOP', minCreditScore: 600 },
  { id: 'sahukar', name: 'Moneylender', interestRate: 0.36, maxAmount: 200000, provider: 'MONEYLENDER', minCreditScore: 0 }
];
export const INSURANCES: Insurance[] = [
  { id: 'none', name: 'No Insurance', premium: 0, coverage: 0 },
  { id: 'standard', name: 'PMFBY Insurance', premium: 1800, coverage: 0.8 },
];

// Government Schemes Data - Phase 1 Implementation
export const GOVERNMENT_SCHEMES: GovernmentScheme[] = [
  { 
    id: 'pm_kisan', 
    name: 'PM-KISAN', 
    description: 'Income support of ₹6,000 per year in 3 installments',
    benefitAmount: 2000,
    eligibility: ['SMALL_FARMER', 'MARGINAL_FARMER'],
    category: 'INCOME_SUPPORT',
    isActive: true,
    dbtEnabled: true
  },
  {
    id: 'pmfby_subsidy',
    name: 'PMFBY Subsidy',
    description: '90% subsidy on crop insurance premium for small farmers',
    benefitAmount: 1620, // 90% of 1800 premium
    eligibility: ['SMALL_FARMER', 'MARGINAL_FARMER'],
    category: 'INSURANCE_SUBSIDY',
    isActive: true,
    dbtEnabled: true
  },
  {
    id: 'kcc_interest',
    name: 'KCC Interest Subvention',
    description: '2% interest subvention on Kisan Credit Card loans',
    benefitAmount: 0, // Calculated dynamically based on loan amount
    eligibility: ['KCC_HOLDER'],
    category: 'LOAN_BENEFIT',
    isActive: true,
    dbtEnabled: false
  },
  {
    id: 'drip_subsidy',
    name: 'Micro Irrigation Subsidy',
    description: '55% subsidy on drip irrigation system installation',
    benefitAmount: 24750, // 55% of 45000
    eligibility: ['SMALL_FARMER'],
    category: 'ASSET_SUBSIDY',
    isActive: true,
    dbtEnabled: true
  },
  {
    id: 'solar_pump_subsidy',
    name: 'Solar Pump Subsidy (PM-KUSUM)',
    description: '60% subsidy on solar water pump under PM-KUSUM scheme',
    benefitAmount: 72000, // 60% of 120000
    eligibility: ['SMALL_FARMER', 'MARGINAL_FARMER'],
    category: 'ASSET_SUBSIDY',
    isActive: true,
    dbtEnabled: true
  }
];

// Market Mandis for Dynamic Pricing
export const MANDIS = [
  { id: 'local_mandi', name: 'Local APMC Mandi', distance: 15, baseDiscount: 0.95 },
  { id: 'district_mandi', name: 'District Main Mandi', distance: 45, baseDiscount: 1.0 },
  { id: 'state_mandi', name: 'State Agricultural Market', distance: 120, baseDiscount: 1.05 }
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
  choiceA: { label: string; cost: number; mitigatedYield?: number; mitigatedPrice?: number; mitigatedWellbeing?: number; };
  choiceB: { label: string; cost: number; };
}
export const EVENTS: GameEvent[] = [
  { id: 'fake_loan_call', timing: 'EARLY', type: 'FRAUD', severity: 8, titleKey: 'OTP Scam Call', descKey: 'Caller claims to be bank manager asking for OTP.', financialImpact: -10000, choiceA: { label: 'Cut Call & Block', cost: 0, mitigatedWellbeing: 5 }, choiceB: { label: 'Share OTP', cost: 0 } },
  { id: 'bad_seeds', timing: 'EARLY', type: 'INFRASTRUCTURE', severity: 5, titleKey: 'Poor Germination', descKey: 'Seeds are not sprouting well.', yieldImpact: 0.7, choiceA: { label: 'Re-sow Field', cost: 3000, mitigatedYield: 1.0 }, choiceB: { label: 'Wait it out', cost: 0 } },
  { id: 'monsoon_delay', timing: 'EARLY', type: 'WEATHER', severity: 6, titleKey: 'Monsoon Delayed', descKey: 'Rains are late. Soil is drying up.', yieldImpact: 0.8, choiceA: { label: 'Rent Water Tanker', cost: 5000, mitigatedYield: 0.95 }, choiceB: { label: 'Hope for rain', cost: 0 } },
  { id: 'cash_theft', timing: 'MID', type: 'DIGITAL', severity: 6, titleKey: 'Cash Risk', descKey: 'Carrying large cash for fertilizer is risky.', financialImpact: -5000, choiceA: { label: 'Pay via UPI', cost: 50, mitigatedWellbeing: 10 }, choiceB: { label: 'Pay Cash', cost: 0 } },
  { id: 'pest_attack', timing: 'MID', type: 'WEATHER', severity: 8, titleKey: 'Pest Attack', descKey: 'Bollworms are damaging the crop.', yieldImpact: 0.6, choiceA: { label: 'Spray Pesticide', cost: 4000, mitigatedYield: 0.95 }, choiceB: { label: 'Home Remedy', cost: 500 } },
  { id: 'borewell_fail', timing: 'MID', type: 'INFRASTRUCTURE', severity: 7, titleKey: 'Motor Burnt', descKey: 'Irrigation motor burnt due to voltage spike.', yieldImpact: 0.7, choiceA: { label: 'Repair Immediately', cost: 8000, mitigatedYield: 1.0 }, choiceB: { label: 'Skip Irrigation', cost: 0 } },
  { id: 'market_middleman', timing: 'LATE', type: 'MARKET', severity: 5, titleKey: 'Trader vs Mandi', descKey: 'Local trader offers instant cash but lower rates.', priceImpact: 0.85, choiceA: { label: 'Sell at Mandi (UPI)', cost: 1500, mitigatedPrice: 1.0 }, choiceB: { label: 'Sell to Trader (Cash)', cost: 0 } },
  { id: 'unseasonal_rain', timing: 'LATE', type: 'WEATHER', severity: 9, titleKey: 'Hailstorm', descKey: 'Heavy hail just before harvest!', yieldImpact: 0.5, choiceA: { label: 'Emergency Harvest', cost: 6000, mitigatedYield: 0.8 }, choiceB: { label: 'Do nothing', cost: 0 } },
  { id: 'market_crash', timing: 'LATE', type: 'MARKET', severity: 9, titleKey: 'Price Crash', descKey: 'Market prices dropped by 40% due to glut.', priceImpact: 0.6, yieldImpact: 1.0, choiceA: { label: 'Use Cold Storage', cost: 4000, mitigatedPrice: 1.0 }, choiceB: { label: 'Sell at low price', cost: 0 } },
];