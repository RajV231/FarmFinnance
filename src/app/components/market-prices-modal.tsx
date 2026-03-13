import React, { useState } from 'react';
import { useGame } from '../context/game-context';
import { X, TrendingUp, TrendingDown, Minus, Info, Sprout, MapPin, Truck } from 'lucide-react';
import { MarketData, Crop, CROPS, MANDIS } from '../data/game-scenarios';
import { getMarketInsights, getPriceHistory, getAveragePrice } from '../engine/market-engine';
import clsx from 'clsx';

interface MarketPricesModalProps {
  onClose: () => void;
}

interface MandiPrice {
  mandiId: string;
  mandiName: string;
  distance: number;
  baseDiscount: number;
  currentPrice: number;
  transportCost: number;
  netPrice: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
  priceChange: number;
}

export const MarketPricesModal: React.FC<MarketPricesModalProps> = ({ onClose }) => {
  const { state } = useGame();
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [selectedMandi, setSelectedMandi] = useState<string>('district_mandi');

  // Use current season's market prices or generate fallback
  const marketPrices: MarketData[] = state.marketPrices.length > 0 
    ? state.marketPrices 
    : [];

  // Calculate mandi-specific prices for selected crop
  const getMandiPrices = (cropId: string): MandiPrice[] => {
    const basePriceData = marketPrices.find(p => p.cropId === cropId);
    if (!basePriceData) return [];

    return MANDIS.map(mandi => {
      const currentPrice = basePriceData.currentPrice * mandi.baseDiscount;
      const transportCost = mandi.distance * 2; // ₹2 per km round trip
      const netPrice = currentPrice - transportCost;
      
      return {
        mandiId: mandi.id,
        mandiName: mandi.name,
        distance: mandi.distance,
        baseDiscount: mandi.baseDiscount,
        currentPrice,
        transportCost,
        netPrice,
        trend: basePriceData.trend,
        priceChange: basePriceData.priceChange
      };
    });
  };

  const getCropDetails = (cropId: string) => {
    return CROPS.find(c => c.id === cropId) || null;
  };

  const getTrendIcon = (trend: 'UP' | 'DOWN' | 'STABLE') => {
    switch(trend) {
      case 'UP': return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'DOWN': return <TrendingDown className="w-5 h-5 text-red-600" />;
      default: return <Minus className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTrendColor = (trend: 'UP' | 'DOWN' | 'STABLE') => {
    switch(trend) {
      case 'UP': return 'text-green-600 bg-green-50';
      case 'DOWN': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Mandi Market Prices</h2>
              <p className="text-blue-100 text-sm mt-1">Season {state.seasonNumber} - Live Rates</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Market Summary Card */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-yellow-800 text-sm mb-1">Market Insights</h4>
                <p className="text-xs text-yellow-700 leading-relaxed">
                  Prices fluctuate based on supply-demand, weather conditions, and seasonal patterns. 
                  Watch trends to maximize your profits!
                </p>
              </div>
            </div>
          </div>

          {/* Price Table */}
          <div className="space-y-3 mb-6">
            <h3 className="font-bold text-gray-700 text-lg">Current Crop Prices</h3>
            
            {marketPrices.length > 0 ? (
              marketPrices.map((priceData) => {
                const crop = getCropDetails(priceData.cropId);
                if (!crop) return null;

                return (
                  <div
                    key={priceData.cropId}
                    onClick={() => setSelectedCrop(selectedCrop?.id === priceData.cropId ? null : crop)}
                    className={`border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedCrop?.id === priceData.cropId 
                        ? 'border-game-primary bg-green-50 ring-2 ring-game-primary/20' 
                        : 'border-gray-200 hover:border-game-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Sprout className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800">{crop.name}</h4>
                          <p className="text-xs text-gray-500">{priceData.mandiName}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-800">
                          {formatCurrency(priceData.currentPrice)}
                          <span className="text-xs text-gray-500 font-normal">/unit</span>
                        </div>
                        <div className={`flex items-center justify-end gap-1 text-sm font-medium ${getTrendColor(priceData.trend)}`}>
                          {getTrendIcon(priceData.trend)}
                          <span>{priceData.priceChange > 0 ? '+' : ''}{priceData.priceChange}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details with Multi-Mandi Comparison */}
                    {selectedCrop?.id === priceData.cropId && (
                      <div className="mt-4 pt-4 border-t border-gray-200 animate-fade-in">
                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                          <div>
                            <span className="text-gray-500 block text-xs">Base Price</span>
                            <span className="font-semibold">{formatCurrency(priceData.basePrice)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 block text-xs">Avg (Last 3 Seasons)</span>
                            <span className="font-semibold">
                              {formatCurrency(Math.round(getAveragePrice(priceData.cropId, 3)))}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 block text-xs">Your Expected Yield</span>
                            <span className="font-semibold">
                              {Math.round(crop.minYield * state.totalAcres * 0.8)} - {Math.round(crop.maxYield * state.totalAcres)} units
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500 block text-xs">Est. Revenue</span>
                            <span className="font-semibold text-green-600">
                              {formatCurrency(Math.round(priceData.currentPrice * crop.minYield * state.totalAcres * 0.8))} - 
                              {formatCurrency(Math.round(priceData.currentPrice * crop.maxYield * state.totalAcres))}
                            </span>
                          </div>
                        </div>
                        
                        {/* Market Insight */}
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-xs text-blue-700 font-medium">
                            💡 {getMarketInsights(priceData.cropId)}
                          </p>
                        </div>

                        {/* Multi-Mandi Price Comparison */}
                        <div className="mt-4">
                          <h4 className="font-bold text-sm text-gray-700 mb-3 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Compare Prices Across Mandis
                          </h4>
                          <div className="space-y-2">
                            {getMandiPrices(priceData.cropId).map((mandiPrice) => (
                              <button
                                key={mandiPrice.mandiId}
                                onClick={() => setSelectedMandi(mandiPrice.mandiId)}
                                className={clsx(
                                  "w-full p-3 rounded-lg border transition-all hover:shadow-md",
                                  selectedMandi === mandiPrice.mandiId
                                    ? "border-game-primary bg-green-50 ring-2 ring-game-primary/20"
                                    : "border-gray-200 hover:border-game-primary/50"
                                )}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className={clsx("p-2 rounded-lg", 
                                      mandiPrice.netPrice >= priceData.currentPrice 
                                        ? "bg-green-100 text-green-700" 
                                        : "bg-orange-100 text-orange-700"
                                    )}>
                                      <MapPin className="w-4 h-4" />
                                    </div>
                                    <div className="text-left">
                                      <div className="font-bold text-sm text-gray-800">{mandiPrice.mandiName}</div>
                                      <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                          <Truck className="w-3 h-3" />
                                          {mandiPrice.distance} km
                                        </span>
                                        <span>•</span>
                                        <span className={mandiPrice.transportCost > 50 ? "text-red-600" : "text-gray-500"}>
                                          Transport: ₹{mandiPrice.transportCost}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-lg font-bold text-gray-800">
                                      {formatCurrency(Math.round(mandiPrice.currentPrice))}
                                    </div>
                                    <div className={clsx("text-xs font-bold", 
                                      mandiPrice.netPrice >= priceData.currentPrice 
                                        ? "text-green-600" 
                                        : "text-orange-600"
                                    )}>
                                      Net: {formatCurrency(Math.round(mandiPrice.netPrice))}
                                    </div>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                          
                          {/* Best Mandi Recommendation */}
                          {(() => {
                            const mandiPrices = getMandiPrices(priceData.cropId);
                            const bestMandi = mandiPrices.reduce((best, current) => 
                              current.netPrice > best.netPrice ? current : best
                            );
                            return (
                              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-start gap-2">
                                  <TrendingUp className="w-4 h-4 text-green-600 mt-0.5" />
                                  <div>
                                    <p className="text-xs font-bold text-green-800">
                                      Best Option: {bestMandi.mandiName}
                                    </p>
                                    <p className="text-xs text-green-700">
                                      You'll earn {formatCurrency(Math.round(bestMandi.netPrice - priceData.currentPrice))} more per unit after transport costs!
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No market data available yet.</p>
                <p className="text-sm mt-2">Start a new season to see live prices!</p>
              </div>
            )}
          </div>

          {/* Tips Section */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-bold text-gray-700 text-sm mb-3">💰 Smart Selling Tips</h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">•</span>
                <span>Sell when prices are trending UP (green arrow) for maximum profit</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 font-bold">•</span>
                <span>Consider storage if prices are DOWN - wait for better rates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span>Different mandis may offer different prices - compare before selling</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hook to manage market modal
export const useMarketModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return {
    isOpen,
    openModal,
    closeModal
  };
};
