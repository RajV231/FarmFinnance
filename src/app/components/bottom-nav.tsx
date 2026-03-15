import React from 'react';
import { useGame } from '../context/game-context';
import { Home, Landmark, ShieldCheck, ShoppingBag, BarChart2 } from 'lucide-react';
import { useLanguage } from '../context/language-context';

export const BottomNav = () => {
    const { state, dispatch } = useGame();
    const { t } = useLanguage();

    const NavItem = ({ phase, icon: Icon, label, onClick }: any) => {
        const isActive = state.phase === phase;
        return (
            <button 
                onClick={onClick} 
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all relative group ${
                  isActive ? 'text-green-700' : 'text-gray-400 hover:text-gray-600'
                }`}
            >
                {/* Active Indicator */}
                {isActive && (
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full"></div>
                )}
                
                {/* Icon Container */}
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                  isActive 
                    ? 'bg-gradient-to-br from-green-100 to-emerald-100 shadow-sm' 
                    : 'group-hover:bg-gray-100'
                }`}>
                    <Icon className={`w-6 h-6 transition-all ${isActive ? 'scale-110' : 'scale-100'}`} />
                </div>
                
                {/* Label */}
                <span className={`text-[10px] font-bold transition-all ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                    {label}
                </span>
            </button>
        );
    };

    return (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full md:max-w-4xl bg-white/80 backdrop-blur-xl border-t border-gray-200 flex justify-around items-center px-2 z-40 md:bottom-4 md:rounded-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.08)] h-20">
            <NavItem 
              phase="DASHBOARD" 
              icon={Home} 
              label={t('app_title')} 
              onClick={() => dispatch({ type: 'GO_TO_DASHBOARD' })} 
            />
            <NavItem 
              phase="BANK" 
              icon={Landmark} 
              label={t('bank')} 
              onClick={() => dispatch({ type: 'GO_TO_BANK' })} 
            />
            <NavItem 
              phase="SHOP" 
              icon={ShoppingBag} 
              label={t('shop')} 
              onClick={() => dispatch({ type: 'GO_TO_SHOP' })} 
            />
            <NavItem 
              phase="SCHEMES" 
              icon={ShieldCheck} 
              label={t('schemes')} 
              onClick={() => dispatch({ type: 'GO_TO_SCHEMES' })} 
            />
            <NavItem 
              phase="REPORTS" 
              icon={BarChart2} 
              label={t('reports')} 
              onClick={() => dispatch({ type: 'GO_TO_REPORTS' })} 
            />
        </div>
    );
};
