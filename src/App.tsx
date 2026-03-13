import React from 'react';
import { GameProvider, useGame, GamePhase } from './app/context/game-context';
import { LanguageProvider } from './app/context/language-context';

import { LanguageScreen } from './app/screens/language-screen';
import { FarmSetupScreen } from './app/screens/farm-setup-screen';
import { DashboardScreen } from './app/screens/dashboard-screen';
import { SeasonPlanningScreen } from './app/screens/season-planning-screen';
import { EventScreen } from './app/screens/event-screen';
import { HarvestScreen } from './app/screens/harvest-screen';
import { ResilienceScreen } from './app/screens/resilience-screen';
import { SummaryScreen } from './app/screens/summary-screen';
import { ProfileScreen } from './app/screens/profile-screen';
import { ReportsScreen } from './app/screens/reports-screen';
import { ShopScreen } from './app/screens/shop-screen';
import { GoalSelectionScreen } from './app/screens/goal-selection-screen';
import { BankScreen } from './app/screens/bank-screen';
import { GoalsScreen } from './app/screens/goals-screen';
import { AdvisorBot } from './app/components/advisor-bot';

const ScreenRouter = () => {
  const { state } = useGame();

  // FIX: Restored the original Splash Screen design
  if (state.phase === 'SPLASH') {
    return (
        <div className="h-full flex flex-col items-center justify-center bg-game-bg animate-fade-in min-h-screen">
            <div className="text-8xl mb-6">🌱</div>
            <h1 className="text-4xl md:text-6xl font-bold text-game-primary mb-4">KrishiNiti</h1>
            <p className="text-gray-500 text-xl">Farming & Finance Game</p>
        </div>
    );
  }

  const screens: Record<GamePhase, React.ReactNode> = {
    'SPLASH': null,
    'LANGUAGE': <LanguageScreen />,
    'GOAL_SELECTION': <GoalSelectionScreen />,
    'FARM_SETUP': <FarmSetupScreen />,
    'DASHBOARD': <DashboardScreen />,
    'PROFILE': <ProfileScreen />,
    'REPORTS': <ReportsScreen />,
    'SHOP': <ShopScreen />,
    'BANK': <BankScreen />,
    'GOALS': <GoalsScreen />, 
    'PLANNING': <SeasonPlanningScreen />,
    'EVENT_EARLY': <EventScreen />,
    'EVENT_MID': <EventScreen />,
    'EVENT_LATE': <EventScreen />,
    'HARVEST': <HarvestScreen />,
    'RESILIENCE': <ResilienceScreen />,
    'GAME_WIN': <SummaryScreen />,
    'GAME_LOSS': <SummaryScreen />,
    'SUMMARY': <SummaryScreen />
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-0 md:p-4">
        <div className="w-full md:max-w-4xl bg-game-bg md:bg-white md:shadow-2xl md:rounded-2xl overflow-hidden min-h-screen md:min-h-[800px] flex flex-col relative">
            {screens[state.phase] || (
                <div className="flex items-center justify-center h-full text-red-500 font-bold">
                    Unknown Phase: {state.phase}
                </div>
            )}
            
            {/* Advisor Bot - Available on Dashboard and Planning screens */}
            {(state.phase === 'DASHBOARD' || state.phase === 'PLANNING' || state.phase === 'BANK' || state.phase === 'GOALS') && (
                <AdvisorBot />
            )}
        </div>
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <GameProvider>
        <ScreenRouter />
      </GameProvider>
    </LanguageProvider>
  );
}

export default App;