import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { TrendingDown, ShieldCheck, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface RepairVsReplacementChartProps {
  repairCost: number;
  replacementCost: number;
  productAge: string;
  partsAvailable: boolean;
  remainingLife: string;
  resaleEstimate: number;
}

export const RepairVsReplacementChart: React.FC<RepairVsReplacementChartProps> = ({
  repairCost = 3000,
  replacementCost = 15000,
  productAge = '2.5 years',
  partsAvailable = true,
  remainingLife = '2–3 years',
  resaleEstimate = 9000
}) => {
  const chartData = [
    {
      name: 'Repair Cost',
      amount: repairCost,
      color: '#10B981', // emerald
      note: 'Est. bench fix'
    },
    {
      name: 'Resale Value',
      amount: resaleEstimate,
      color: '#06B6D4', // cyan
      note: 'Circular recovery'
    },
    {
      name: 'Replacement Cost',
      amount: replacementCost,
      color: '#71717A', // zinc dim
      note: 'New hardware outlay'
    }
  ];

  const savings = Math.max(0, replacementCost - repairCost);
  const savingsPercent = Math.round((savings / replacementCost) * 100);

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
        <div>
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block">
            ECONOMIC & LIFECYCLE RATIO
          </span>
          <h3 className="font-display font-semibold text-lg text-white">
            Repair vs Replacement Evaluation
          </h3>
        </div>

        <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 font-mono text-xs text-emerald-300 flex items-center gap-1.5 self-start sm:self-center">
          <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
          <span>SAVE ₹{savings.toLocaleString('en-IN')} ({savingsPercent}%)</span>
        </div>
      </div>

      {/* Bar Chart Visualization */}
      <div className="h-56 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="name" 
              stroke="#A1A1AA" 
              fontSize={11} 
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <YAxis 
              stroke="#71717A" 
              fontSize={10} 
              tickFormatter={(v) => `₹${v / 1000}k`}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="glass-panel-elevated p-2.5 rounded-lg border border-white/15 font-mono text-xs">
                      <div className="text-zinc-300">{data.name}</div>
                      <div className="font-bold text-white text-sm">₹{data.amount.toLocaleString('en-IN')}</div>
                      <div className="text-[10px] text-zinc-500">{data.note}</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Comparative Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <div className="p-3 rounded-xl bg-surface-200/80 border border-white/5 font-mono">
          <span className="text-[10px] text-zinc-500 block uppercase">Product Age</span>
          <span className="text-white text-xs font-semibold">{productAge}</span>
        </div>

        <div className="p-3 rounded-xl bg-surface-200/80 border border-white/5 font-mono">
          <span className="text-[10px] text-zinc-500 block uppercase">Spare Parts</span>
          <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            {partsAvailable ? 'Available' : 'Scarce'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-surface-200/80 border border-white/5 font-mono">
          <span className="text-[10px] text-zinc-500 block uppercase">Est. Added Life</span>
          <span className="text-cyan-400 text-xs font-semibold">{remainingLife}</span>
        </div>

        <div className="p-3 rounded-xl bg-surface-200/80 border border-white/5 font-mono">
          <span className="text-[10px] text-zinc-500 block uppercase">Resale Est.</span>
          <span className="text-zinc-200 text-xs font-semibold">₹{resaleEstimate.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Mandatory Disclaimer from Prompt Section 14 */}
      <p className="text-[11px] font-mono text-zinc-500 italic text-center pt-2 border-t border-white/5">
        * This analysis is an estimate. Actual costs and product condition may vary based on bench inspection.
      </p>
    </div>
  );
};
