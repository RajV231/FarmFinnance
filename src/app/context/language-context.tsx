import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi';

const translations = {
  en: {
    app_title: 'KrishiNiti',
    start_btn: 'Start Simulation',
    season: 'Season',
    savings: 'Savings',
    debt: 'Debt',
    wellbeing: 'Wellbeing',
    plan_season: 'Plan Your Season',
    select_crop: 'Select Crop',
    select_loan: 'Select Credit',
    select_insurance: 'Insurance',
    confirm_plan: 'Confirm Plan',
    event_alert: 'Mid-Season Update',
    harvest_report: 'Harvest Report',
    yield: 'Yield',
    market_price: 'Market Price',
    income: 'Total Income',
    expenses: 'Expenses',
    net_profit: 'Net Profit',
    next_season: 'Next Season',
    game_over: 'Financial Collapse',
    poverty_warning: 'Warning: Debt Trap Imminent',
    evt_rain_t: 'Good Monsoon',
    evt_rain_d: 'Rainfall was adequate and timely.',
    evt_pest_t: 'Pest Attack',
    evt_pest_d: 'Locusts damaged part of the crop.',
    evt_med_t: 'Health Emergency',
    evt_med_d: 'Family member needed hospitalization.',
    evt_wed_t: 'Family Wedding',
    evt_wed_d: 'Social obligation costs incurred.',
    evt_dry_t: 'Severe Drought',
    evt_dry_d: 'Crops failed due to lack of water.',
    evt_crash_t: 'Market Crash',
    evt_crash_d: 'Global prices plummeted.',
    resilience_score: 'Resilience Score',
    continue: 'Continue',
    restart: 'Restart Simulation'
  },
  hi: {
    app_title: 'कृषि-नीति',
    start_btn: 'सिम्युलेशन शुरू करें',
    season: 'सीज़न',
    savings: 'बचत',
    debt: 'कर्ज',
    wellbeing: 'खुशहाली',
    plan_season: 'सीज़न की योजना',
    select_crop: 'फसल चुनें',
    select_loan: 'ऋण चुनें',
    select_insurance: 'बीमा',
    confirm_plan: 'योजना पक्की करें',
    event_alert: 'सीज़न अपडेट',
    harvest_report: 'फसल रिपोर्ट',
    yield: 'उपज',
    market_price: 'बाजार भाव',
    income: 'कुल आय',
    expenses: 'खर्चा',
    net_profit: 'शुद्ध लाभ',
    next_season: 'अगला सीज़न',
    game_over: 'आर्थिक संकट',
    poverty_warning: 'चेतावनी: कर्ज का जाल',
    evt_rain_t: 'अच्छा मानसून',
    evt_rain_d: 'बारिश समय पर और पर्याप्त हुई।',
    evt_pest_t: 'कीट हमला',
    evt_pest_d: 'टिड्डियों ने फसल को नुकसान पहुंचाया।',
    evt_med_t: 'स्वास्थ्य आपातकाल',
    evt_med_d: 'परिवार के सदस्य को अस्पताल ले जाना पड़ा।',
    evt_wed_t: 'परिवार में शादी',
    evt_wed_d: 'सामाजिक कार्यों में खर्च हुआ।',
    evt_dry_t: 'गंभीर सूखा',
    evt_dry_d: 'पानी की कमी से फसल बर्बाद हुई।',
    evt_crash_t: 'बाजार में गिरावट',
    evt_crash_d: 'कीमतों में भारी गिरावट आई।',
    resilience_score: 'लचीलापन स्कोर',
    continue: 'जारी रखें',
    restart: 'पुनः आरंभ करें'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['en']) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: keyof typeof translations['en']) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};