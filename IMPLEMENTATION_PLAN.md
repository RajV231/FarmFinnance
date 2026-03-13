# KrishiNiti Game Enhancement Implementation Plan

## Phase 1: Core Feature Enhancements (Priority: HIGH)

### 1. Dynamic Market System 📈 - ENHANCEMENT NEEDED
**Current State:** Basic price generation exists in market-engine.ts
**To Implement:**
- [ ] Multi-mandi price comparison screen
- [ ] Price trend graphs (7-day, season-long)
- [ ] Forward contracts feature (lock prices at 80-90%)
- [ ] MSP (Minimum Support Price) integration as price floor
- [ ] Supply-demand engine tracking virtual farmers

**Files to Modify:**
- `src/app/engine/market-engine.ts` - Add supply-demand mechanics
- `src/app/components/market-prices-modal.tsx` - Add multi-mandi view
- `src/app/screens/harvest-screen.tsx` - Add mandi selection before sale

### 2. Government Schemes Dashboard 🏛️ - ENHANCEMENT NEEDED
**Current State:** Basic scheme benefits in game-context.tsx
**To Implement:**
- [ ] Dedicated "Schemes Dashboard" screen
- [ ] One-click "Apply" buttons with e-KYC flow
- [ ] Payment status tracking (Pending/Processed/Failed)
- [ ] More schemes: Soil Health Card, Kisan Samman Nidhi
- [ ] DBT credits appearing after 2-3 seasons (simulated delay)

**Files to Create:**
- `src/app/screens/schemes-screen.tsx`
- `src/app/components/scheme-card.tsx`

**Files to Modify:**
- `src/app/data/game-scenarios.ts` - Add more schemes
- `src/app/context/game-context.tsx` - Add scheme application state

### 3. Advanced Risk Management 🛡️ - ENHANCEMENT NEEDED
**Current State:** Basic insurance toggle
**To Implement:**
- [ ] Crop diversification mechanic (split acres across 2-3 crops)
- [ ] Weather forecasting system (IMD-style 7-day forecasts)
- [ ] "Risk Meter" dashboard
- [ ] Disaster prep mini-game before monsoon
- [ ] Multi-layer risk strategy UI

**Files to Create:**
- `src/app/engine/weather-engine.ts`
- `src/app/components/risk-meter.tsx`
- `src/app/screens/diversification-screen.tsx`

### 4. Financial Education Popups 📚 - ENHANCEMENT NEEDED
**Current State:** Basic popup system exists
**To Implement:**
- [ ] "Financial Guru" mascot character
- [ ] Quiz questions after popups with ₹500 bonus
- [ ] Progress tracker: "12/20 concepts learned"
- [ ] More trigger points (FD maturity, UPI payment, etc.)

**Files to Modify:**
- `src/app/engine/education-engine.ts` - Add quiz system
- `src/app/components/education-popup.tsx` - Add mascot, quiz UI

### 5. Seasonal Calendar Integration 📅 - INTEGRATION NEEDED
**Current State:** Component exists but not used in main UI
**To Implement:**
- [ ] Integrate into Dashboard or Planning screen
- [ ] Color-coded cash flow forecast
- [ ] Interactive drag-and-drop planning
- [ ] Show loan EMI dates, insurance deadlines, festivals

**Files to Modify:**
- `src/app/screens/dashboard-screen.tsx` or `src/app/screens/season-planning-screen.tsx`
- `src/app/components/seasonal-calendar.tsx` - Enhance with interactivity

### 6. Asset Upgrade Paths ⬆️ - ENHANCEMENT NEEDED
**Current State:** Binary ownership (have/have-not)
**To Implement:**
- [ ] Upgrade trees (manual → power tiller → tractor → combine)
- [ ] Maintenance economy (regular costs for higher-tier assets)
- [ ] Visual progression bars
- [ ] Rental income mechanic (rent to neighbors)

**Files to Modify:**
- `src/app/data/game-scenarios.ts` - Add upgrade paths
- `src/app/screens/shop-screen.tsx` - Show upgrade options
- `src/app/context/game-context.tsx` - Add maintenance logic

