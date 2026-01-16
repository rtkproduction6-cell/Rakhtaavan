
import React from 'react';
import { MovieData } from '../types';

interface Props {
  movies: MovieData[];
  onSelect: (movie: MovieData) => void;
}

const MovieTable: React.FC<Props> = ({ movies, onSelect }) => {
  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} L`;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="overflow-x-auto bg-slate-900/50 rounded-2xl border border-slate-800 shadow-xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-800/50 text-slate-400 text-xs uppercase tracking-widest font-bold">
            <th className="px-6 py-4">Title</th>
            <th className="px-6 py-4">Region</th>
            <th className="px-6 py-4">WW Gross Collection</th>
            <th className="px-6 py-4">ROI</th>
            <th className="px-6 py-4">Ratings</th>
            <th className="px-6 py-4">Social</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {movies.map((movie) => {
            const roi = ((movie.worldwideRevenue - movie.budget) / movie.budget * 100).toFixed(0);
            return (
              <tr 
                key={movie.id} 
                className="hover:bg-slate-800/50 transition-colors group cursor-pointer"
                onClick={() => onSelect(movie)}
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-100">{movie.title}</span>
                    <span className="text-xs text-slate-500">{movie.genre} • {movie.releaseDate}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-slate-800 border border-slate-700 text-slate-300">
                    {movie.origin}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-cyan-400 font-mono font-medium">{formatCurrency(movie.worldwideRevenue)}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`font-mono ${Number(roi) > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {Number(roi) > 0 ? '+' : ''}{roi}%
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                      <span className="text-xs">{movie.ratings.imdb}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <span className="text-xs">{movie.ratings.rottenTomatoes}%</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                   <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                     movie.socialBuzz === 'High' ? 'bg-indigo-500/20 text-indigo-400' : 
                     movie.socialBuzz === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-500/20 text-slate-400'
                   }`}>
                     {movie.socialBuzz}
                   </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-500 hover:text-cyan-400 group-hover:translate-x-1 transition-transform">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MovieTable;
