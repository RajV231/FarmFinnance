# KrishiNiti 🌾 | NCFE-Innovate4FinLit Challenge

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Capacitor](https://img.shields.io/badge/Capacitor-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)

**Track:** The Farmers  
**Developer:** Rajvardhan V Wakharade

---

## 🎯 The Problem & Our Solution
Farmers face complex financial literacy challenges: managing irregular seasonal incomes, coping with climate uncertainty, lacking savings discipline, and relying on informal credit. 

**KrishiNiti** is a hybrid mobile financial simulation game designed to build real-world financial capability. By simulating a 10-season agricultural cycle, players develop critical budgeting skills, savings discipline, credit awareness, and risk management behaviors.

## 🌱 How KrishiNiti Solves the Problem:
* **Managing Irregular Incomes:** The 10-season loop forces players to budget massive upfront planting costs and survive until the lump-sum harvest payout.
* **Coping with Uncertainty:** A dynamic event engine (droughts, pests) teaches risk protection. Players learn that buying Crop Insurance (PMFBY) or investing in assets (Solar Pumps) mitigates financial shocks.
* **Savings Discipline:** Replaces reliance on cash by introducing a virtual Bank with Fixed Deposits (FDs), Gold investments, and a "Financial Goals" tracker.
* **Responsible Use of Credit:** Introduces a live, gamified **Credit Score (300-900)**. Players learn the difference between structured Land EMIs and high-interest crop loans, and face consequences for defaulting.
* **Building Stability:** Success isn't just measured in cash, but via a quantifiable **Resilience Score** evaluating savings discipline, risk preparedness, and debt stability.

---

## ✨ Core Features

### 🌍 Accessibility & Localization
* **Multilingual UI:** Fully playable in English, Hindi, Marathi, Telugu, and Tamil.
* **Native Text-to-Speech (TTS):** Integrated Capacitor native TTS engine allows farmers with lower literacy to listen to events and advisory tips via an ever-present speaker button.

### 🎮 Gameplay Mechanics
* **Dynamic Economy:** Crop prices fluctuate, and yields vary based on weather, player wellbeing, and market choices (Local Mandi vs. e-NAM).
* **Asset Management:** Purchase equipment to lower operating costs, or take out a mortgage to expand land acreage.
* **Real Government Schemes:** Players can apply for real-world subsidies including PM-KISAN, PMFBY, MISS, Soil Health Card, and PM-KUSUM.
* **Real-time Farm Visualizer:** A dynamic graphical display showing the current visual condition of the field.
* **Comprehensive Ledger:** A detailed Passbook tracking every rupee earned and spent, alongside a historical Harvest Report.

---

## 🛠 Tech Stack

Built as a Progressive Web App (PWA) and compiled into a native Android application.

* **Frontend:** React 18, TypeScript, Vite
* **Styling:** Tailwind CSS, Lucide React Icons
* **Mobile Deployment:** Ionic Capacitor (`@capacitor/android`)
* **Hardware Integrations:** `@capacitor-community/text-to-speech`, Capacitor App Plugin (Hardware Back-Button routing)
* **PWA Support:** Vite Plugin PWA

---

## 📂 Project Architecture

A clean, modular React architecture separated into UI, Game Logic, and Data.

```text
krishiniti/
├── android/                # Native Android Capacitor source code
├── public/                 # Static assets, PWA icons, & manifests
├── src/
│   ├── app/
│   │   ├── components/     # Reusable UI (AdvisorBot, FarmVisualizer, TTS Button)
│   │   ├── context/        # Global State (GameReducer, LanguageContext)
│   │   ├── data/           # Static game scenarios, crop data, events
│   │   ├── engine/         # Core logic (Education, Events, Market engines)
│   │   ├── hooks/          # Custom hooks (e.g., Native TTS fallback hook)
│   │   ├── screens/        # Main game views (Dashboard, Bank, Harvest, etc.)
│   │   └── utils/          # Audio FX engine, Storage, Financial Calculations
│   ├── App.tsx             # Main Router & Native Hardware Back-button handler
│   └── main.tsx            # React entry point
├── capacitor.config.ts     # Mobile deployment & plugin config
├── tailwind.config.ts      # UI styling system
└── vite.config.ts          # Build tool & PWA config
```

---


## 🚀 Installation & Local Development

Make sure you have [Node.js](https://nodejs.org/) installed on your machine. For Android deployment, you will need [Android Studio](https://developer.android.com/studio).

### 1. Web Development Server
```bash
# Clone the repository
git clone [your-repo-link]
cd krishiniti

# Install dependencies
npm install

# Start the local development server
npm run dev
```
The app will be available at `http://localhost:5173`.

### 2. Building for Production
```bash
# Compile TypeScript and build for production
npm run build
```

### 3. Android Native Deployment
This project uses Capacitor to bridge the React web app to native Android.
```bash
# 1. Ensure you have a fresh web build
npm run build

# 2. Sync the web assets and plugins to the Android folder
npx cap sync android

# 3. Open Android Studio to compile the final .apk
npx cap open android
```

---

## 📜 License & Credits

This project was developed exclusively for the **NCFE-Innovate4FinLit Challenge**. 

Built with ❤️ by **Rajvardhan V. Wakharade** for financial empowerment and rural resilience.

***