## Phase 2: UX/UI Enhancements (Priority: MEDIUM)

### 7. Accessibility Improvements ♿
**To Implement:**
- [ ] High contrast mode toggle
- [ ] Larger text mode
- [ ] Icon-heavy UI option
- [ ] Regional language support (Tamil, Telugu, Marathi, Punjabi, Bengali)
- [ ] Voice navigation enhancements

**Files to Create:**
- `src/app/context/accessibility-context.tsx`
- `src/app/components/accessibility-settings.tsx`

### 8. Data Visualization Dashboard 📊
**Current State:** Basic history list
**To Implement:**
- [ ] Income pie chart
- [ ] Expense waterfall chart
- [ ] Resilience trend line
- [ ] Debt pyramid visualization
- [ ] "Insight Cards" with auto-generated tips
- [ ] Export PDF report feature

**Dependencies:** Install Recharts or Chart.js
**Files to Create:**
- `src/app/components/charts/income-pie-chart.tsx`
- `src/app/components/charts/expense-waterfall.tsx`
- `src/app/components/charts/resilience-trend.tsx`
- `src/app/components/insight-cards.tsx`

### 9. AI Advisory Bot UI 🤖
**Current State:** Engine created (advisor-engine.ts)
**To Implement:**
- [ ] Chat interface component
- [ ] Voice input/output integration
- [ ] Personality selection screen
- [ ] "Ask Me Anything" mode
- [ ] Notification badge for new advice

**Files to Create:**
- `src/app/components/advisor-chat.tsx`
- `src/app/components/advisor-button.tsx`
- `src/app/screens/advisor-settings-screen.tsx`

**Files to Modify:**
- `src/app/screens/dashboard-screen.tsx` - Add advisor floating button

## Phase 3: Advanced Features (Priority: LOWER)

### 10. Haptic Feedback & Sound Design 🔊
**To Implement:**
- [ ] Success/failure sound effects
- [ ] Ambient farm sounds
- [ ] Haptic patterns for different events
- [ ] Dynamic soundtrack based on financial health
- [ ] Voice announcements in regional accents

**Files to Create:**
- `src/app/hooks/use-haptics.ts`
- `src/app/hooks/use-sound.ts`
- `src/assets/sounds/` (directory for audio files)

### 11. "What-If" Scenario Planner 🔮
**To Implement:**
- [ ] Split-screen scenario comparison
- [ ] Slider controls for variables
- [ ] Monte Carlo simulation (100 variations)
- [ ] Save/load scenarios
- [ ] Share scenario images

**Files to Create:**
- `src/app/engine/scenario-engine.ts`
- `src/app/screens/scenario-planner-screen.tsx`
- `src/app/components/scenario-comparison.tsx`

## Implementation Strategy

### Week 1: Foundation
1. Integrate Seasonal Calendar into Dashboard
2. Enhance Market System with multi-mandi view
3. Create Schemes Dashboard
4. Add Advisor Bot UI

### Week 2: Risk & Education
1. Implement crop diversification
2. Build weather forecasting system
3. Enhance education system with quizzes
4. Add asset upgrade paths

### Week 3: Analytics & Accessibility
1. Install charting library
2. Build data visualization dashboard
3. Implement accessibility features
4. Add haptic feedback

### Week 4: Polish & Advanced
1. Build "What-If" scenario planner
2. Add sound design
3. Performance optimization
4. Testing and bug fixes

## Technical Considerations

### Dependencies to Install:
```bash
npm install recharts --save  # For charts
npm install framer-motion --save  # For smooth animations
npm install react-confetti --save  # For celebrations
```

### State Management:
- Extend GameState interface in `game-context.tsx`
- Add new action types for each feature
- Ensure backward compatibility with saved games

### Performance:
- Lazy load heavy components (charts, scenario planner)
- Memoize expensive calculations (market prices, risk scores)
- Use React.memo for static components

### Testing:
- Test each feature independently before integration
- Verify save/load functionality after each change
- Check mobile responsiveness

## Success Metrics
- Player engagement time increases by 40%
- Financial literacy quiz scores improve
- Players complete more seasons on average
- Positive feedback on accessibility features
