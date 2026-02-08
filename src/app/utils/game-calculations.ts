import { Crop, Insurance, Loan } from "../data/game-scenarios";

export const calculateProjectedYield = (crop: Crop, riskFactor: number): number => {
  // Volatility increases with risk factor.
  // Base calculation + Variance
  const variance = (crop.maxYield - crop.minYield) * Math.random();
  const rawYield = crop.minYield + variance;
  
  // Adjust based on external risk inputs (randomness handled in engine)
  return parseFloat(rawYield.toFixed(1));
};

export const calculateInterest = (debt: number, rate: number): number => {
  return Math.floor(debt * rate);
};

export const calculateResilienceScore = (savings: number, debt: number, wellbeing: number, hasInsurance: boolean) => {
  // 1. Savings Score (0-100)
  // Target: 10,000 savings = 100 score. Cap at 100.
  const savingsScore = Math.min(100, Math.floor((savings / 10000) * 100));

  // 2. Debt Score (0-100)
  // 0 debt = 100 score. 20,000 debt = 0 score.
  const debtScore = Math.max(0, 100 - Math.floor((debt / 20000) * 100));

  // 3. Risk Preparedness (0-100)
  // Base 50 + 50 if insured. Penalize if low wellbeing.
  let riskScore = hasInsurance ? 90 : 40;
  if (wellbeing < 50) riskScore -= 20;
  
  // Total Weighted Score
  const total = Math.floor((savingsScore * 0.4) + (debtScore * 0.4) + (riskScore * 0.2));

  return {
    total: Math.max(0, Math.min(100, total)),
    breakdown: {
      savingsScore,
      debtScore,
      riskScore
    }
  };
};

export const detectPovertySpiral = (debt: number, annualIncomePotential: number): boolean => {
  // If debt is > 3x potential income, it's a spiral
  if (debt > annualIncomePotential * 3) return true;
  return false;
};