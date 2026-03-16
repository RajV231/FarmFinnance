import React from 'react';
import { GameProvider, useGame, GamePhase } from './app/context/game-context';
import { LanguageProvider, useLanguage } from './app/context/language-context'; // IMPORT HOOK

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
import { SchemesScreen } from './app/screens/schemes-screen';
import { MarketScreen } from './app/screens/market-screen';

const ScreenRouter = () => {
  const { state } = useGame();
  const { t } = useLanguage(); // NEW: Hook into dictionary

  if (state.phase === 'SPLASH') {
    return (
        <div className="h-full flex flex-col items-center justify-center bg-white animate-fade-in min-h-screen font-sans relative">
            <div className="flex flex-col items-center justify-center text-center animate-scale-in z-10">
                {/* Using the actual image file! */}
                <img 
                    src="/logo.png" 
                    alt="KrishiNiti Logo" 
                    className="w-32 h-32 object-contain mb-6 drop-shadow-md"
                    onError={(e) => {
                        // Fallback just in case the image is missing
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement?.insertAdjacentHTML('afterbegin', '<div style="font-size: 6rem; margin-bottom: 1.5rem; display: block;">🌱</div>');
                    }}
                />
                
                {/* Strict fonts prevent Android from using cursive fallbacks */}
                <h1 className="text-4xl md:text-6xl font-extrabold text-green-600 tracking-tight mb-4">
                    {t('app_title')}
                </h1>
                <p className="text-xl text-slate-500 font-medium tracking-wide">
                    {t('splash_subtitle')}
                </p>
            </div>

            {/* A subtle loading spinner at the bottom */}
            <div className="absolute bottom-12 flex flex-col items-center z-10">
                <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            </div>
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
    'SCHEMES': <SchemesScreen />,
    'MARKET': <MarketScreen />,
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
                    {t('unknown_phase')}: {state.phase}
                </div>
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