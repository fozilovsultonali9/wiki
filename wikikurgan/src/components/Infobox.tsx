import React from 'react';
import type { InfoboxData, Category } from '../types/wiki';
import { Shield, User, MapPin, Sword, Info, Star } from 'lucide-react';

interface InfoboxProps {
  data: InfoboxData;
  category: Category;
}

export const Infobox: React.FC<InfoboxProps> = ({ data, category }) => {
  const getHeaderStyle = () => {
    switch (category) {
      case 'character':
        return 'from-amber-600/30 to-amber-900/40 border-amber-500/40 text-amber-300';
      case 'game':
        return 'from-purple-600/30 to-purple-900/40 border-purple-500/40 text-purple-300';
      case 'item':
        return 'from-cyan-600/30 to-cyan-900/40 border-cyan-500/40 text-cyan-300';
      case 'location':
        return 'from-emerald-600/30 to-emerald-900/40 border-emerald-500/40 text-emerald-300';
      default:
        return 'from-blue-600/30 to-blue-900/40 border-blue-500/40 text-blue-300';
    }
  };

  const getCategoryIcon = () => {
    switch (category) {
      case 'character':
        return <User className="w-5 h-5 text-amber-400" />;
      case 'location':
        return <MapPin className="w-5 h-5 text-emerald-400" />;
      case 'item':
        return <Sword className="w-5 h-5 text-cyan-400" />;
      default:
        return <Shield className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <aside className="w-full lg:w-80 float-none lg:float-right lg:ml-6 mb-6 bg-slate-900/90 border border-slate-700/80 rounded-xl overflow-hidden shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-slate-600">
      {/* Title Header */}
      <div className={`p-4 bg-gradient-to-r ${getHeaderStyle()} border-b text-center relative`}>
        <div className="flex items-center justify-center space-x-2">
          {getCategoryIcon()}
          <h3 className="font-bold text-lg tracking-wide text-slate-100">{data.title}</h3>
        </div>
        {data.subtitle && (
          <p className="text-xs text-slate-300 mt-0.5 tracking-wider uppercase font-medium">{data.subtitle}</p>
        )}
      </div>

      {/* Image Banner */}
      {data.image && (
        <div className="p-3 bg-slate-950/60 border-b border-slate-800 text-center">
          <div className="overflow-hidden rounded-lg border border-slate-800 shadow-inner group">
            <img
              src={data.image}
              alt={data.title}
              className="w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          {data.caption && (
            <p className="text-[11px] text-slate-400 italic mt-2 flex items-center justify-center gap-1">
              <Info className="w-3 h-3 text-cyan-400 shrink-0" /> {data.caption}
            </p>
          )}
        </div>
      )}

      {/* Primary Details Table */}
      {data.details && Object.keys(data.details).length > 0 && (
        <div className="divide-y divide-slate-800 text-xs">
          {Object.entries(data.details).map(([key, val]) => (
            <div key={key} className="flex px-4 py-2.5 hover:bg-slate-800/40 transition-colors">
              <span className="w-5/12 font-medium text-slate-400 shrink-0">{key}</span>
              <span className="w-7/12 font-semibold text-slate-200 text-right">{val}</span>
            </div>
          ))}
        </div>
      )}

      {/* Stats Cards */}
      {data.stats && Object.keys(data.stats).length > 0 && (
        <div className="p-3 bg-slate-950/80 border-t border-slate-800">
          <h4 className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400" /> Ko'rsatkichlar & Statistikalar
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(data.stats).map(([statKey, statVal]) => (
              <div key={statKey} className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-center">
                <span className="block text-[10px] text-slate-400 uppercase font-medium">{statKey}</span>
                <span className="block text-sm font-bold text-amber-400 mt-0.5">{statVal}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};
