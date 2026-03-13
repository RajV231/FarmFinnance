import React from 'react';
import { useGame } from '../context/game-context';
import { Calendar, TrendingUp, TrendingDown, Coins, AlertCircle, Sprout, Droplets, ShoppingCart } from 'lucide-react';

interface CalendarEvent {
  season: number;
  phase: string;
  type: 'EXPENSE' | 'INCOME' | 'DEADLINE' | 'REMINDER';
  title: string;
  amount?: number;
  icon: React.ReactNode;
  color: string;
}

export const SeasonalCalendarView = () => {
  const { state } = useGame();
  
  // Generate calendar events based on current game state
  const generateCalendarEvents = (): CalendarEvent[] => {
    const events: CalendarEvent[] = [];
    const currentSeason = state.seasonNumber;
    
    // Current Season Events
    events.push({
      season: currentSeason,
      phase: 'Planning',
      type: 'REMINDER',
      title: 'Crop Planning & Loan Application',
      icon: <Sprout className="w-4 h-4" />,
      color: 'bg-blue-100 text-blue-700'
    });
    
    if (state.currentLoan) {
      events.push({
        season: currentSeason,
        phase: 'Start',
        type: 'EXPENSE',
        title: `Loan EMI - ${state.currentLoan.name}`,
        amount: Math.floor(state.currentLoanAmount * state.currentLoan.interestRate),
        icon: <Coins className="w-4 h-4" />,
        color: 'bg-red-100 text-red-700'
      });
    }
    
    if (state.currentInsurance) {
      events.push({
        season: currentSeason,
        phase: 'Start',
        type: 'EXPENSE',
        title: `Insurance Premium - ${state.currentInsurance.name}`,
        amount: state.currentInsurance.premium * state.totalAcres,
        icon: <AlertCircle className="w-4 h-4" />,
        color: 'bg-orange-100 text-orange-700'
      });
    }
    
    events.push({
      season: currentSeason,
      phase: 'Mid',
      type: 'REMINDER',
      title: 'Monitor Crop Health & Weather',
      icon: <Droplets className="w-4 h-4" />,
      color: 'bg-green-100 text-green-700'
    });
    
    events.push({
      season: currentSeason,
      phase: 'Harvest',
      type: 'INCOME',
      title: 'Expected Harvest Sales',
      amount: state.currentCrop ? 
        Math.floor(state.currentCrop.minYield * state.currentCrop.pricePerUnit * state.totalAcres * 0.7) : 0,
      icon: <TrendingUp className="w-4 h-4" />,
      color: 'bg-green-100 text-green-700'
    });
    
    events.push({
      season: currentSeason,
      phase: 'End',
      type: 'DEADLINE',
      title: 'Loan Repayment Decision',
      icon: <ShoppingCart className="w-4 h-4" />,
      color: 'bg-purple-100 text-purple-700'
    });
    
    // DBT Payment Reminder
    events.push({
      season: currentSeason,
      phase: 'End/Start',
      type: 'INCOME',
      title: 'PM-KISAN DBT Installment',
      amount: 2000,
      icon: <Coins className="w-4 h-4" />,
      color: 'bg-yellow-100 text-yellow-700'
    });
    
    // Future Season Predictions
    if (currentSeason < state.maxSeasons) {
      events.push({
        season: currentSeason + 1,
        phase: 'Planning',
        type: 'REMINDER',
        title: 'Next Season Planning',
        icon: <Calendar className="w-4 h-4" />,
        color: 'bg-gray-100 text-gray-600'
      });
    }
    
    return events;
  };
  
  const events = generateCalendarEvents();
  const groupedEvents = events.reduce((acc, event) => {
    if (!acc[event.season]) acc[event.season] = [];
    acc[event.season].push(event);
    return acc;
  }, {} as Record<number, CalendarEvent[]>);
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-game-primary" />
        <h3 className="font-bold text-lg text-gray-800">Seasonal Calendar</h3>
      </div>
      
      <div className="space-y-4">
        {Object.entries(groupedEvents).map(([season, seasonEvents]) => (
          <div key={season} className="relative">
            {/* Season Header */}
            <div className={`flex items-center gap-2 mb-3 pb-2 border-b ${
              parseInt(season) === state.seasonNumber 
                ? 'border-game-primary' 
                : 'border-gray-200'
            }`}>
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                parseInt(season) === state.seasonNumber 
                  ? 'bg-game-primary text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                Season {season}
              </div>
              {parseInt(season) === state.seasonNumber && (
                <span className="text-xs text-game-primary font-semibold">Current</span>
              )}
            </div>
            
            {/* Events Timeline */}
            <div className="space-y-2 ml-4">
              {seasonEvents.map((event, idx) => (
                <div 
                  key={idx}
                  className={`flex items-start gap-3 p-3 rounded-lg ${event.color} bg-opacity-30`}
                >
                  <div className={`p-2 rounded-full ${event.color}`}>
                    {event.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-xs font-semibold opacity-70">{event.phase}</div>
                        <div className="text-sm font-medium">{event.title}</div>
                      </div>
                      {event.amount !== undefined && (
                        <div className={`text-sm font-bold ${
                          event.type === 'INCOME' ? 'text-green-600' :
                          event.type === 'EXPENSE' ? 'text-red-600' :
                          'text-gray-700'
                        }`}>
                          {event.type === 'INCOME' ? '+' : event.type === 'EXPENSE' ? '-' : ''}
                          ₹{event.amount.toLocaleString()}
                        </div>
                      )}
                    </div>
                    <div className="mt-1">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${
                        event.type === 'INCOME' ? 'bg-green-200 text-green-800' :
                        event.type === 'EXPENSE' ? 'bg-red-200 text-red-800' :
                        event.type === 'DEADLINE' ? 'bg-purple-200 text-purple-800' :
                        'bg-blue-200 text-blue-800'
                      }`}>
                        {event.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Cash Flow Forecast Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-600 mb-3">Cash Flow Forecast</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-xs text-gray-600">Expected Income</div>
            <div className="text-lg font-bold text-green-700">
              ₹{events.filter(e => e.type === 'INCOME').reduce((sum, e) => sum + (e.amount || 0), 0).toLocaleString()}
            </div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <div className="text-xs text-gray-600">Expected Expenses</div>
            <div className="text-lg font-bold text-red-700">
              ₹{events.filter(e => e.type === 'EXPENSE').reduce((sum, e) => sum + (e.amount || 0), 0).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
