import { Crop, MarketData } from "../data/game-scenarios";
import { MANDIS } from "../data/game-scenarios";

interface MarketState {
  season: number;
  priceHistory: Record<string, number[]>;
  volatilityIndex: number; // 0-1, higher = more volatile
}

// Initialize market state
const createMarketState = (): MarketState => ({
  season: 1,
  priceHistory: {},
  volatilityIndex: 0.3
});

let marketState = createMarketState();

/**
 * Calculate dynamic crop prices based on supply-demand mechanics
 * Features:
 * - Random market fluctuations (±30%)
 * - Seasonal trends
 * - Mandi location impact
 * - Price memory for trend analysis
 */
export const generateMarketPrices = (crops: Crop[], currentSeason: number): MarketData[] => {
  marketState.season = currentSeason;
  
  return crops.map(crop => {
    const basePrice = crop.pricePerUnit;
    
    // Initialize price history if needed
    if (!marketState.priceHistory[crop.id]) {
      marketState.priceHistory[crop.id] = [basePrice];
    }
    
    // Market factors
    const randomFactor = 0.7 + Math.random() * 0.6; // 0.7 to 1.3 (±30%)
    const seasonalTrend = getSeasonalTrend(crop, currentSeason);
    const demandShock = getDemandShock(crop.id, currentSeason);
    
    // Calculate final price
    let finalPrice = basePrice * randomFactor * seasonalTrend * demandShock;
    
    // Apply some price stickiness (prices don't change dramatically overnight)
    const lastPrice = marketState.priceHistory[crop.id].slice(-1)[0] || basePrice;
    const maxChange = 0.25; // Max 25% change per season
    const clampedPrice = Math.max(
      lastPrice * (1 - maxChange),
      Math.min(lastPrice * (1 + maxChange), finalPrice)
    );
    
    // Update history
    marketState.priceHistory[crop.id].push(clampedPrice);
    if (marketState.priceHistory[crop.id].length > 10) {
      marketState.priceHistory[crop.id].shift(); // Keep last 10 seasons
    }
    
    // Determine trend
    const priceChange = ((clampedPrice - basePrice) / basePrice) * 100;
    const trend: 'UP' | 'DOWN' | 'STABLE' = 
      priceChange > 5 ? 'UP' : priceChange < -5 ? 'DOWN' : 'STABLE';
    
    // Select random mandi
    const mandi = MANDIS[Math.floor(Math.random() * MANDIS.length)];
    
    return {
      cropId: crop.id,
      currentPrice: Math.round(clampedPrice),
      basePrice: basePrice,
      priceChange: Math.round(priceChange * 10) / 10,
      trend,
      mandiName: mandi.name,
      lastUpdated: `Season ${currentSeason}`
    };
  });
};

/**
 * Get seasonal price trends for different crop types
 */
const getSeasonalTrend = (crop: Crop, season: number): number => {
  // Simple seasonal pattern - can be enhanced with real agricultural data
  const cropType = crop.type;
  const seasonInYear = ((season - 1) % 4) + 1; // 1-4 representing seasons in a year
  
  // Vegetables more volatile, crops more stable
  const baseVolatility = cropType === 'VEGETABLE' ? 0.15 : 0.08;
  
  // Seasonal patterns
  if (crop.id === 'wheat' && (seasonInYear === 2 || seasonInYear === 3)) {
    return 1.0 + baseVolatility; // Wheat harvest season - slight price drop
  }
  if (crop.id === 'onion' && seasonInYear === 1) {
    return 1.0 - baseVolatility * 2; // Onion glut season
  }
  if (crop.id === 'tomato' && seasonInYear === 4) {
    return 1.0 + baseVolatility * 1.5; // Off-season tomato
  }
  
  return 1.0;
};

/**
 * Simulate random demand shocks (festivals, exports, etc.)
 */
const getDemandShock = (cropId: string, season: number): number => {
  // 10% chance of demand shock
  if (Math.random() > 0.1) return 1.0;
  
  const shocks: Record<string, number> = {
    'cotton': season % 3 === 0 ? 1.15 : 1.0, // Export boom every 3 seasons
    'wheat': season % 2 === 0 ? 1.1 : 1.0,   // Government procurement
    'onion': season % 4 === 0 ? 1.25 : 1.0,  // Festival demand
    'tomato': 1.0,
    'soybean': season % 3 === 1 ? 1.12 : 1.0 // International demand
  };
  
  return shocks[cropId] || 1.0;
};

/**
 * Get price history for a crop
 */
export const getPriceHistory = (cropId: string): number[] => {
  return marketState.priceHistory[cropId] || [];
};

/**
 * Get average price over last N seasons
 */
export const getAveragePrice = (cropId: string, seasons: number = 3): number => {
  const history = getPriceHistory(cropId).slice(-seasons);
  if (history.length === 0) return 0;
  return history.reduce((a, b) => a + b, 0) / history.length;
};

/**
 * Reset market state for new game
 */
export const resetMarket = () => {
  marketState = createMarketState();
};

/**
 * Get market insights and tips for player
 */
export const getMarketInsights = (cropId: string): string => {
  const history = getPriceHistory(cropId);
  if (history.length < 2) return "New crop - no historical data";
  
  const recent = history.slice(-3);
  const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const current = history[history.length - 1];
  
  if (current > avg * 1.1) {
    return "📈 Prices trending up! Consider selling soon.";
  } else if (current < avg * 0.9) {
    return "📉 Prices below average. Consider storage if possible.";
  } else {
    return "➡️ Prices stable. Normal market conditions.";
  }
};
