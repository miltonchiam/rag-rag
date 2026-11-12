import React, { useState } from 'react';
import { MarketAlert, Instrument } from '../types/market';
import { Bell, BellRing, Plus, Trash2, X, CheckCircle2 } from 'lucide-react';

interface AlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: MarketAlert[];
  onAddAlert: (symbol: string, targetPrice: number, condition: 'ABOVE' | 'BELOW') => void;
  onDeleteAlert: (id: string) => void;
  instruments: Instrument[];
  currentInstrument: Instrument;
}

export const AlertsModal: React.FC<AlertsModalProps> = ({
  isOpen,
  onClose,
  alerts,
  onAddAlert,
  onDeleteAlert,
  instruments,
  currentInstrument
}) => {
  const [selectedSymbol, setSelectedSymbol] = useState(currentInstrument.symbol);
  const activeInst = instruments.find(i => i.symbol === selectedSymbol) || currentInstrument;
  const [targetPrice, setTargetPrice] = useState(activeInst.price.toString());
  const [condition, setCondition] = useState<'ABOVE' | 'BELOW'>('ABOVE');
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(targetPrice);
    if (!priceNum || priceNum <= 0) return;

    onAddAlert(selectedSymbol, priceNum, condition);
    setFeedback(`Alert armed for ${selectedSymbol} ${condition} $${priceNum.toFixed(2)}`);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none">
      <div className="w-full max-w-lg bg-[#1e222d] border border-[#2a2e39] rounded-xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 bg-[#181c27] border-b border-[#2a2e39] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#2962ff]" />
            <h3 className="font-bold text-white text-sm">PRO Real-Time Price Alerts</h3>
            <span className="text-xs px-2 py-0.5 rounded bg-[#2a2e39] text-[#787b86] font-mono">
              {alerts.length} active
            </span>
          </div>
          <button onClick={onClose} className="p-1 text-[#787b86] hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Create Alert Form */}
        <form onSubmit={handleCreate} className="p-4 bg-[#131722] border-b border-[#2a2e39] flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-[#787b86]">
            <span>Create New Price Alert</span>
            <span className="font-mono text-white">Current: ${activeInst.price.toFixed(2)}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* Symbol Select */}
            <select
              value={selectedSymbol}
              onChange={(e) => {
                setSelectedSymbol(e.target.value);
                const match = instruments.find(i => i.symbol === e.target.value);
                if (match) setTargetPrice(match.price.toString());
              }}
              className="bg-[#1e222d] border border-[#2a2e39] rounded px-2.5 py-1.5 text-xs text-white font-mono"
            >
              {instruments.map(i => (
                <option key={i.symbol} value={i.symbol}>{i.symbol}</option>
              ))}
            </select>

            {/* Condition Select */}
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as any)}
              className="bg-[#1e222d] border border-[#2a2e39] rounded px-2.5 py-1.5 text-xs text-white font-medium"
            >
              <option value="ABOVE">Crossing Above (≥)</option>
              <option value="BELOW">Crossing Below (≤)</option>
            </select>

            {/* Target Price Input */}
            <input
              type="number"
              step="any"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder="Target price..."
              className="bg-[#1e222d] border border-[#2a2e39] rounded px-2.5 py-1.5 text-xs text-white font-mono"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            {feedback && (
              <span className="text-xs text-[#089981] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {feedback}
              </span>
            )}
            <div className="ml-auto">
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-[#2962ff] hover:bg-[#2962ff]/90 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Arm Alert</span>
              </button>
            </div>
          </div>
        </form>

        {/* Existing Alerts List */}
        <div className="p-4 max-h-64 overflow-y-auto flex flex-col gap-2">
          {alerts.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#787b86]">
              No price alerts currently configured.
            </div>
          ) : (
            alerts.map(a => (
              <div
                key={a.id}
                className={`p-3 rounded-lg border flex items-center justify-between text-xs font-mono transition-colors ${
                  a.triggered 
                    ? 'bg-[#089981]/15 border-[#089981] text-white' 
                    : 'bg-[#131722] border-[#2a2e39] text-[#d1d4dc]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BellRing className={`w-3.5 h-3.5 ${a.triggered ? 'text-[#089981]' : 'text-[#787b86]'}`} />
                  <div>
                    <span className="font-bold text-white mr-1.5">{a.symbol}</span>
                    <span className="text-[#787b86]">{a.condition}</span>
                    <span className="font-bold text-white ml-1.5">${a.targetPrice.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {a.triggered && (
                    <span className="px-2 py-0.5 rounded bg-[#089981] text-white text-[10px] font-bold">
                      TRIGGERED
                    </span>
                  )}
                  <button
                    onClick={() => onDeleteAlert(a.id)}
                    className="p-1 text-[#787b86] hover:text-[#f23645] rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
