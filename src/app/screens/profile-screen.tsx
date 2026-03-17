import React, { useState } from 'react';
import { useGame } from '../context/game-context';
import { useLanguage, Language } from '../context/language-context';
import { ASSETS } from '../data/game-scenarios';
import { User, Shield, Award, ArrowLeft, Coins, MapPin, RefreshCw, AlertTriangle, Globe, Info, Code, Github, Linkedin, Layout } from 'lucide-react';
import { playSFX } from '../utils/fx-engine';
import { Browser } from '@capacitor/browser';

export const ProfileScreen = () => {
  const { state, dispatch } = useGame();
  const { t, language, setLanguage } = useLanguage(); 
  const [showRestartModal, setShowRestartModal] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false); // NEW STATE

  const handleLanguageChange = (langCode: Language) => {
      if (setLanguage) {
          setLanguage(langCode);
          playSFX('success'); 
      }
  };

  const openExternalLink = async (url: string) => {
      await Browser.open({ url });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
        <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-green-700 to-emerald-800"></div>
            <div className="relative px-6 py-6 text-white">
                <div className="flex items-center gap-2 mb-6">
                    <button 
                        onClick={() => { playSFX('click'); dispatch({ type: 'GO_TO_DASHBOARD' }); }} 
                        className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl hover:bg-white/30 transition-all active:scale-95"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-semibold">{t('ui_back')}</span>
                    </button>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 text-center">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-4 ring-4 ring-white/30">
                        <User className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-1">{t('profile_farmer')}</h3>
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl mt-2">
                        <MapPin className="w-4 h-4" />
                        <span className="font-semibold">{state.totalAcres} {t('ui_acres')} • {t(state.farmType === 'MIXED' ? 'type_mixed' : state.farmType === 'CROPS' ? 'type_crop' : 'type_veg')}</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="relative z-10 px-4 -mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-4 text-white">
                        <div className="flex items-center gap-2 mb-1">
                            <Shield className="w-5 h-5" />
                            <span className="text-xs font-bold uppercase tracking-wider">{t('profile_resilience')}</span>
                        </div>
                        <div className="text-4xl font-bold font-mono">{state.resilienceScore}</div>
                    </div>
                </div>
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-4 text-white">
                        <div className="flex items-center gap-2 mb-1">
                            <Award className="w-5 h-5" />
                            <span className="text-xs font-bold uppercase tracking-wider">{t('credit_score')}</span>
                        </div>
                        <div className="text-4xl font-bold font-mono">{state.creditScore}</div>
                    </div>
                </div>
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-4 text-white">
                        <div className="flex items-center gap-2 mb-1">
                            <Coins className="w-5 h-5" />
                            <span className="text-xs font-bold uppercase tracking-wider">{t('header_savings')}</span>
                        </div>
                        <div className="text-2xl font-bold font-mono">₹{state.savings.toLocaleString()}</div>
                    </div>
                </div>
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className={`p-4 text-white ${state.debt > 0 ? 'bg-gradient-to-br from-red-600 to-pink-600' : 'bg-gradient-to-br from-green-600 to-emerald-600'}`}>
                        <div className="flex items-center gap-2 mb-1">
                            <Coins className="w-5 h-5" />
                            <span className="text-xs font-bold uppercase tracking-wider">{t('header_debt')}</span>
                        </div>
                        <div className="text-2xl font-bold font-mono">{state.debt > 0 ? `₹${state.debt.toLocaleString()}` : t('ui_free')}</div>
                    </div>
                </div>
            </div>
            
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center"><Globe className="w-4 h-4 text-blue-600" /></div>
                    {t('prof_lang')}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                    <LangButton code="en" label="English" current={language} onClick={handleLanguageChange} />
                    <LangButton code="hi" label="हिन्दी" current={language} onClick={handleLanguageChange} />
                    <LangButton code="mr" label="मराठी" current={language} onClick={handleLanguageChange} />
                    <LangButton code="te" label="తెలుగు" current={language} onClick={handleLanguageChange} />
                    <LangButton code="ta" label="தமிழ்" current={language} onClick={handleLanguageChange} />
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center"><Coins className="w-4 h-4 text-orange-600" /></div>
                    {t('profile_owned_assets')}
                </h4>
                {state.ownedAssets.length === 0 ? (
                    <div className="text-center py-8"><p className="text-gray-400 italic">{t('profile_no_assets')}</p></div>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {state.ownedAssets.map(assetId => {
                            const assetData = ASSETS.find(a => a.id === assetId);
                            return <div key={assetId} className="bg-gradient-to-br from-green-50 to-emerald-50 px-4 py-2 rounded-xl font-bold text-green-700 shadow-sm border border-green-200 text-sm">{t(assetData ? assetData.nameKey : assetId)}</div>;
                        })}
                    </div>
                )}
            </div>

            {/* BUTTONS SECTION */}
            <div className="mt-8 pb-4 space-y-3">
                <button 
                    onClick={() => { playSFX('click'); setShowCreditsModal(true); }} 
                    className="w-full bg-white border-2 border-gray-200 text-gray-700 py-4 rounded-2xl font-bold shadow-sm hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    <Info className="w-5 h-5 text-blue-500" /> {t('ui_about_dev')}
                </button>
                
                <button 
                    onClick={() => { playSFX('click'); setShowRestartModal(true); }} 
                    className="w-full bg-white border-2 border-red-200 text-red-600 py-4 rounded-2xl font-bold shadow-sm hover:bg-red-50 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    <RefreshCw className="w-5 h-5" />{t('ui_restart_game')}
                </button>
            </div>
        </div>

        {showRestartModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 animate-scale-in">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4"><AlertTriangle className="w-8 h-8" /></div>
                    <h3 className="text-xl font-bold text-center text-gray-900 mb-2">{t('prof_restart_q')}</h3>
                    <p className="text-center text-gray-600 mb-6 text-sm">{t('prof_restart_desc')}</p>
                    <div className="flex gap-3">
                        <button onClick={() => { playSFX('click'); setShowRestartModal(false); }} className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all">{t('ui_cancel')}</button>
                        <button onClick={() => { setShowRestartModal(false); dispatch({ type: 'RESET_GAME' }); }} className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 active:scale-95 transition-all shadow-lg">{t('ui_restart')}</button>
                    </div>
                </div>
            </div>
        )}

        {/* CREDITS / ABOUT MODAL */}
        {showCreditsModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden animate-scale-in relative">
                   {/* Subtle Background Glow */}
                   <div className="absolute -right-6 -top-6 w-32 h-32 bg-green-50 rounded-full blur-3xl"></div>

                   <div className="p-6 relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0">
                                <Code className="w-8 h-8" />
                            </div>
                            <div>
                                <h4 className="text-xl font-extrabold text-gray-900">{t('dev_title')}</h4>
                                <p className="text-sm text-gray-500 font-medium">{t('dev_subtitle')}</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {t('dev_desc')}
                            </p>
                        </div>

                        {/* Link Buttons using Capacitor Browser */}
                        <div className="flex flex-col gap-3 mb-6">
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => openExternalLink('https://github.com/RajV231')} 
                                    className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all active:scale-95"
                                >
                                    <Github className="w-4 h-4" /> GitHub
                                </button>
                                <button 
                                    onClick={() => openExternalLink('https://www.linkedin.com/in/rajvardhan-wakharade-259403331/')} 
                                    className="flex-1 flex items-center justify-center gap-2 bg-[#0A66C2] text-white py-3 rounded-xl text-sm font-bold hover:bg-[#004182] transition-all active:scale-95"
                                >
                                    <Linkedin className="w-4 h-4" /> LinkedIn
                                </button>
                            </div>
                            <button 
                                onClick={() => openExternalLink('https://rajvardhan.gt.tc/?i=1')} 
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white py-3 rounded-xl text-sm font-bold hover:from-teal-600 hover:to-emerald-700 transition-all active:scale-95 shadow-sm"
                            >
                                <Layout className="w-4 h-4" /> {t('dev_portfolio')}
                            </button>
                        </div>

                        <button onClick={() => { playSFX('click'); setShowCreditsModal(false); }} className="w-full py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all">
                            {t('ui_close')}
                        </button>
                   </div>
                </div>
            </div>
        )}
    </div>
  );
};

const LangButton = ({ code, label, current, onClick }: any) => {
    const isSelected = current === code;
    return (
        <button onClick={() => onClick(code)} className={`p-3 rounded-2xl border-2 font-bold transition-all active:scale-95 ${isSelected ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'}`}>{label}</button>
    );
};