import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { CloudSun, Droplets, Wind, Thermometer, Info, RefreshCw } from 'lucide-react';

export default function WeatherWidget({ compact = false }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchWeatherData = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await api.getWeather();
      if (res.success) {
        setWeather(res);
      } else {
        setError(true);
      }
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-card border border-[#E5E7EB] flex items-center justify-center min-h-[110px]">
        <div className="flex items-center gap-2 text-xs text-[#6B7280]">
          <RefreshCw className="w-4 h-4 animate-spin text-[#0878D1]" />
          <span>Retrieving Kolhapur climate conditions...</span>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-card border border-[#E5E7EB] text-xs text-[#6B7280] flex items-center justify-between">
        <span>Kolhapur Climate: 26°C, Pleasant Skies (Seasonal Average)</span>
        <button onClick={fetchWeatherData} className="text-[#0878D1] hover:underline font-bold">
          Retry
        </button>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="bg-white rounded-xl p-3 border border-[#E5E7EB] shadow-sm flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#0878D1]/10 text-[#0878D1] flex items-center justify-center">
            <CloudSun className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-[#17243A] flex items-center gap-1.5">
              <span>{weather.temperature}°C</span>
              <span className="text-[11px] font-normal text-[#6B7280]">({weather.condition})</span>
            </div>
            <div className="text-[10px] text-[#6B7280]">Kolhapur Weather</div>
          </div>
        </div>
        <div className="text-right text-[11px] text-[#6B7280]">
          <div>Humidity: {weather.humidity}%</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#17243A] text-white rounded-2xl p-5 shadow-card border border-white/10">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-[#FF7900] font-bold tracking-wider uppercase">
            <CloudSun className="w-4 h-4" />
            <span>Kolhapur District Weather</span>
          </div>
          <h4 className="text-lg font-extrabold text-white mt-0.5">
            {weather.location}
          </h4>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
          weather.isLive 
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
            : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
        }`}>
          {weather.isLive ? 'Live Satellite' : 'Seasonal Verified'}
        </span>
      </div>

      {/* Main Temperature and Conditions */}
      <div className="grid grid-cols-2 gap-4 items-center mb-4 pt-2 border-t border-white/10">
        <div>
          <div className="text-4xl font-extrabold text-white tracking-tight">
            {weather.temperature}°<span className="text-2xl font-light">C</span>
          </div>
          <p className="text-xs text-[#0878D1] font-bold mt-1">
            {weather.condition}
          </p>
        </div>

        <div className="space-y-1.5 text-xs text-gray-300">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-gray-400">
              <Droplets className="w-3.5 h-3.5" />
              <span>Humidity:</span>
            </span>
            <span className="font-semibold text-white">{weather.humidity}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-gray-400">
              <Wind className="w-3.5 h-3.5" />
              <span>Wind:</span>
            </span>
            <span className="font-semibold text-white">{weather.windSpeedKmH} km/h</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-gray-400">
              <Thermometer className="w-3.5 h-3.5" />
              <span>Range:</span>
            </span>
            <span className="font-semibold text-white">{weather.tempMin}° - {weather.tempMax}°C</span>
          </div>
        </div>
      </div>

      {/* Advisory Tip */}
      <div className="bg-white/10 rounded-xl p-3 border border-white/10 text-[11px] text-gray-200 flex items-start gap-2">
        <Info className="w-4 h-4 text-[#FF7900] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#FF7900]">{weather.season || 'Travel Advisory'}: </span>
          <span>{weather.travelAdvisory || weather.description}</span>
        </div>
      </div>
    </div>
  );
}
