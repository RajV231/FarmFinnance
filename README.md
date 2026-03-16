# KrishiNiti Simulator 🌱

An interactive agricultural farming simulation game built with React, TypeScript, and Vite. Experience the journey of managing a farm, making strategic decisions, and learning about agricultural practices.

Built as a prototype for a financial literacy hackathon, KrishiNiti bridges the gap between theoretical knowledge and real-world behavior.

---

## 🎯 The Problem
Farmers face unique financial challenges: managing seasonal cash flows, saving for lean periods, navigating informal credit traps, and lacking preparedness for environmental or market shocks. Limited familiarity with formal banking and insurance often leaves them vulnerable to debt spirals.

## 💡 Our Solution: Behavior Over Theory
KrishiNiti moves away from boring, text-heavy quizzes. Instead, it utilizes **Simulation & Decision-Based Mechanics**. Players must actively manage their farm, where every choice has meaningful in-game consequences:
* **Debt Spirals vs. Credit Scores:** Borrowing from a local moneylender provides quick cash but traps the player in high-interest debt. Using formal Bank loans (Kisan Credit Card) improves their credit score and unlocks better rates.
* **Risk Protection:** Players experience random events (droughts, pest attacks, market crashes). If they previously invested in Crop Insurance (PMFBY) or protective assets (Drip Irrigation), they mitigate the financial damage.
* **The Passbook Ledger:** Every action is recorded in a realistic transaction history, teaching cash-flow management visually.

---

## 🏆 Hackathon Alignment (Functional Constraints)

### 1. The Rule of Three (Financial Themes Integrated)
KrishiNiti heavily integrates more than three core financial themes:
- **Savings & Investments:** Players manage liquid savings and can lock money into Fixed Deposits (FDs) or Digital Gold to hedge against inflation.
- **Insurance:** Players must decide whether to pay premiums for PMFBY to protect against weather/market shocks.
- **Fraud Prevention:** Random scenario events test the player's awareness of OTP scams and digital financial fraud.
- **Debt Management:** Teaches the danger of compound interest from informal lenders vs. responsible use of formal credit.

### 2. Rural-Ready Technology
- **Offline Capable:** Built as a Progressive Web App (PWA) and wrapped natively using Capacitor, the game runs completely offline after the initial download, requiring zero bandwidth.
- **Voice & Visuals over Text:** - **Text-to-Speech (TTS):** Critical events and quizzes feature audio readouts to support users with low literacy.
  - **Dynamic 2.5D Visualizer:** The farm visually changes based on the player's land size, asset purchases (tractors, greenhouses), and weather events, relying on visual cues rather than text.
- **Multilingual:** Fully localized in English, Hindi, Marathi, Telugu, and Tamil.

## Features

- 🌾 **Farm Management**: Set up and manage your virtual farm
- 📊 **Season Planning**: Plan your crops and resources for each season
- 🏪 **Shop System**: Purchase seeds, equipment, and supplies
- 🏦 **Banking & Loans**: Manage your finances and take loans
- 🎯 **Goals & Schemes**: Complete objectives and explore government schemes
- 📈 **Market Trading**: Sell your produce at market prices
- ⚡ **Random Events**: Handle unexpected challenges throughout the game
- 🌍 **Multi-language Support**: Play in your preferred language
- 📱 **Mobile Ready**: Built with Capacitor for Android deployment

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Mobile**: Capacitor (Android)
- **PWA**: Vite Plugin PWA

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd krishiniti-simulator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the next available port).

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot module replacement |
| `npm run build` | Build the production-ready application |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint to check code quality |

## Building for Production

Create a production build:

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Android Deployment

This project uses Capacitor for Android deployment:

1. Build the web app:
   ```bash
   npm run build
   ```

2. Sync with Capacitor:
   ```bash
   npx cap sync android
   ```

3. Open in Android Studio:
   ```bash
   npx cap open android
   ```

4. Build and deploy from Android Studio

## Project Structure

```
krishiniti-simulator/
├── src/
│   ├── app/
│   │   ├── context/      # React context providers (Game, Language)
│   │   └── screens/      # Game screen components
│   ├── assets/           # Static assets (images, etc.)
│   ├── styles/           # Custom styles
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Entry point
├── public/               # Public static files
├── capacitor.config.ts   # Capacitor configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── vite.config.ts        # Vite configuration
└── package.json
```

## Game Phases

The game progresses through different phases:

1. **Splash Screen** - Welcome screen with logo
2. **Language Selection** - Choose your preferred language
3. **Goal Selection** - Select your farming goals
4. **Farm Setup** - Configure your farm settings
5. **Dashboard** - Main game interface
6. **Season Planning** - Plan your crops
7. **Events** - Handle random events
8. **Harvest** - Collect your produce
9. **Market** - Sell your crops
10. **Summary** - View game results

## Configuration

### Tailwind CSS
Customize the design system in `tailwind.config.ts`.

### Capacitor
Update app metadata and plugins in `capacitor.config.ts`.

### TypeScript
TypeScript configuration is split across multiple files:
- `tsconfig.json` - Base configuration
- `tsconfig.app.json` - Application specific config
- `tsconfig.node.json` - Node/Vite specific config

## License

This project is private and proprietary.


---

Built with ❤️ by RAJVARDHAN.V.WAKHARADE for financial empowerment and rural resilience.
