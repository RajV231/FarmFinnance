import { WeatherForecast, WeatherCondition } from '../data/game-scenarios';

// Weather forecasting engine for Phase 3
class WeatherEngine {
  private forecastHistory: WeatherForecast[] = [];
  
  /**
   * Generate 7-day weather forecast with decreasing accuracy
   * Week 1: 80% accuracy, Week 2: 60%, Week 3: 40%
   */
  generateForecast(): WeatherForecast[] {
    const conditions: WeatherCondition[] = ['SUNNY', 'CLOUDY', 'RAINY', 'STORM', 'DROUGHT'];
    const forecast: WeatherForecast[] = [];
    
    // Generate 7-day forecast
    for (let day = 1; day <= 7; day++) {
      const accuracy = day <= 3 ? 0.8 : day <= 5 ? 0.6 : 0.4;
      const baseCondition = this.getRandomCondition();
      
      // Apply accuracy - might show wrong condition based on accuracy
      const actualCondition = Math.random() < accuracy 
        ? baseCondition 
        : conditions[Math.floor(Math.random() * conditions.length)];
      
      forecast.push({
        day,
        condition: actualCondition,
        predictedCondition: baseCondition,
        temperature: this.getTemperature(baseCondition),
        rainfall: this.getRainfall(baseCondition),
        accuracy: Math.round(accuracy * 100),
        isExtreme: baseCondition === 'STORM' || baseCondition === 'DROUGHT'
      });
    }
    
    this.forecastHistory = forecast;
    return forecast;
  }
  
  private getRandomCondition(): WeatherCondition {
    const rand = Math.random();
    if (rand < 0.3) return 'SUNNY';
    if (rand < 0.5) return 'CLOUDY';
    if (rand < 0.7) return 'RAINY';
    if (rand < 0.85) return 'STORM';
    return 'DROUGHT';
  }
  
  private getTemperature(condition: WeatherCondition): number {
    switch(condition) {
      case 'SUNNY': return 32 + Math.floor(Math.random() * 5);
      case 'CLOUDY': return 28 + Math.floor(Math.random() * 4);
      case 'RAINY': return 25 + Math.floor(Math.random() * 3);
      case 'STORM': return 24 + Math.floor(Math.random() * 2);
      case 'DROUGHT': return 38 + Math.floor(Math.random() * 4);
      default: return 28;
    }
  }
  
  private getRainfall(condition: WeatherCondition): number {
    switch(condition) {
      case 'SUNNY': return 0;
      case 'CLOUDY': return Math.floor(Math.random() * 5);
      case 'RAINY': return 10 + Math.floor(Math.random() * 20);
      case 'STORM': return 30 + Math.floor(Math.random() * 50);
      case 'DROUGHT': return 0;
      default: return 0;
    }
  }
  
  /**
   * Get monsoon onset prediction
   */
  getMonsoonPrediction(): { onset: string; confidence: number; impact: string } {
    const rand = Math.random();
    if (rand < 0.3) {
      return { onset: 'Early', confidence: 65, impact: 'Good for early sowing' };
    } else if (rand < 0.7) {
      return { onset: 'Normal', confidence: 75, impact: 'Optimal planting window' };
    } else {
      return { onset: 'Delayed', confidence: 60, impact: 'Consider drought-resistant crops' };
    }
  }
  
  /**
   * Generate climate change scenario
   */
  getClimateScenario(seasonNumber: number): { type: string; description: string; frequency: string } {
    if (seasonNumber > 3 && Math.random() < 0.3) {
      return {
        type: 'EXTREME_WEATHER',
        description: 'Increased frequency of unseasonal rains and heatwaves',
        frequency: 'Every 2-3 seasons'
      };
    }
    return {
      type: 'NORMAL_VARIABILITY',
      description: 'Typical seasonal weather patterns',
      frequency: 'Regular'
    };
  }
  
  /**
   * Get weather alert based on forecast
   */
  getWeatherAlert(): string | null {
    const stormDays = this.forecastHistory.filter(f => f.condition === 'STORM').length;
    const droughtDays = this.forecastHistory.filter(f => f.condition === 'DROUGHT').length;
    
    if (stormDays >= 2) {
      return 'Heavy storms predicted. Secure assets and consider early harvest.';
    }
    if (droughtDays >= 4) {
      return 'Extended dry period forecasted. Ensure irrigation readiness.';
    }
    return null;
  }
}

export const weatherEngine = new WeatherEngine();
