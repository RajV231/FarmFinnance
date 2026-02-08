import { EVENTS, GameEvent } from "../data/game-scenarios";

interface EventContext {
  season: number;
  riskExposure: number; // 0-1
  recentEvents: string[];
}

export const selectEvent = (ctx: EventContext): GameEvent => {
  // Filter events (exclude recents to prevent repetition)
  const availableEvents = EVENTS.filter(e => !ctx.recentEvents.includes(e.id));
  
  // Shock Event Logic: Low probability, increases with Risk Exposure
  const shockChance = 0.05 + (ctx.riskExposure * 0.1); 
  const isShock = Math.random() < shockChance;

  if (isShock) {
    const shocks = availableEvents.filter(e => e.type === 'SHOCK');
    if (shocks.length > 0) return shocks[Math.floor(Math.random() * shocks.length)];
  }

  // Standard Logic: Weighted random
  // Filter out shocks for standard pool
  const standardEvents = availableEvents.filter(e => e.type !== 'SHOCK');
  
  if (standardEvents.length === 0) return EVENTS[0]; // Fallback

  return standardEvents[Math.floor(Math.random() * standardEvents.length)];
};