import React, { useState } from 'react';
import { useGame } from '../context/game-context';
import { TrendingUp, Shield, AlertTriangle, Droplets, Sprout, Coins, BarChart3, Zap } from 'lucide-react';
import clsx from 'clsx';

interface RiskCategory {
  type: string;
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  mitigation: string;
  icon: React.ReactNode;
}

export const RiskMeterDashboard = () => {
  const { state } = useGame();

  // Calculate risk exposure across different categories
  const calculateRisks = (): RiskCategory[] => {
    const risks: RiskCategory[] = [];

    // Weather Risk
    let weatherRiskLevel: RiskCategory['level'] = 'MEDIUM';
    if (!state.currentInsurance || state.currentInsurance.id === 'none') {
      weatherRiskLevel = 'HIGH';
    } else if (state.totalAcres < 2) {
      weatherRiskLevel = 'LOW';
    }
    
    risks.push({
      type: 'Weather Risk',
      level: weatherRiskLevel,
      description: 'Exposure to droughts, floods, and unseasonal rains',
      mitigation: 'Buy crop insurance, invest in irrigation',
      icon: <Droplets className="w-5 h-5" />
    });

    // Market Risk
    let marketRiskLevel: RiskCategory['level'] = 'MEDIUM';
    if (state.savings < 10000) {
      marketRiskLevel = 'HIGH';
    } else if (state.savings > 50000) {
      marketRiskLevel = 'LOW';
    }
    
    risks.push({
      type: 'Market Risk',
      level: marketRiskLevel,
      description: 'Price volatility affecting crop sales',
      mitigation: 'Diversify crops, use forward contracts',
      icon: <TrendingUp className="w-5 h-5" />
    });

    // Credit Risk
    let creditRiskLevel: RiskCategory['level'] = 'LOW';
    const goldValue = state.bankBalance.goldGrams * 6000; // Approximate gold value per gram
    const debtToAssetRatio = state.debt / (state.savings + goldValue);
    if (debtToAssetRatio > 0.7) {
      creditRiskLevel = 'CRITICAL';
    } else if (debtToAssetRatio > 0.4) {
      creditRiskLevel = 'HIGH';
    } else if (debtToAssetRatio > 0.2) {
      creditRiskLevel = 'MEDIUM';
    }
    
    risks.push({
      type: 'Credit Risk',
      level: creditRiskLevel,
      description: 'Loan repayment burden and interest costs',
      mitigation: 'Reduce debt, improve credit score',
      icon: <Coins className="w-5 h-5" />
    });

    // Crop Diversification Risk
    let diversificationRisk: RiskCategory['level'] = 'MEDIUM';
    // This would need actual crop allocation data from season planning
    if (state.farmType === 'MIXED') {
      diversificationRisk = 'LOW';
    }
    
    risks.push({
      type: 'Diversification Risk',
      level: diversificationRisk,
      description: 'Dependency on single crop income',
      mitigation: 'Plant multiple crops across seasons',
      icon: <Sprout className="w-5 h-5" />
    });

    return risks;
  };

  const risks = calculateRisks();

  const getRiskColor = (level: string) => {
    switch(level) {
      case 'LOW': return 'bg-green-100 text-green-700 border-green-300';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'HIGH': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'CRITICAL': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getRiskWidth = (level: string) => {
    switch(level) {
      case 'LOW': return '25%';
      case 'MEDIUM': return '50%';
      case 'HIGH': return '75%';
      case 'CRITICAL': return '100%';
      default: return '50%';
    }
  };

  const overallRiskScore = risks.reduce((acc, risk) => {
    const scores = { LOW: 1, MEDIUM: 2, HIGH: 3, CRITICAL: 4 };
    return acc + scores[risk.level];
  }, 0) / risks.length;

  const getOverallRiskLabel = (score: number) => {
    if (score <= 1.5) return 'LOW';
    if (score <= 2.5) return 'MEDIUM';
    if (score <= 3.5) return 'HIGH';
    return 'CRITICAL';
  };

  const overallRiskLevel = getOverallRiskLabel(overallRiskScore);

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-600" />
          Risk Exposure Dashboard
        </h3>
        <span className={clsx(
          "px-3 py-1 rounded-full text-xs font-bold",
          getRiskColor(overallRiskLevel)
        )}>
          Overall: {overallRiskLevel}
        </span>
      </div>

      {/* Overall Risk Meter */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Total Risk Exposure</span>
          <span className="text-sm font-bold text-gray-900">{Math.round(overallRiskScore * 25)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div 
            className={clsx("h-4 rounded-full transition-all duration-500", 
              overallRiskLevel === 'LOW' ? 'bg-green-500' :
              overallRiskLevel === 'MEDIUM' ? 'bg-yellow-500' :
              overallRiskLevel === 'HIGH' ? 'bg-orange-500' : 'bg-red-500'
            )}
            style={{ width: `${Math.min(overallRiskScore * 25, 100)}%` }}
          />
        </div>
      </div>

      {/* Individual Risk Categories */}
      <div className="space-y-3">
        {risks.map((risk, index) => (
          <div 
            key={index}
            className={clsx(
              "border-l-4 p-3 rounded-r-lg",
              getRiskColor(risk.level)
            )}
          >
            <div className="flex items-start gap-3">
              <div className={clsx("p-2 rounded-lg bg-white bg-opacity-50")}>
                {risk.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-sm">{risk.type}</h4>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-white bg-opacity-50">
                    {risk.level}
                  </span>
                </div>
                <p className="text-xs opacity-80 mb-2">{risk.description}</p>
                <div className="flex items-center gap-2 text-xs">
                  <Zap className="w-3 h-3" />
                  <span className="font-medium">{risk.mitigation}</span>
                </div>
                {/* Risk Bar */}
                <div className="mt-2 w-full bg-white bg-opacity-50 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-2 rounded-full transition-all duration-500 bg-current opacity-70"
                    style={{ width: getRiskWidth(risk.level) }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Risk Management Tips */}
      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-800 mb-1">Multi-Layer Risk Strategy</p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• <strong>Avoid:</strong> Diversify crops to reduce single-point failures</li>
              <li>• <strong>Reduce:</strong> Invest in irrigation and quality inputs</li>
              <li>• <strong>Transfer:</strong> Use insurance and cooperative pooling</li>
              <li>• <strong>Accept:</strong> Maintain emergency savings (gold, cash)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
