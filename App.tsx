
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import MovieTable from './components/MovieTable';
import MovieDetail from './components/MovieDetail';
import { fetchMovieAnalytics } from './services/geminiService';
import { GlobalIndustryReport, MovieData } from './types';

const App: React.FC = () => {
  const [report, setReport] = useState<GlobalIndustryReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<MovieData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);

  const initializeData = useCallback(async (query: string = "") => {
    try {
      setLoading(true);
      const data = await fetchMovieAnalytics(query);
      setReport(data);
      setError(null);
      setShowSuggestions(false);
    } catch (err) {
      setError("Failed to synchronize with film industry intelligence servers.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeData();
    
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [initializeData]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      initializeData(searchQuery);
    }
  };

  const handleSuggestionClick = (label: string) => {
    setSearchQuery(label);
    initializeData(label);
  };

  // Extract suggestions from current report
  const allSuggestions = useMemo(() => {
    if (!report) return [];
    const suggestions: { label: string; type: 'Movie' | 'Genre' | 'Region' }[] = [];
    
    report.trendingMovies.forEach(m => suggestions.push({ label: m.title, type: 'Movie' }));
    report.topGenres.forEach(g => suggestions.push({ label: g.name, type: 'Genre' }));
    report.regionalRevenue.forEach(r => suggestions.push({ label: r.region, type: 'Region' }));
    
    // De-duplicate and handle case normalization
    return Array.from(new Map(suggestions.map(s => [s.label.toLowerCase(), s])).values());
  }, [report]);

  const filteredSuggestions = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    const query = searchQuery.toLowerCase();
    return allSuggestions
      .filter(s => s.label.toLowerCase().includes(query))
      .slice(0, 10);
  }, [searchQuery, allSuggestions]);

  if (loading && !report) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100 p-6">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-6 shadow-[0_0_30px_-5px_rgba(6,182,212,0.5)]"></div>
        <h1 className="text-2xl font-bold mb-2">Synchronizing Intelligence...</h1>
        <p className="text-slate-500 text-center max-w-sm">Gathering real-time box office data, audience sentiment, and regional market trends from Hollywood to Bollywood.</p>
        
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
          <LoadingStep label="Connecting to GRS" active />
          <LoadingStep label="Parsing Regional Metadata" active />
          <LoadingStep label="Calculating ROI Projections" />
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto pb-20">
        {/* Search & Header */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-800">
           <div>
             <h2 className="text-2xl font-bold tracking-tight">Global Market Intelligence</h2>
             <p className="text-slate-500 text-sm">Real-time reporting on the last 90 days of cinematic performance.</p>
           </div>
           
           <div className="relative w-full md:w-96" ref={searchRef}>
             <form onSubmit={handleSearch} className="group relative">
               <input 
                 type="text" 
                 placeholder="Analyze specific movie, genre or region..."
                 className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-cyan-500/50 transition-all group-hover:border-slate-700 shadow-inner"
                 value={searchQuery}
                 onChange={(e) => {
                   setSearchQuery(e.target.value);
                   setShowSuggestions(true);
                 }}
                 onFocus={() => setShowSuggestions(true)}
               />
               <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
               </svg>
               <button type="submit" className="hidden">Search</button>
             </form>

             {/* Autocomplete Dropdown */}
             {showSuggestions && filteredSuggestions.length > 0 && (
               <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                 <div className="py-2">
                   {filteredSuggestions.map((s, idx) => (
                     <button
                       key={idx}
                       onClick={() => handleSuggestionClick(s.label)}
                       className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-800 transition-colors text-left"
                     >
                       <span className="text-sm font-medium text-slate-200">{s.label}</span>
                       <span className={`text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${
                         s.type === 'Movie' ? 'bg-cyan-500/10 text-cyan-400' :
                         s.type === 'Genre' ? 'bg-violet-500/10 text-violet-400' :
                         'bg-emerald-500/10 text-emerald-400'
                       }`}>
                         {s.type}
                       </span>
                     </button>
                   ))}
                 </div>
               </div>
             )}
           </div>
        </div>

        {report && (
          <>
            <Dashboard report={report} onSelectMovie={setSelectedMovie} />
            
            <div className="px-6 md:px-8 mt-4">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-lg font-bold">Trending Releases Pipeline</h3>
                 <div className="flex gap-2">
                   <FilterBadge label="All Regions" active />
                   <FilterBadge label="Theatrical" />
                   <FilterBadge label="Digital High" />
                 </div>
              </div>
              <MovieTable movies={report.trendingMovies} onSelect={setSelectedMovie} />
            </div>
          </>
        )}

        {error && (
          <div className="m-8 p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-4 text-rose-400">
            <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <div>
              <p className="font-bold">Intelligence Link Interrupted</p>
              <p className="text-sm opacity-80">{error}</p>
            </div>
            <button onClick={() => initializeData()} className="ml-auto px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 rounded-lg text-xs font-bold uppercase tracking-widest">Retry Connection</button>
          </div>
        )}
      </div>

      {selectedMovie && (
        <MovieDetail 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
        />
      )}

      {/* Global Loading Overlay for Re-searches */}
      {loading && report && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm">
           <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl flex flex-col items-center">
             <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
             <p className="font-bold">Updating Data Model...</p>
           </div>
        </div>
      )}
    </Layout>
  );
};

const LoadingStep = ({ label, active = false }: { label: string, active?: boolean }) => (
  <div className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${active ? 'bg-slate-800 border-cyan-500/30' : 'bg-slate-900 border-slate-800 opacity-40'}`}>
    <div className={`w-2 h-2 rounded-full ${active ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]' : 'bg-slate-700'}`}></div>
    <span className="text-xs font-medium">{label}</span>
  </div>
);

const FilterBadge = ({ label, active = false }: { label: string, active?: boolean }) => (
  <button className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${active ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-slate-800 text-slate-500 border border-slate-800 hover:border-slate-700'}`}>
    {label}
  </button>
);

export default App;
