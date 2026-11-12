import React, { useState } from 'react';
import { MOCK_ECONOMIC_CALENDAR } from '../data/mockMarketData';
import { Calendar, Filter, Clock, AlertCircle, TrendingUp, Globe } from 'lucide-react';

export const EconomicCalendarView: React.FC = () => {
  const [impactFilter, setImpactFilter] = useState<'All' | 'High' | 'Medium'>('All');
  const [currencyFilter, setCurrencyFilter] = useState<string>('All');

  const filtered = MOCK_ECONOMIC_CALENDAR.filter(event => {
    if (impactFilter !== 'All' && event.impact !== impactFilter) return false;
    if (currencyFilter !== 'All' && event.currency !== currencyFilter) return false;
    return true;
  });

  return (
    <div className="w-full flex flex-col gap-4">
      {/* 1. Header & Filters */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-lg p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#2962ff]" />
          <h2 className="text-base font-bold text-white">Institutional Economic Calendar</h2>
          <span className="text-xs text-[#787b86]">· High-Impact Macro Releases</span>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-3">
          {/* Impact Filter */}
          <div className="flex items-center bg-[#131722] p-0.5 rounded-lg border border-[#2a2e39] text-xs">
            {(['All', 'High', 'Medium'] as const).map(imp => (
              <button
                key={imp}
                onClick={() => setImpactFilter(imp)}
                className={`px-3 py-1 font-semibold rounded-md transition-colors ${
                  impactFilter === imp ? 'bg-[#2962ff] text-white' : 'text-[#787b86] hover:text-[#d1d4dc]'
                }`}
              >
                {imp} Impact
              </button>
            ))}
          </div>

          {/* Currency Filter */}
          <div className="flex items-center bg-[#131722] p-0.5 rounded-lg border border-[#2a2e39] text-xs">
            {['All', 'USD', 'EUR'].map(curr => (
              <button
                key={curr}
                onClick={() => setCurrencyFilter(curr)}
                className={`px-2.5 py-1 font-semibold rounded-md transition-colors ${
                  currencyFilter === curr ? 'bg-[#2a2e39] text-white' : 'text-[#787b86] hover:text-[#d1d4dc]'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Events Table */}
      <div className="bg-[#1e222d] border border-[#2a2e39] rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono tabular-nums">
            <thead>
              <tr className="bg-[#181c27] text-[#787b86] border-b border-[#2a2e39] font-medium font-sans">
                <th className="py-3 px-4">Time & Date</th>
                <th className="py-3 px-4">Currency</th>
                <th className="py-3 px-4">Impact</th>
                <th className="py-3 px-4">Economic Event</th>
                <th className="py-3 px-4 text-right">Actual</th>
                <th className="py-3 px-4 text-right">Forecast</th>
                <th className="py-3 px-4 text-right">Previous</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2e39]/50">
              {filtered.map(evt => {
                const isHigh = evt.impact === 'High';
                const hasActual = evt.actual !== undefined;

                return (
                  <tr key={evt.id} className="hover:bg-[#131722] transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#d1d4dc]">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-[#787b86]" />
                        <span>{evt.time}</span>
                        <span className="text-[10px] text-[#787b86] font-sans">({evt.date})</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-1.5 py-0.5 rounded bg-[#131722] border border-[#2a2e39] font-bold text-white text-[11px]">
                        {evt.currency}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-sans">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isHigh ? 'bg-[#f23645]/20 text-[#f23645] border border-[#f23645]/30' : 'bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/30'
                      }`}>
                        {evt.impact}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-sans font-medium text-white text-sm">
                      {evt.event}
                    </td>

                    <td className="py-3 px-4 text-right font-bold">
                      {hasActual ? (
                        <span className="text-[#089981] bg-[#089981]/10 px-2 py-0.5 rounded">
                          {evt.actual}
                        </span>
                      ) : (
                        <span className="text-[#787b86]">—</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right text-[#d1d4dc]">
                      {evt.forecast}
                    </td>

                    <td className="py-3 px-4 text-right text-[#787b86]">
                      {evt.previous}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
