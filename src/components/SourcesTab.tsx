import React, { useState } from 'react';
import { NewsSource } from '../types';
import { Globe, Award, Search, HelpCircle, RotateCcw, SlidersHorizontal, BookOpen, Check } from 'lucide-react';

interface SourcesTabProps {
  sources: NewsSource[];
  onToggle: (id: string, active: boolean) => void;
  onPriorityChange: (id: string, priority: number) => void;
  onReset: () => void;
}

export default function SourcesTab({ sources, onToggle, onPriorityChange, onReset }: SourcesTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');

  // Filter sources
  const filteredSources = sources.filter(source => {
    const matchesSearch = source.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          source.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          source.url.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTier = selectedTier === 'all' || source.type === selectedTier;
    const matchesCountry = selectedCountry === 'all' || source.country === selectedCountry;

    return matchesSearch && matchesTier && matchesCountry;
  });

  const getTierBadgeColor = (type: NewsSource['type']) => {
    switch (type) {
      case 'aggregator': return 'bg-amber-50/70 text-amber-800 border-amber-200/80';
      case 'national': return 'bg-[#B19470]/10 text-stone-900 border-[#B19470]/20';
      case 'pan-african': return 'bg-[#8C6239]/10 text-[#8C6239] border-[#8C6239]/20';
      case 'global-trust': return 'bg-stone-100 text-stone-805 border-stone-250';
      case 'specialized-tech': return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'specialized-business': return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'official': return 'bg-stone-50 text-stone-705 border-stone-250';
      default: return 'bg-stone-50 text-stone-605 border-stone-200';
    }
  };

  const activeCount = sources.filter(s => s.active).length;

  return (
    <div className="space-y-6 text-stone-900">
      
      {/* Header Info Hub */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#B19470]"></div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] bg-[#B19470]/10 text-[#8C6239] border border-[#B19470]/20 px-3 py-0.5 font-bold uppercase rounded-full tracking-wider">
              PUBLISH DIRECTIVES
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-stone-950 flex items-center gap-2 font-serif">
            <BookOpen className="w-5 h-5 text-[#8C6239]" />
            News Outlets & Feed Directory
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm max-w-2xl leading-relaxed font-medium">
            Toggle which national media publications, global news networks, official bank bulletins, or tech journals are consulted during research runs. Adjust authority weights to influence priority algorithms.
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="bg-stone-50/50 border border-stone-200/50 px-4 py-2 rounded-xl text-center shadow-sm flex-1 md:flex-none">
            <span className="block text-[8px] text-stone-400 font-extrabold uppercase tracking-wider">Consulting Channels</span>
            <span className="text-xl font-bold text-stone-850 mt-0.5 block">{activeCount} / {sources.length}</span>
          </div>
          <button 
            onClick={onReset}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-stone-650 bg-white hover:bg-stone-50 border border-stone-250 rounded-xl transition duration-150 cursor-pointer flex-1 md:flex-none shadow-sm"
            id="reset-sources-btn"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4.5 rounded-2xl border border-stone-200/60 flex flex-col md:flex-row gap-3.5 items-center shadow-sm">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
          <input 
            type="text"
            placeholder="Search verified publications by title, category, or region..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 focus:border-[#B19470] focus:bg-white rounded-xl outline-none font-medium text-stone-800 transition duration-150"
            id="source-search-input"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto">
          <select 
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="bg-white border border-stone-250 text-stone-700 text-[11px] font-semibold px-3 py-2 rounded-xl outline-none cursor-pointer shadow-sm min-w-[160px] hover:border-stone-300 transition-all font-sans"
            id="tier-filter-select"
          >
            <option value="all">All Publisher Tiers</option>
            <option value="aggregator">Aggregators</option>
            <option value="national">Nigeria National Press</option>
            <option value="pan-african">Pan-African Journals</option>
            <option value="global-trust">Global Trust Wires</option>
            <option value="specialized-tech">Ecosystem Tech Media</option>
            <option value="specialized-business">Business Verticals</option>
            <option value="official">Official Bank Bulletins</option>
          </select>

          <select 
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="bg-white border border-[#d6d3d1] text-stone-700 text-[11px] font-semibold px-3 py-2 rounded-xl outline-none cursor-pointer shadow-sm min-w-[130px] hover:border-stone-300 transition-all font-sans"
            id="country-filter-select"
          >
            <option value="all">All Geographics</option>
            <option value="Nigeria">Nigeria Focus</option>
            <option value="South Africa">South Africa</option>
            <option value="Kenya">Kenya Focus</option>
            <option value="Global">Global Wire</option>
            <option value="US">United States</option>
            <option value="UK">United Kingdom</option>
          </select>
        </div>
      </div>

      {/* Grid of sources */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSources.map((source) => (
          <div 
            key={source.id} 
            className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
              source.active 
                ? 'bg-white border-stone-200/60 shadow-sm hover:shadow-md hover:-translate-y-0.5' 
                : 'bg-stone-50/50 border-stone-200/40 opacity-50'
            }`}
            id={`source-card-${source.id}`}
          >
            <div>
              {/* Top Details */}
              <div className="flex justify-between items-center gap-2 border-b border-stone-100 pb-3">
                <span className={`text-[8px] font-bold tracking-wider uppercase px-2 py-0.5 rounded border ${getTierBadgeColor(source.type)}`}>
                  {source.type.replace('-', ' ')}
                </span>
                
                <button 
                  onClick={() => onToggle(source.id, !source.active)}
                  className="focus:outline-none cursor-pointer"
                  id={`toggle-source-btn-${source.id}`}
                >
                  {source.active ? (
                    <span className="text-emerald-800 font-bold text-[9px] flex items-center gap-1 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase">
                      <span className="w-1 h-1 rounded-full bg-emerald-600 animate-pulse"></span>
                      Enabled
                    </span>
                  ) : (
                    <span className="text-stone-400 font-bold text-[9px] flex items-center gap-1 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-full uppercase">
                      Suspended
                    </span>
                  )}
                </button>
              </div>

              {/* Title & Category info */}
              <div className="mt-3.5 space-y-1.5 font-sans">
                <h4 className="font-bold text-stone-850 text-sm leading-snug tracking-tight">
                  {source.name}
                </h4>
                <div className="flex flex-wrap items-center gap-2 text-[9px] font-bold text-stone-400 uppercase">
                  <span className="flex items-center gap-1 bg-stone-50 border border-stone-100 px-1.5 py-0.5 rounded">
                    <Globe className="w-2.5 h-2.5 text-stone-400" />
                    {source.country}
                  </span>
                  <span className="bg-stone-50 border border-stone-100 px-1.5 py-0.5 rounded tracking-wide">{source.category}</span>
                </div>
              </div>
            </div>

            {/* Credibility Tuning */}
            <div className="mt-5 pt-3 border-t border-stone-100 flex flex-col gap-2 font-sans">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-stone-500 font-semibold uppercase tracking-tight text-[9px] flex items-center gap-1">
                  <Award className="w-3 h-3 text-[#B19470]" />
                  Verify Authority Priority
                </span>
                <span className="font-bold text-[#8C6239] bg-[#B19470]/10 border border-[#B19470]/15 px-2 py-0.5 rounded text-[10px]">
                  {source.priority}%
                </span>
              </div>
              
              <input 
                type="range"
                min="10"
                max="100"
                value={source.priority}
                disabled={!source.active}
                onChange={(e) => onPriorityChange(source.id, parseInt(e.target.value))}
                className="w-full h-1 bg-stone-150 rounded-lg appearance-none cursor-pointer disabled:opacity-30 disabled:pointer-events-none accent-[#8C6239]"
                id={`priority-range-${source.id}`}
              />
            </div>
          </div>
        ))}

        {filteredSources.length === 0 && (
          <div className="col-span-full py-16 text-center bg-white border border-dashed border-stone-200 rounded-2xl font-sans">
            <HelpCircle className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <p className="text-stone-800 font-bold uppercase tracking-tight text-xs">No outlets found</p>
            <p className="text-stone-400 text-xs">Try adjusting your filters or search keywords.</p>
          </div>
        )}
      </div>

    </div>
  );
}
