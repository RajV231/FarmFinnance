/**
 * AI-Powered Advisory Bot Engine - "Krishi Mitra" (Farm Friend)
 * 
 * Features:
 * - Situation-aware advice based on game state
 * - Behavioral nudges instead of lectures
 * - Trust-building through uncertainty admission
 * - Multiple personality modes (cautious vs risk-taker)
 */

import { GameState } from "../context/game-context";
import { Crop, CROPS, LOANS, ASSETS } from "../data/game-scenarios";

export type AdvisorPersonality = 'CAUTIOUS' | 'BALANCED' | 'RISK_TAKER';

export interface AdvisoryMessage {
  id: string;
  category: 'PROACTIVE' | 'REACTIVE' | 'EDUCATIONAL' | 'GOAL_TRACKING';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  message: string;
  suggestion?: string;
  actionType?: 'NONE' | 'VIEW_MARKET' | 'BUY_INSURANCE' | 'TAKE_LOAN' | 'SAVE_MORE' | 'DIVERSIFY';
  expiresAfterSeason?: number;
}

interface AdvisorState {
  messagesShown: string[];
  personality: AdvisorPersonality;
  trustLevel: number; // 0-100
  lastInteractionSeason: number;
}

let advisorState: AdvisorState = {
  messagesShown: [],
  personality: 'BALANCED',
  trustLevel: 50,
  lastInteractionSeason: 1
};

/**
 * Analyze game state and generate contextual advice
 */
export const generateAdvisoryMessages = (state: GameState): AdvisoryMessage[] => {
  const messages: AdvisoryMessage[] = [];
  const season = state.seasonNumber;
  
  // Skip if already shown this season
  if (advisorState.lastInteractionSeason === season) {
    return [];
  }

  // CRITICAL: Debt Warning
  if (state.debt > state.savings * 2) {
    messages.push({
      id: `debt_critical_${season}`,
      category: 'PROACTIVE',
      priority: 'CRITICAL',
      title: '⚠️ High Debt Alert',
      message: `Your debt (₹${state.debt.toLocaleString()}) is more than double your savings. This is risky!`,
      suggestion: advisorState.personality === 'CAUTIOUS' 
        ? 'Focus on repaying high-interest loans first. Avoid taking new loans this season.'
        : advisorState.personality === 'RISK_TAKER'
        ? 'Consider sticking to low-risk crops like Wheat to ensure stable income.'
        : 'A balanced approach: Take KCC loan if eligible, avoid moneylender loans.',
      actionType: 'VIEW_MARKET',
      expiresAfterSeason: season + 1
    });
  }

  // HIGH: Low Savings Warning
  if (state.savings < 10000 && season > 1) {
    messages.push({
      id: `low_savings_${season}`,
      category: 'PROACTIVE',
      priority: 'HIGH',
      title: '💰 Emergency Fund Needed',
      message: `You have only ₹${state.savings.toLocaleString()} in savings. Experts recommend keeping at least ₹50,000 for emergencies.`,
      suggestion: 'Consider saving 20-30% of your harvest income before spending on goals.',
      actionType: 'SAVE_MORE'
    });
  }

  // HIGH: No Insurance
  if (!state.currentInsurance || state.currentInsurance.id === 'none') {
    const cropRisk = state.currentCrop?.riskFactor || 0.5;
    if (cropRisk > 0.6) {
      messages.push({
        id: `no_insurance_risky_crop_${season}`,
        category: 'PROACTIVE',
        priority: 'HIGH',
        title: '🛡️ High Risk Without Insurance',
        message: `You're growing ${state.currentCrop?.name} (high risk) without insurance. A single pest attack or drought could wipe out your investment.`,
        suggestion: 'PMFBY insurance costs only ₹1,800/acre but can save lakhs in case of crop failure. With 90% subsidy, you pay just ₹180!',
        actionType: 'BUY_INSURANCE'
      });
    }
  }

  // MEDIUM: Crop Diversification
  if (state.totalAcres > 3 && state.currentCrop) {
    messages.push({
      id: `diversify_${season}`,
      category: 'EDUCATIONAL',
      priority: 'MEDIUM',
      title: '🌾 Consider Crop Diversification',
      message: `You have ${state.totalAcres.toFixed(1)} acres but planting only ${state.currentCrop.name}. What if prices crash?`,
      suggestion: 'Split your land: 60% low-risk crop (Wheat/Soybean), 40% high-value crop (Onion/Tomato). This reduces variance while maintaining good returns.',
      actionType: 'DIVERSIFY'
    });
  }

  // MEDIUM: KCC Eligibility
  if (state.creditScore >= 700 && !state.currentLoan) {
    messages.push({
      id: `kcc_eligible_${season}`,
      category: 'PROACTIVE',
      priority: 'MEDIUM',
      title: '✅ You Qualify for KCC!',
      message: `Your credit score (${state.creditScore}) makes you eligible for Kisan Credit Card at just 7% interest.`,
      suggestion: 'KCC is much cheaper than moneylender (36%) or cooperative (12%). Plus, you get 2% subvention for timely repayment!',
      actionType: 'TAKE_LOAN'
    });
  }

  // MEDIUM: Market Timing
  if (state.marketPrices.length > 0 && state.phase === 'PLANNING') {
    const highPriceCrops = state.marketPrices.filter(p => p.priceChange > 10);
    if (highPriceCrops.length > 0) {
      const cropNames = highPriceCrops.map(p => {
        const crop = CROPS.find(c => c.id === p.cropId);
        return crop?.name;
      }).filter(Boolean).join(', ');
      
      messages.push({
        id: `market_opportunity_${season}`,
        category: 'PROACTIVE',
        priority: 'MEDIUM',
        title: '📈 Market Opportunity',
        message: `${cropNames} prices are up ${highPriceCrops[0].priceChange}% this season!`,
        suggestion: 'This could be a good season to grow these crops, but remember: high prices often attract more farmers, which might crash prices next season.',
        actionType: 'VIEW_MARKET'
      });
    }
  }

  // GOAL TRACKING: Progress Update
  if (state.financialGoal && season % 2 === 0) {
    const progress = state.achievedGoals.length / 5 * 100; // Assuming 5 goals total
    if (progress < 50 && season > 3) {
      messages.push({
        id: `goal_progress_${season}`,
        category: 'GOAL_TRACKING',
        priority: 'MEDIUM',
        title: '🎯 Goal Progress Check',
        message: `You're working toward "${state.financialGoal.name}" (₹${state.financialGoal.targetAmount.toLocaleString()}). At your current pace, you might need ${Math.ceil((state.financialGoal.targetAmount - state.savings) / 50000)} more seasons.`,
        suggestion: 'Consider increasing savings rate or choosing lower-cost goals first to build momentum.',
        actionType: 'NONE'
      });
    }
  }

  // POSITIVE: Good Practices Reinforcement
  if (state.resilienceScore > 70) {
    messages.push({
      id: `resilience_good_${season}`,
      category: 'EDUCATIONAL',
      priority: 'LOW',
      title: '🌟 Excellent Financial Health!',
      message: `Your resilience score is ${state.resilienceScore} - well above average! You're managing risks wisely.`,
      suggestion: 'Keep maintaining emergency savings and consider long-term investments like FDs or gold.',
      actionType: 'NONE'
    });
  }

  // Filter out already shown messages
  const newMessages = messages.filter(m => !advisorState.messagesShown.includes(m.id));
  
  // Limit to 2 messages per season to avoid overwhelming
  return newMessages.slice(0, 2);
};

