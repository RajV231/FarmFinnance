import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'mr' | 'te' | 'ta';

// The Master Dictionary for Core UI
const translations = {
    en: {
        app_title: "KrishiNiti",
        credit_score: "Credit Score",
        season: "Season",
        start_season: "Start New Season",
        goals: "Life Goals",
        bank: "Bank & Gold",
        schemes: "Govt Schemes",
        shop: "Asset Shop",
        reports: "Reports",
        profile: "My Profile",
        quit: "Quit & Restart",
        confirm_quit: "Are you sure you want to quit and start a new game?",
        advisory: "Krishi Mitra Advisory"
    },
    hi: {
        app_title: "कृषि-नीति",
        credit_score: "क्रेडिट स्कोर",
        season: "मौसम",
        start_season: "नया मौसम शुरू करें",
        goals: "जीवन के लक्ष्य",
        bank: "बैंक और सोना",
        schemes: "सरकारी योजनाएं",
        shop: "दुकान (संपत्ति)",
        reports: "रिपोर्ट्स",
        profile: "मेरी प्रोफ़ाइल",
        quit: "छोड़ें और रीस्टार्ट करें",
        confirm_quit: "क्या आप वाकई छोड़ना और नया गेम शुरू करना चाहते हैं?",
        advisory: "कृषि मित्र सलाह"
    },
    mr: {
        app_title: "कृषी-नीती",
        credit_score: "क्रेडिट स्कोअर",
        season: "हंगाम",
        start_season: "नवीन हंगाम सुरू करा",
        goals: "जीवनाची उद्दिष्टे",
        bank: "बँक आणि सोने",
        schemes: "सरकारी योजना",
        shop: "दुकान",
        reports: "अहवाल",
        profile: "माझी प्रोफाइल",
        quit: "बाहेर पडा आणि रीस्टार्ट करा",
        confirm_quit: "तुम्हाला नक्की बाहेर पडून नवीन गेम सुरू करायचा आहे का?",
        advisory: "कृषी मित्र सल्ला"
    },
    te: {
        app_title: "కృషి-నీతి",
        credit_score: "క్రెడిట్ స్కోర్",
        season: "సీజన్",
        start_season: "కొత్త సీజన్ ప్రారంభించండి",
        goals: "జీవిత లక్ష్యాలు",
        bank: "బ్యాంక్ & బంగారం",
        schemes: "ప్రభుత్వ పథకాలు",
        shop: "ఆస్తి దుకాణం",
        reports: "నివేదికలు",
        profile: "నా ప్రొఫైల్",
        quit: "నిష్క్రమించి పునఃప్రారంభించండి",
        confirm_quit: "మీరు ఖచ్చితంగా నిష్క్రమించి కొత్త ఆటను ప్రారంభించాలనుకుంటున్నారా?",
        advisory: "కృషి మిత్ర సలహా"
    },
    ta: {
        app_title: "கிருஷி-நீதி",
        credit_score: "கடன் மதிப்பெண்",
        season: "பருவம்",
        start_season: "புதிய பருவத்தை தொடங்கு",
        goals: "வாழ்க்கை இலக்குகள்",
        bank: "வங்கி & தங்கம்",
        schemes: "அரசு திட்டங்கள்",
        shop: "சொத்து கடை",
        reports: "அறிக்கைகள்",
        profile: "என் சுயவிவரம்",
        quit: "வெளியேறு & மீண்டும் தொடங்கு",
        confirm_quit: "நிச்சயமாக வெளியேறி புதிய விளையாட்டை தொடங்க வேண்டுமா?",
        advisory: "கிருஷி மித்ரா ஆலோசனை"
    }
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: keyof typeof translations['en']) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    // Load saved language or default to English
    const [language, setLanguageState] = useState<Language>('en');

    useEffect(() => {
        const savedLang = localStorage.getItem('krishiniti_lang') as Language;
        if (savedLang && translations[savedLang]) {
            setLanguageState(savedLang);
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('krishiniti_lang', lang);
    };

    // The translation function
    const t = (key: keyof typeof translations['en']): string => {
        return translations[language][key] || translations['en'][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error("useLanguage must be used within LanguageProvider");
    return context;
};