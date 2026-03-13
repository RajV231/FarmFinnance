import React from 'react';
import { useGame } from '../context/game-context';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList } from 'recharts';
import { TrendingUp, TrendingDown, Coins, Sprout, AlertTriangle, CheckCircle } from 'lucide-react';
import clsx from 'clsx';

interface CropAllocation {
  cropId: string;
  cropName: string;
  acres: number;
  percentage: number;
  expectedCost: number;
  expectedRevenue: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export const CropDiversificationPanel = () => {
  const { state } = useGame();
  
  // This component will be used in season planning to show diversification benefits
  const allocations: CropAllocation[] = [];
  
  if (!allocations.length) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Crop Diversification Benefits
        </h3>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <span>Plant multiple crops to reduce risk and stabilize income</span>
        </div>
      </div>
    );
  }

  const data = allocations.map(alloc => ({
    name: alloc.cropName,
    acres: alloc.acres,
    percentage: alloc.percentage,
    risk: alloc.riskLevel
  }));

  const COLORS = ['#22c55e', '#eab308', '#ef4444', '#3b82f6', '#a855f7'];

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Crop Portfolio Distribution
      </h3>
      
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="acres"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {allocations.map((alloc, idx) => (
          <div 
            key={alloc.cropId}
            className={clsx(
              "p-2 rounded-lg border",
              alloc.riskLevel === 'LOW' ? "border-green-200 bg-green-50" :
              alloc.riskLevel === 'MEDIUM' ? "border-yellow-200 bg-yellow-50" :
              "border-red-200 bg-red-50"
            )}
          >
            <div className="font-bold text-xs">{alloc.cropName}</div>
            <div className="text-[10px] text-gray-600">{alloc.acres.toFixed(1)} acres ({alloc.percentage.toFixed(0)}%)</div>
            <div className="text-[10px] text-gray-500">Risk: {alloc.riskLevel}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface FinancialInsightCardProps {
  title: string;
  value: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  insight?: string;
}

export const FinancialInsightCard: React.FC<FinancialInsightCardProps> = ({
  title,
  value,
  trend = 'neutral',
  icon,
  insight
}) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <div className="flex items-start justify-between mb-2">
        <div className="text-gray-500 text-xs font-medium uppercase">{title}</div>
        <div className={clsx(
          "p-2 rounded-full",
          trend === 'up' ? "bg-green-100 text-green-600" :
          trend === 'down' ? "bg-red-100 text-red-600" :
          "bg-gray-100 text-gray-600"
        )}>
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-800 mb-1">{value}</div>
      {insight && (
        <div className="text-xs text-gray-500 flex items-center gap-1">
          {trend === 'up' && <TrendingUp className="w-3 h-3 text-green-600" />}
          {trend === 'down' && <TrendingDown className="w-3 h-3 text-red-600" />}
          {insight}
        </div>
      )}
    </div>
  );
};

export const IncomeExpenseChart = () => {
  const { state } = useGame();
  
  const data = state.history.slice(-5).map(h => ({
    season: `S${h.season}`,
    income: Math.round(h.income / 1000),
    profit: Math.round((h.income - (h.expenses || 0)) / 1000)
  }));

  if (data.length === 0) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Income Trend
        </h3>
        <p className="text-sm text-gray-500 text-center py-8">
          Complete more seasons to see your income trends
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Income & Profit Trend (Last 5 Seasons)
      </h3>
      
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="season" />
            <YAxis />
            <Tooltip 
              formatter={(value: any) => [`₹${Number(value) * 1000}`, 'Amount']}
              labelFormatter={(label: any) => `Season: ${label}`}
            />
            <Legend />
            <Bar dataKey="income" fill="#22c55e" name="Income (₹)" radius={[4, 4, 0, 0]}>
              <LabelList dataKey="income" position="top" content={({ x, y, value }: any) => (
                <text x={x} y={(y as number) - 5} textAnchor="middle" className="fill-gray-600 text-xs">₹{Number(value)}k</text>
              )} />
            </Bar>
            <Bar dataKey="profit" fill="#3b82f6" name="Profit (₹)" radius={[4, 4, 0, 0]}>
              <LabelList dataKey="profit" position="top" content={({ x, y, value }: any) => (
                <text x={x} y={(y as number) - 5} textAnchor="middle" className="fill-gray-600 text-xs">₹{Number(value)}k</text>
              )} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Alias for IncomeTrendChart
export const IncomeTrendChart = IncomeExpenseChart;

export const RiskExposureMeter = () => {
  const { state } = useGame();
  
  const riskFactors = [
    { name: 'Weather Risk', level: state.currentCrop?.riskFactor || 0.5, color: 'orange' },
    { name: 'Market Risk', level: 0.4, color: 'yellow' },
    { name: 'Credit Risk', level: state.debt > 50000 ? 0.8 : state.debt > 20000 ? 0.5 : 0.2, color: 'red' },
    { name: 'Overall Resilience', level: state.resilienceScore / 100, color: 'green' }
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4" />
        Risk Exposure Dashboard
      </h3>
      
      <div className="space-y-3">
        {riskFactors.map((factor) => (
          <div key={factor.name}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">{factor.name}</span>
              <span className={clsx(
                "font-bold",
                factor.level > 0.7 ? "text-red-600" :
                factor.level > 0.4 ? "text-yellow-600" :
                "text-green-600"
              )}>
                {(factor.level * 100).toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={clsx(
                  "h-2 rounded-full transition-all",
                  factor.color === 'red' ? "bg-red-500" :
                  factor.color === 'orange' ? "bg-orange-500" :
                  factor.color === 'yellow' ? "bg-yellow-500" :
                  "bg-green-500"
                )}
                style={{ width: `${Math.min(100, factor.level * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2 text-xs">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-gray-600">
            Tip: Diversify crops and maintain emergency savings to reduce risk
          </span>
        </div>
      </div>
    </div>
  );
};