/**
 * Get reactive advice for specific player actions
 */
export const getReactiveAdvice = (action: string, state: GameState): AdvisoryMessage | null => {
  switch(action) {
    case 'PLAYER_ASKS_SELL_NOW_OR_WAIT':
      if (!state.currentCrop) return null;
      const cropId = state.currentCrop.id;
      const marketData = state.marketPrices.find(p => p.cropId === cropId);
      if (!marketData) return null;
      
      const cropName = state.currentCrop.name;
      
      return {
        id: `reactive_sell_${state.seasonNumber}`,
        category: 'REACTIVE',
        priority: 'MEDIUM',
        title: '🤔 Sell Now or Wait?',
        message: `Current ${cropName} price is ₹${marketData.currentPrice}/unit (${marketData.priceChange > 0 ? '+' : ''}${marketData.priceChange}% from base).`,
        suggestion: marketData.trend === 'UP'
          ? 'Prices are trending up. If you have storage (godown), consider waiting 1-2 weeks for better rates.'
          : marketData.trend === 'DOWN'
          ? 'Prices are falling. Unless you have urgent cash needs, storing and selling later might fetch better prices.'
          : 'Prices are stable. Selling now is reasonable unless you expect major market changes.',
        actionType: 'NONE'
      };

    case 'PLAYER_CONSIDERS_MONEYLENDER':
      return {
        id: 'reactive_moneylender_warning',
        category: 'REACTIVE',
        priority: 'HIGH',
        title: '⚠️ Moneylender Loan Warning',
        message: 'Moneylender charges 36% interest! For every ₹10,000 borrowed, you pay back ₹13,600.',
        suggestion: 'Even if KCC (7%) or Cooperative (12%) takes time, it\'s worth the wait. A ₹10,000 KCC loan costs only ₹10,700.',
        actionType: 'TAKE_LOAN'
      };

    default:
      return null;
  }
};

/**
 * Set advisor personality
 */
export const setAdvisorPersonality = (personality: AdvisorPersonality) => {
  advisorState.personality = personality;
};

/**
 * Mark message as shown
 */
export const markMessageShown = (messageId: string) => {
  advisorState.messagesShown.push(messageId);
  advisorState.lastInteractionSeason = Math.max(
    advisorState.lastInteractionSeason,
    parseInt(messageId.split('_').pop() || '1')
  );
};

/**
 * Get advisor trust level
 */
export const getTrustLevel = (): number => {
  return advisorState.trustLevel;
};

/**
 * Update trust based on advice accuracy (future feature)
 */
export const updateTrust = (wasHelpful: boolean) => {
  advisorState.trustLevel = Math.max(0, Math.min(100, 
    advisorState.trustLevel + (wasHelpful ? 5 : -3)
  ));
};

/**
 * Reset advisor state for new game
 */
export const resetAdvisor = () => {
  advisorState = {
    messagesShown: [],
    personality: 'BALANCED',
    trustLevel: 50,
    lastInteractionSeason: 1
  };
};

/**
 * Get personality description for UI
 */
export const getPersonalityDescription = (personality: AdvisorPersonality): string => {
  switch(personality) {
    case 'CAUTIOUS':
      return '🐢 Safe & Steady - Prioritizes risk avoidance and stable returns';
    case 'BALANCED':
      return '⚖️ Balanced Approach - Weighs risks against potential rewards';
    case 'RISK_TAKER':
      return '🚀 Growth Focused - Willing to take calculated risks for higher returns';
  }
};
