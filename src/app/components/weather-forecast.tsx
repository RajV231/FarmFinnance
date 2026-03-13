import React, { useState } from 'react';
import { useGame } from '../context/game-context';
import { Cloud, Sun, CloudRain, CloudLightning, Droplets, Thermometer, AlertTriangle, TrendingUp } from 'lucide-react';
import { weatherEngine } from '../engine/weather-engine';
import clsx from 'clsx';

interface WeatherDay {
  day: number;
  condition: string;
  temperature: number;
  rainfall: number;
  accuracy: number;
  isExtreme: boolean;
}

export const WeatherForecastPanel = () => {
  const { state } = useGame();
  const [forecast] = useState<WeatherDay[]>(() => {
    // Generate forecast on component mount
    const fc = weatherEngine.generateForecast();
    return fc.map(f => ({
      day: f.day,
      condition: f.condition,
      temperature: f.temperature,
      rainfall: f.rainfall,
      accuracy: f.accuracy,
      isExtreme: f.isExtreme
    }));
  });

  const monsoonPrediction = weatherEngine.getMonsoonPrediction();
  const weatherAlert = weatherEngine.getWeatherAlert();

  const getWeatherIcon = (condition: string) => {
    switch(condition) {
      case 'SUNNY': return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'CLOUDY': return <Cloud className="w-8 h-8 text-gray-400" />;
      case 'RAINY': return <CloudRain className="w-8 h-8 text-blue-500" />;
      case 'STORM': return <CloudLightning className="w-8 h-8 text-purple-600" />;
      case 'DROUGHT': return <Thermometer className="w-8 h-8 text-red-600" />;
      default: return <Sun className="w-8 h-8 text-yellow-500" />;
    }
  };

  const getConditionLabel = (condition: string) => {
    switch(condition) {
      case 'SUNNY': return 'Sunny';
      case 'CLOUDY': return 'Cloudy';
      case 'RAINY': return 'Rainy';
      case 'STORM': return 'Storm';
      case 'DROUGHT': return 'Hot & Dry';
      default: return condition;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Cloud className="w-5 h-5 text-blue-600" />
          Weather Forecast (7-Day)
        </h3>
        <span className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded-full">
          IMD-Style Forecast
        </span>
      </div>

      {/* Weather Alert */}
      {weatherAlert && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 rounded">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 font-medium">{weatherAlert}</p>
          </div>
        </div>
      )}

      {/* Monsoon Prediction */}
      <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-600 font-semibold uppercase">Monsoon Onset</p>
            <p className="text-sm font-bold text-green-800">{monsoonPrediction.onset}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-600">Confidence: {monsoonPrediction.confidence}%</p>
            <p className="text-xs text-green-700">{monsoonPrediction.impact}</p>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast Grid */}
      <div className="grid grid-cols-7 gap-2">
        {forecast.map((day) => (
          <div 
            key={day.day}
            className={clsx(
              "text-center p-2 rounded-lg border",
              day.isExtreme ? "bg-red-50 border-red-300" : "bg-blue-50 border-blue-200"
            )}
          >
            <p className="text-xs text-gray-600 font-semibold mb-1">Day {day.day}</p>
            <div className="flex justify-center mb-1">
              {getWeatherIcon(day.condition)}
            </div>
            <p className="text-xs font-medium text-gray-800 mb-1">
              {getConditionLabel(day.condition)}
            </p>
            <div className="flex items-center justify-center gap-1 text-xs text-gray-600">
              <Thermometer className="w-3 h-3" />
              <span>{day.temperature}°C</span>
            </div>
            <div className="flex items-center justify-center gap-1 text-xs text-blue-600">
              <Droplets className="w-3 h-3" />
              <span>{day.rainfall}mm</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{day.accuracy}% accurate</p>
          </div>
        ))}
      </div>

      {/* Accuracy Note */}
      <div className="mt-3 text-xs text-gray-500 text-center">
        <p>Forecast accuracy: Days 1-3 (80%), Days 4-5 (60%), Days 6-7 (40%)</p>
      </div>
    </div>
  );
};
