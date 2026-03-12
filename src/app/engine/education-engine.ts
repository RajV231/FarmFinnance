import { FinancialGoal } from "../data/game-scenarios";

interface EducationTip {
  id: string;
  triggerContext: string[]; // Contexts that trigger this tip
  title: string;
  content: string;
  actionLabel?: string;
  relatedGoal?: string;
}

// Educational content database for Financial Literacy Pop-ups
export const EDUCATION_TIPS: EducationTip[] = [
  {
    id: 'crop_insurance_basics',
    triggerContext: ['insurance_selection', 'event_crop_damage'],
    title: 'Why Crop Insurance Matters',
    content: 'Crop insurance protects you from losses due to weather, pests, or market crashes. PMFBY offers up to 90% subsidy for small farmers. A ₹1,800 premium can save you lakhs in a bad season!',
    actionLabel: 'Learn About PMFBY',
    relatedGoal: 'risk_management'
  },
  {
    id: 'kcc_benefits',
    triggerContext: ['loan_selection', 'high_interest_loan'],
    title: 'Kisan Credit Card (KCC) Benefits',
    content: 'KCC offers loans at just 7% interest (vs 36% from moneylenders). With timely repayment, you get 2% subvention, bringing it down to 5%! Build your credit score to qualify.',
    actionLabel: 'Check Eligibility',
    relatedGoal: 'credit_building'
  },
  {
    id: 'diversification_strategy',
    triggerContext: ['single_crop_planning', 'high_risk_crop_selected'],
    title: 'Crop Diversification Strategy',
    content: 'Don\'t put all eggs in one basket! Growing multiple crops reduces risk. If one fails due to weather or price crash, others can sustain you. Consider mixing low-risk cereals with high-value vegetables.',
    actionLabel: 'View Crop Options',
    relatedGoal: 'risk_management'
  },
  {
    id: 'emergency_fund_importance',
    triggerContext: ['low_savings_warning', 'event_unexpected_expense'],
    title: 'Emergency Fund: Your Financial Shield',
    content: 'Experts recommend keeping 3-6 months of expenses as emergency fund. For farmers, this means ₹50,000-₹1,00,000 for unexpected events like medical emergencies or crop failure.',
    actionLabel: 'Start Saving',
    relatedGoal: 'emergency_fund'
  },
  {
    id: 'compound_interest_magic',
    triggerContext: ['fd_deposit', 'gold_purchase', 'savings_milestone'],
    title: 'Power of Compound Interest',
    content: 'Money grows faster when interest earns interest! ₹10,000 in FD at 6.5% becomes ₹18,000 in 10 years. Start early, even with small amounts. Your future self will thank you!',
    actionLabel: 'Calculate Returns',
    relatedGoal: 'wealth_building'
  },
  {
    id: 'debt_trap_warning',
    triggerContext: ['multiple_loans', 'high_debt_ratio', 'loan_default_warning'],
    title: 'Avoiding the Debt Trap',
    content: 'High-interest debt (>15%) can spiral out of control. Priority order: 1) Pay moneylender loans first (36%!), 2) Then cooperative loans (12%), 3) Bank loans last (7%). Never borrow to repay another loan!',
    actionLabel: 'Create Repayment Plan',
    relatedGoal: 'debt_freedom'
  },
  {
    id: 'mandi_vs_trader',
    triggerContext: ['harvest_selling_decision', 'market_event'],
    title: 'Mandi vs Local Trader',
    content: 'Local traders offer instant cash but pay 10-15% less. Mandis give better prices but have transport costs and delays. For large harvests, Mandi usually gives 20-30% more profit even after expenses.',
    actionLabel: 'Compare Prices',
    relatedGoal: 'profit_maximization'
  },
  {
    id: 'pm_kisan_eligibility',
    triggerContext: ['dashboard_view', 'season_start'],
    title: 'PM-KISAN: Free Money You\'re Entitled To',
    content: 'PM-KISAN gives ₹6,000/year in 3 installments directly to your bank account. All landholding farmer families are eligible. This is NOT a loan - it\'s your right! Make sure you\'re registered.',
    actionLabel: 'Check Registration Status',
    relatedGoal: 'government_benefits'
  },
  {
    id: 'credit_score_importance',
    triggerContext: ['loan_rejection', 'low_credit_score_warning'],
    title: 'Your Credit Score is Your Reputation',
    content: 'Credit score (300-900) determines loan eligibility and interest rates. 750+ gets best rates. Build it by: paying on time, keeping debt low, and maintaining long credit history. One default can drop it by 100 points!',
    actionLabel: 'Improve Score Tips',
    relatedGoal: 'credit_building'
  },
  {
    id: 'storage_benefit',
    triggerContext: ['low_price_at_harvest', 'warehouse_available'],
    title: 'Storage: Sell When Prices Are High',
    content: 'Farmers often sell immediately after harvest when prices are lowest. With storage (godown), you can wait 2-3 months and potentially get 30-50% higher prices. Cold storage costs are tax-deductible!',
    actionLabel: 'Calculate Storage ROI',
    relatedGoal: 'profit_maximization'
  }
];

/**
 * Get relevant education tip based on current game context
 */
export const getEducationTip = (context: string): EducationTip | null => {
  const matchingTips = EDUCATION_TIPS.filter(tip => 
    tip.triggerContext.includes(context)
  );
  
  if (matchingTips.length === 0) return null;
  
  // Return random tip from matches to avoid repetition
  return matchingTips[Math.floor(Math.random() * matchingTips.length)];
};

/**
 * Get all tips for a specific goal
 */
export const getTipsForGoal = (goalId: string): EducationTip[] => {
  return EDUCATION_TIPS.filter(tip => tip.relatedGoal === goalId);
};

/**
 * Format tip for display with simple language
 */
export const formatTipForDisplay = (tip: EducationTip): {
  headline: string;
  keyPoints: string[];
  callToAction: string;
} => {
  // Split content into digestible points
  const sentences = tip.content.split(/[.!?]/).filter(s => s.trim().length > 0);
  
  return {
    headline: tip.title,
    keyPoints: sentences.map(s => s.trim() + '.'),
    callToAction: tip.actionLabel || 'Got it!'
  };
};
