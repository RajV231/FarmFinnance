# KrishiNiti Simulator - Farming Simulation Game

A gamified financial resilience simulator for Indian farmers, built with React, TypeScript, Vite, and Tailwind CSS. Experience the challenges of farming through realistic scenarios including crop planning, weather events, market fluctuations, and financial management.

## 🎮 Features

- **Realistic Farming Simulation**: Manage crops (Cotton, Soybean, Wheat, Onion, Tomato) with realistic costs, yields, and risk factors
- **Financial Planning**: Handle loans from banks, cooperatives, and moneylenders with varying interest rates
- **Asset Management**: Purchase farm assets like drip irrigation, mini tractors, greenhouses, solar pumps, and warehouses
- **Dynamic Events**: Face real-world challenges like monsoon delays, pest attacks, market crashes, and fraud attempts
- **Insurance Options**: Protect your farm with PMFBY insurance against crop failures
- **Goal System**: Work towards financial goals like buying a tractor, children's education, or land expansion
- **Resilience Scoring**: Track your financial resilience based on savings, debt, and risk management
- **Poverty Spiral Detection**: Realistic mechanics showing how debt can spiral out of control
- **Multi-language Support**: Language selection for broader accessibility
- **PWA Support**: Install as a Progressive Web App for offline usage
- **Text-to-Speech**: Built-in speaker support for accessibility

## 🎯 Game Mechanics

### Crops
Choose from various crops with different risk/reward profiles:
- **Cotton**: High cost, high reward, high risk
- **Soybean**: Moderate investment, stable returns
- **Wheat**: Low cost, reliable but modest returns
- **Onion/Tomato**: Very high risk, massive potential rewards (vegetables)

### Assets
Protect your farm with strategic investments:
- **Drip Irrigation**: Water conservation and drought protection
- **Power Tiller**: Reduces labor costs
- **Polyhouse Net**: Protects vegetables from pests and weather
- **Solar Pump**: Free irrigation, reduces infrastructure risks
- **Small Godown**: Store crops to avoid selling at low prices

### Loans & Credit
- **Kisan Credit Card (KCC)**: 7% interest, requires good credit score (700+)
- **Co-operative Society**: 12% interest, moderate requirements (600+ score)
- **Moneylender**: 36% interest, no credit check (predatory but accessible)

### Random Events
Face realistic challenges across three phases:
- **Early Season**: Monsoon delays, poor germination, OTP scams
- **Mid Season**: Pest attacks, equipment failures, cash security risks
- **Late Season**: Unseasonal rains, market crashes, trader vs mandi decisions

## 🛠️ Tech Stack

- **Framework:** React 18.2 with hooks and context API
- **Language:** TypeScript 5.2 for type safety
- **Build Tool:** Vite 7.3 for fast development and optimized builds
- **Styling:** Tailwind CSS 3.4 for responsive UI
- **Icons:** Lucide React for beautiful icons
- **Utilities:** clsx, tailwind-merge for class management
- **PWA:** vite-plugin-pwa for offline capabilities

## 📁 Project Structure

```
/workspace
├── public/                  # Static assets (PWA icons, etc.)
│   ├── pwa-192x192.png
│   ├── pwa-512x512.png
│   └── vite.svg
├── src/
│   ├── app/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Header.tsx
│   │   │   ├── farm-visualizer.tsx
│   │   │   └── speaker-button.tsx
│   │   ├── context/         # React Context providers
│   │   │   ├── game-context.tsx    # Main game state management
│   │   │   └── language-context.tsx
│   │   ├── data/            # Game data and scenarios
│   │   │   └── game-scenarios.ts   # Crops, assets, events, loans
│   │   ├── engine/          # Game logic engine
│   │   │   └── event-engine.ts
│   │   ├── hooks/           # Custom React hooks
│   │   │   └── use-text-to-speech.ts
│   │   ├── screens/         # Game screens/views
│   │   │   ├── dashboard-screen.tsx
│   │   │   ├── farm-setup-screen.tsx
│   │   │   ├── season-planning-screen.tsx
│   │   │   ├── event-screen.tsx
│   │   │   ├── harvest-screen.tsx
│   │   │   ├── shop-screen.tsx
│   │   │   ├── bank-screen.tsx
│   │   │   ├── goals-screen.tsx
│   │   │   ├── profile-screen.tsx
│   │   │   ├── reports-screen.tsx
│   │   │   ├── resilience-screen.tsx
│   │   │   ├── summary-screen.tsx
│   │   │   └── [more screens...]
│   │   ├── utils/           # Utility functions
│   │   │   ├── game-calculations.ts
│   │   │   └── storage.ts
│   │   └── routes.ts        # Route definitions (state-based routing)
│   ├── assets/              # Images and static resources
│   ├── styles/              # Global styles
│   ├── App.tsx              # Main App component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global CSS with Tailwind directives
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript base configuration
├── tsconfig.app.json        # TypeScript app-specific config
├── tsconfig.node.json       # TypeScript Node/Vite config
└── vite.config.ts           # Vite configuration with PWA plugin
```

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- npm or yarn

### Installation

```bash
npm install
```

### Development

Start the development server with hot module replacement:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Production files will be generated in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality checks |

## 🎮 How to Play

1. **Setup Phase**: Choose your language, select a financial goal, and configure your farm size and type
2. **Planning Phase**: Each season, choose your crop, take loans if needed, and buy insurance
3. **Event Phase**: Face 3 random events (early, mid, late season) and make critical decisions
4. **Harvest Phase**: Calculate yields, prices, and profits based on your choices and events
5. **Repayment Phase**: Pay back loans or face credit score impacts
6. **Goal Progress**: Work towards your financial goal over multiple seasons
7. **Win/Loss**: Complete your goal within 10 seasons without falling into unmanageable debt

## 🔧 Configuration

### Tailwind CSS

Customize the design system in `tailwind.config.ts`:

```ts
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### TypeScript

Configuration is split across:
- `tsconfig.json` - Base configuration
- `tsconfig.app.json` - App-specific settings
- `tsconfig.node.json` - Node/Vite config settings

### PWA Configuration

PWA settings are in `vite.config.ts` including manifest, icons, and service worker configuration.

## 🌟 Key Design Decisions

- **State-based Routing**: Custom routing solution to keep the app lightweight without React Router
- **Context API**: Centralized game state management using React Context
- **No Overengineering**: Simple, linear simulation flow perfect for educational purposes
- **Mobile-first**: Responsive design with PWA support for rural accessibility
- **Offline Support**: Service workers cache all assets for offline gameplay

## 📝 License

MIT
