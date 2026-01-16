
import React from 'react';
import { MovieData } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface Props {
  movie: MovieData;
  onClose: () => void;
}

const MovieDetail: React.FC<Props> = ({ movie, onClose }) => {
  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const roi = ((movie.worldwideRevenue - movie.budget) / movie.budget * 100).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl">
        {/* Top Header */}
        <div className="p-6 md:p-8 flex items-center justify-between border-b border-slate-800">
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-3xl font-bold">{movie.title}</h2>
              <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-widest">{movie.origin}</span>
            </div>
            <p className="text-slate-400">{movie.genre} • Released {movie.releaseDate}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Content Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-10">
          {/* Summary */}
          <section>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">AI Analysis Summary</h3>
            <p className="text-lg leading-relaxed text-slate-300 font-light italic">"{movie.summary}"</p>
          </section>

          {/* Core Metrics */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <MetricBox label="Worldwide Gross Collection" value={formatCurrency(movie.worldwideRevenue)} color="text-cyan-400" />
            <MetricBox label="Production Budget" value={formatCurrency(movie.budget)} color="text-white" />
            <MetricBox label="Calculated ROI" value={`${roi}%`} color={Number(roi) > 0 ? 'text-emerald-400' : 'text-rose-400'} />
            <MetricBox label="Opening Weekend" value={formatCurrency(movie.openingWeekend)} color="text-amber-400" />
          </section>

          {/* Regional & Projections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Regional Performance Table */}
            <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-800">
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Regional Breakdown</h4>
              <div className="space-y-4">
                {movie.regionalBreakdown.map((reg, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <span className="text-slate-300 group-hover:text-cyan-400 transition-colors">{reg.region}</span>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs">{formatCurrency(reg.revenue)}</span>
                      <div className="w-32 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500" style={{ width: `${reg.share}%` }}></div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 w-8">{reg.share}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Projections */}
            <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-800">
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Gemini Predictive Model</h4>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <div className="flex flex-col">
                     <span className="text-xs text-slate-500 uppercase">Est. Next 4 Weeks</span>
                     <span className="text-2xl font-bold text-emerald-400">{formatCurrency(movie.projections.next4Weeks)}</span>
                   </div>
                   <div className="flex flex-col text-right">
                     <span className="text-xs text-slate-500 uppercase">Risk Assessment</span>
                     <span className={`text-xl font-bold ${movie.projections.riskLevel === 'Low' ? 'text-emerald-500' : movie.projections.riskLevel === 'Medium' ? 'text-amber-500' : 'text-rose-500'}`}>
                       {movie.projections.riskLevel} Risk
                     </span>
                   </div>
                </div>
                
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-3">Streaming & Digital Impact</h5>
                  <p className="text-xs text-slate-400 leading-relaxed italic">{movie.streamingImpact}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
           <button 
             onClick={onClose}
             className="px-6 py-2 bg-slate-800 text-sm font-bold rounded-lg hover:bg-slate-700"
           >
             Close Report
           </button>
        </div>
      </div>
    </div>
  );
};

const MetricBox = ({ label, value, color }: { label: string, value: string, color: string }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
    <span className={`text-xl font-bold ${color}`}>{value}</span>
  </div>
);

export default MovieDetail;
