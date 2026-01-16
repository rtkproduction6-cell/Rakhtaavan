
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { GlobalIndustryReport, MovieData } from '../types';

interface Props {
  report: GlobalIndustryReport;
  onSelectMovie: (movie: MovieData) => void;
}

const Dashboard: React.FC<Props> = ({ report, onSelectMovie }) => {
  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const totalTrendingGross = report.trendingMovies.reduce((acc, m) => acc + m.worldwideRevenue, 0);

  const COLORS = ['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-800 px-2 py-1 rounded">Primary Data Source: Sacnilk</span>
        <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/20">AI Engine: Gemini 3 Pro</span>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Worldwide Gross Collection" 
          value={formatCurrency(totalTrendingGross)} 
          sub="Total of analyzed trending titles" 
          trend="up"
        />
        <StatCard 
          title="Global Market Vol (90d)" 
          value={formatCurrency(report.totalMarketValue)} 
          sub="+12.4% vs prev period" 
          trend="up"
        />
        <StatCard 
          title="Primary Market Leader" 
          value={report.regionalRevenue[0]?.region || 'N/A'} 
          sub={formatCurrency(report.regionalRevenue[0]?.total || 0)} 
          trend="neutral"
        />
        <StatCard 
          title="Top Performing Genre" 
          value={report.topGenres[0]?.name || 'N/A'} 
          sub={`${report.topGenres[0]?.value}% Market Share`} 
          trend="up"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue by Region */}
        <div className="lg:col-span-2 bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
             <div className="w-1.5 h-4 bg-cyan-500 rounded-full"></div>
             Revenue by Region
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={report.regionalRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="region" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  cursor={{ fill: '#ffffff0a' }}
                  formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                />
                <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                  {report.regionalRevenue.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Genre Distribution */}
        <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
             <div className="w-1.5 h-4 bg-violet-500 rounded-full"></div>
             Market Share by Genre
          </h3>
          <div className="h-64 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={report.topGenres}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {report.topGenres.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-bold">100%</span>
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Global</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
             {report.topGenres.slice(0, 4).map((g, i) => (
               <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                  <span>{g.name}: {g.value}%</span>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
           <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
        </div>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
           <div className="w-1.5 h-4 bg-amber-500 rounded-full"></div>
           Market Intelligence Briefing
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.marketInsights.map((insight, idx) => (
            <div key={idx} className="flex gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition-all">
               <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-bold text-sm">
                 {idx + 1}
               </div>
               <p className="text-sm leading-relaxed text-slate-300 italic">"{insight}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, sub, trend }: { title: string, value: string, sub: string, trend: 'up' | 'down' | 'neutral' }) => (
  <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 transition-transform hover:scale-[1.02] cursor-default group">
    <div className="flex justify-between items-start mb-4">
      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{title}</span>
      {trend === 'up' && <div className="text-emerald-500 text-xs font-bold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full">↑ Growth</div>}
      {trend === 'down' && <div className="text-rose-500 text-xs font-bold flex items-center gap-1 bg-rose-500/10 px-2 py-0.5 rounded-full">↓ Decline</div>}
    </div>
    <div className="text-3xl font-bold mb-1 tracking-tight text-white group-hover:text-cyan-400 transition-colors">{value}</div>
    <div className="text-xs text-slate-500 font-medium">{sub}</div>
  </div>
);

export default Dashboard;
