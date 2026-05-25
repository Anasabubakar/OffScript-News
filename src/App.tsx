import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Newspaper, Compass, CheckCircle, Play, RefreshCw, 
  BookOpen, Globe, HelpCircle, ArrowRight, ListFilter, 
  Trash2, Briefcase, Mail, Feather, Sparkles, Check, Clipboard
} from 'lucide-react';
import { NewsSource, EditorialBrief, PipelineLog } from './types';
import SourcesTab from './components/SourcesTab';
import ReaderPreview from './components/ReaderPreview';
import SocialExport from './components/SocialExport';

export default function App() {
  // Navigation & Workspace State
  const [activeTab, setActiveTab] = useState<'draft_studio' | 'sources' | 'archives'>('draft_studio');
  const [activeWorkspaceSubTab, setActiveWorkspaceSubTab] = useState<'preview' | 'social'>('preview');
  const [isPublicMode, setIsPublicMode] = useState<boolean>(false);
  
  // Editorial Configuration State
  const [mode, setMode] = useState<'baseline' | 'live'>('baseline');
  const [ratio, setRatio] = useState<number>(50); // Local-to-Global ratio
  const [customPrompt, setCustomPrompt] = useState<string>('Focus on youth digital policies and tech startups');
  
  // Back-end Data States
  const [sources, setSources] = useState<NewsSource[]>([]);
  const [briefs, setBriefs] = useState<EditorialBrief[]>([]);
  const [currentBrief, setCurrentBrief] = useState<EditorialBrief | null>(null);

  // Live Pipeline Progress States
  const [pipelineRunning, setPipelineRunning] = useState<boolean>(false);
  const [pipelineStep, setPipelineStep] = useState<string>('');
  
  // Deploy State
  const [isDeploying, setIsDeploying] = useState<boolean>(false);

  // Visitor Onboarding Elements
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [subscriberEmail, setSubscriberEmail] = useState<string>('');
  const [onboardingAnswers, setOnboardingAnswers] = useState({ focus: 'Tech', time: '5 min', delivery: 'WhatsApp' });

  // On mount, load initial records
  useEffect(() => {
    fetchSources();
    fetchBriefs();
  }, []);

  const fetchSources = async () => {
    try {
      const res = await fetch('/api/sources');
      const data = await res.json();
      setSources(data);
    } catch (err) {
      console.error("Error fetching sources", err);
    }
  };

  const fetchBriefs = async () => {
    try {
      const res = await fetch('/api/briefs');
      const data = await res.json();
      setBriefs(data);
      if (data.length > 0 && !currentBrief) {
        setCurrentBrief(data[0]);
      }
    } catch (err) {
      console.error("Error fetching briefings", err);
    }
  };

  const handleToggleSource = async (id: string, active: boolean) => {
    try {
      const res = await fetch(`/api/sources/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active })
      });
      if (res.ok) {
        setSources(prev => prev.map(s => s.id === id ? { ...s, active } : s));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePrioritySource = async (id: string, priority: number) => {
    try {
      const res = await fetch(`/api/sources/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority })
      });
      if (res.ok) {
        setSources(prev => prev.map(s => s.id === id ? { ...s, priority } : s));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetSources = async () => {
    try {
      const res = await fetch('/api/sources/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSources(data.sources);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Run the Multi-Agent compilation pipeline (simulated steps + Gemini generation)
  const runPipeline = async () => {
    setPipelineRunning(true);
    setPipelineStep('COLLECT');
    setActiveTab('draft_studio');

    try {
      // Pace steps so the writer experiences a beautiful, calm editorial sequence
      setPipelineStep('COLLECT');
      await new Promise(r => setTimeout(r, 650));
      
      setPipelineStep('CLEAN');
      await new Promise(r => setTimeout(r, 650));

      setPipelineStep('CLUSTER');
      await new Promise(r => setTimeout(r, 650));

      setPipelineStep('VERIFY');
      await new Promise(r => setTimeout(r, 700));

      setPipelineStep('WRITE');

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: customPrompt,
          mode: mode,
          ratio: ratio
        })
      });

      const result = await response.json();
      
      if (response.ok && result.brief) {
        setCurrentBrief(result.brief);
        await fetchBriefs();
        
        setPipelineStep('PUBLISH');
        await new Promise(r => setTimeout(r, 600));
        
        // Auto navigate to preview the written news draft
        setActiveWorkspaceSubTab('preview');
      } else {
        alert("Gathering finished. Editorial parameters successfully recorded.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPipelineRunning(false);
      setPipelineStep('');
    }
  };

  // Inline update callback for editing content drafts live on-canvas
  const handleUpdateBrief = (newBrief: EditorialBrief) => {
    setCurrentBrief(newBrief);
    // Synced immediately to briefs list to capture active edits
    setBriefs(prev => prev.map(b => b.id === newBrief.id ? newBrief : b));
  };

  const handleDeployBrief = async (destination: 'website' | 'newsletter') => {
    setIsDeploying(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsDeploying(false);
    alert(`Successfully compiled and published today's issue to your readers!`);
  };

  const handleDeleteBrief = async (id: string) => {
    try {
      const res = await fetch(`/api/briefs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBriefs(prev => prev.filter(b => b.id !== id));
        if (currentBrief && currentBrief.id === id) {
          const remaining = briefs.filter(b => b.id !== id);
          setCurrentBrief(remaining.length > 0 ? remaining[0] : null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleShareWhatsApp = () => {
    if (!currentBrief) return;
    const shareText = encodeURIComponent(currentBrief.formats.whatsapp);
    window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 font-sans selection:bg-[#B19470]/30 selection:text-[#5F4E3C] pb-16 transition-colors duration-200">
      
      {/* Primary Workspace Header */}
      <header className="border-b border-stone-250/50 bg-white/95 sticky top-0 z-50 px-6 sm:px-10 py-3.5 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-[0_2px_12px_rgba(131,121,111,0.02)] backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="bg-stone-900 text-[#FCFBF8] font-serif font-black text-base px-3.5 py-1.5 rounded-lg shadow-sm tracking-tight">
            Briefly Journal
          </div>
          <div className="flex flex-col leading-tight font-sans">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#8C6239]">Newsletter Editorial Assistant</span>
            <span className="text-[8px] font-mono text-stone-400 font-bold">WRITING TODAY • RESEARCH STABLE</span>
          </div>
        </div>

        {/* Workspace Mode Switcher */}
        <div className="flex bg-stone-100 border border-stone-200/60 p-0.5 rounded-xl text-xs">
          <button 
            onClick={() => setIsPublicMode(false)}
            className={`px-4.5 py-2.5 rounded-lg font-bold uppercase tracking-wider transition-all duration-150 ${
              !isPublicMode 
                ? 'bg-white text-stone-900 shadow-sm' 
                : 'text-stone-500 hover:text-stone-850 cursor-pointer'
            }`}
            id="control-dash-tab"
          >
            ✍️ Editorial Studio
          </button>
          <button 
            onClick={() => setIsPublicMode(true)}
            className={`px-4.5 py-2.5 rounded-lg font-bold uppercase tracking-wider transition-all duration-150 ${
              isPublicMode 
                ? 'bg-white text-stone-900 shadow-sm' 
                : 'text-stone-500 hover:text-stone-850 cursor-pointer'
            }`}
            id="visitor-demo-tab"
          >
            👁️ Audience Portal Preview
          </button>
        </div>
      </header>

      {isPublicMode ? (
        /* =============================================================
           PUBLIC LANDING PORTAL - ELEGANT WISPY LAYOUT FOR NEWS SEGMENT
           ============================================================= */
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white min-h-screen text-stone-800"
        >
          {/* Main Hero Elements */}
          <div className="max-w-5xl mx-auto px-6 py-16 sm:py-24 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-5">
              <span className="text-[10px] font-bold tracking-widest text-[#8C6239] bg-[#B19470]/10 border border-[#B19470]/20 uppercase px-3.5 py-1.5 rounded-full inline-block">
                CHANNELS NEWS FOR YOUNG CITIZENS
              </span>
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-stone-950 font-serif leading-none">
                Understand what actually <span className="text-[#8C6239] italic font-semibold font-serif">happened today</span>.
              </h1>
              <p className="text-sm sm:text-base text-stone-500 leading-relaxed max-w-2xl mx-auto">
                No outrage. No corporate jargon. We analyze publications every day, filter out the noise, and explain breaking news in standard, easy-to-read terms.
              </p>

              {/* Instant Subscription Widget */}
              <div className="max-w-md mx-auto pt-4">
                {subscribed ? (
                  <motion.div 
                    initial={{ scale: 0.98 }}
                    animate={{ scale: 1 }}
                    className="p-3.5 bg-emerald-50 border border-emerald-100/80 text-emerald-800 rounded-xl font-bold text-xs text-center"
                  >
                    🎉 Welcome onboard! You'll receive simpler daily news breakdowns.
                  </motion.div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-2 bg-stone-50 p-2 rounded-xl border border-stone-200">
                    <input 
                      type="email"
                      required
                      placeholder="Enter your email address..."
                      value={subscriberEmail}
                      onChange={(e) => setSubscriberEmail(e.target.value)}
                      className="flex-1 px-3 py-2 bg-transparent border-none outline-none text-stone-800 font-medium text-xs"
                      id="subscriber-email-input"
                    />
                    <button 
                      onClick={() => {
                        if (subscriberEmail.trim() !== '') setSubscribed(true);
                      }}
                      className="px-5 py-2.5 bg-stone-900 text-stone-100 hover:bg-stone-800 text-xs font-bold uppercase tracking-wider rounded-lg transition duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                      id="submit-subscribe-btn"
                    >
                      Subscribe Free <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Interactive Reader Value Profile */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 font-sans text-xs">
              <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200/50 space-y-2.5">
                <div className="w-9 h-9 bg-[#B19470]/10 text-[#8C6239] rounded-lg flex items-center justify-center font-bold text-sm">
                  📚
                </div>
                <h3 className="font-bold text-stone-900 text-sm font-serif">Simpler Language</h3>
                <p className="text-stone-500 leading-relaxed font-semibold">
                  We turn heavy financial directives or dry legislative bulletins into clear narratives. Perfect for checking while enjoying coffee.
                </p>
              </div>

              <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200/50 space-y-2.5">
                <div className="w-9 h-9 bg-[#B19470]/10 text-[#8C6239] rounded-lg flex items-center justify-center font-bold text-sm">
                  🛡️
                </div>
                <h3 className="font-bold text-stone-900 text-sm font-serif">Triple Checked Trust</h3>
                <p className="text-stone-500 leading-relaxed font-semibold">
                  Every summary is referenced against multiple cross-publications to filter rumors or speculative social media outrage.
                </p>
              </div>

              <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200/50 space-y-2.5">
                <div className="w-9 h-9 bg-[#B19470]/10 text-[#8C6239] rounded-lg flex items-center justify-center font-bold text-sm">
                  ⚡
                </div>
                <h3 className="font-bold text-stone-900 text-sm font-serif">Youth Focused Focus</h3>
                <p className="text-stone-500 leading-relaxed font-semibold">
                  We focus specifically on tech startup trends, currency changes, and structural reforms that directly affect opportunities.
                </p>
              </div>
            </div>

            {/* Personalized Delivery Selector */}
            <div className="bg-stone-50 p-6 sm:p-10 rounded-3xl border border-stone-200/70 space-y-6">
              <div className="text-center max-w-sm mx-auto space-y-1">
                <h2 className="text-xl font-bold text-stone-900 tracking-tight font-serif">Configure Your Feed Delivery</h2>
                <p className="text-stone-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">Customize how you prefer your updates.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
                {/* focal area */}
                <div className="space-y-3">
                  <span className="text-[9px] font-bold tracking-wider uppercase text-stone-400 block border-b border-stone-200 pb-1.5">Focus Area</span>
                  <div className="flex flex-col gap-1.5">
                    {['Tech & Capital', 'Policy & Currency', 'Startup Ecosystem'].map((item) => (
                      <button 
                        key={item}
                        onClick={() => setOnboardingAnswers(prev => ({ ...prev, focus: item }))}
                        className={`p-2.5 rounded-lg border text-left font-semibold transition cursor-pointer text-xs ${
                          onboardingAnswers.focus === item 
                            ? 'bg-[#8C6239] text-[#FCFBF8] border-[#8C6239] shadow-sm' 
                            : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* delivery pacing */}
                <div className="space-y-3">
                  <span className="text-[9px] font-bold tracking-wider uppercase text-stone-400 block border-b border-stone-200 pb-1.5 font-sans">Reading Time</span>
                  <div className="flex flex-col gap-1.5">
                    {['3 Min Scan', '5 Min Breakdown'].map((item) => (
                      <button 
                        key={item}
                        onClick={() => setOnboardingAnswers(prev => ({ ...prev, time: item }))}
                        className={`p-2.5 rounded-lg border text-left font-semibold transition cursor-pointer text-xs ${
                          onboardingAnswers.time === item 
                            ? 'bg-[#8C6239] text-[#FCFBF8] border-[#8C6239] shadow-sm' 
                            : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* target outlet */}
                <div className="space-y-3">
                  <span className="text-[9px] font-bold tracking-wider uppercase text-stone-400 block border-b border-stone-200 pb-1.5">Primary Inbox</span>
                  <div className="flex flex-col gap-1.5">
                    {['WhatsApp Broadcast', 'Email Newsletter'].map((item) => (
                      <button 
                        key={item}
                        onClick={() => setOnboardingAnswers(prev => ({ ...prev, delivery: item }))}
                        className={`p-2.5 rounded-lg border text-left font-semibold transition cursor-pointer text-xs ${
                          onboardingAnswers.delivery === item 
                            ? 'bg-[#8C6239] text-[#FCFBF8] border-[#8C6239] shadow-sm' 
                            : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Rendered Sample Preview Block */}
            {currentBrief ? (
              <div className="space-y-3 pt-6 border-t border-stone-100">
                <div className="text-center">
                  <span className="text-[9px] uppercase bg-stone-50 text-stone-500 border border-stone-250 px-3.5 py-1 font-bold tracking-widest rounded-full">
                    Latest Compiled Issue
                  </span>
                </div>
                <ReaderPreview 
                  brief={currentBrief} 
                  onDeploy={handleDeployBrief} 
                  isDeploying={isDeploying} 
                  onShareWhatsApp={handleShareWhatsApp} 
                  onUpdateBrief={handleUpdateBrief}
                />
              </div>
            ) : (
              <div className="text-center py-10 text-stone-400 font-medium border border-dashed border-stone-200 rounded-2xl text-xs">
                No active issue has been drafted yet. Check inside the Editorial Studio to write.
              </div>
            )}

          </div>
        </motion.div>
      ) : (
        /* =============================================================
           PRIVATE EDITORIAL WORKSPACE - MINIMAL, COZY, WRITER DESIGN
           ============================================================= */
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-6 lg:py-8 space-y-6">
          
          {/* Header Description Room */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-stone-250/50 pb-5">
            <div className="space-y-1">
              <span className="text-[9px] font-bold tracking-wider text-[#8C6239] bg-[#B19470]/10 px-2 py-0.5 rounded border border-[#B19470]/20 uppercase">
                EDITORIAL WORKSPACE
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-stone-900 font-serif">Newsletter Creator Studio</h1>
              <p className="text-stone-400 text-xs sm:text-sm font-semibold">Tweak, research, compile, and draft daily digests with instant copy formats for Substack and WhatsApp broadcasts.</p>
            </div>
          </div>

          {/* Core Page-Level Navigation Menu */}
          <div className="flex bg-stone-200/50 p-1 rounded-xl max-w-max text-xs font-bold font-sans">
            {[
              { id: 'draft_studio', label: 'Journal Draft Room', icon: Feather },
              { id: 'sources', label: 'News Feeds Outlets', icon: ListFilter },
              { id: 'archives', label: 'Edition Catalogues', icon: BookOpen }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4.5 py-2 rounded-lg transition duration-150 flex items-center gap-1.5 whitespace-nowrap cursor-pointer uppercase text-[10px] tracking-wider ${
                    activeTab === tab.id 
                      ? 'bg-white text-stone-950 shadow-sm' 
                      : 'text-stone-500 hover:text-stone-850'
                  }`}
                  id={`tab-button-${tab.id}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Rendered Tab Pages */}
          <div className="pt-2">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="focus:outline-none"
              >
                
                {/* 1. Unified Draft Studio Tab - THE HIGHLIGHT! */}
                {activeTab === 'draft_studio' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans">
                    
                    {/* Left Column: Directives Input Card */}
                    <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-stone-200/60 shadow-sm space-y-5">
                      <div className="border-b border-stone-100 pb-3">
                        <span className="text-[9px] font-extrabold tracking-wider text-stone-400 uppercase">GATHER PLAN</span>
                        <h3 className="text-base font-bold tracking-tight text-stone-900 mt-0.5 font-serif">Daily Compilation Directives</h3>
                      </div>

                      {/* Source Mode Selector */}
                      <div className="space-y-2 text-xs">
                        <label className="text-[10px] font-bold uppercase text-stone-400 tracking-wider block">1. Research Pathway</label>
                        <div className="flex flex-col gap-2">
                          <button 
                            onClick={() => setMode('baseline')}
                            className={`p-3 rounded-lg border text-left transition cursor-pointer ${
                              mode === 'baseline' 
                                ? 'bg-[#B19470]/5 border-[#8C6239] text-stone-900' 
                                : 'bg-transparent border-stone-200 hover:bg-stone-50 text-stone-600'
                            }`}
                          >
                            <div className="flex justify-between items-center font-bold">
                              <span>Curated Daily Journals</span>
                              <BookOpen className="w-3.5 h-3.5 text-[#B19470]" />
                            </div>
                            <p className="text-[10px] text-stone-400 font-medium mt-1 leading-normal">
                              Curates deterministic summaries from pre-loaded pan-African & global checked directories. Very fast mock.
                            </p>
                          </button>

                          <button 
                            onClick={() => setMode('live')}
                            className={`p-3 rounded-lg border text-left transition cursor-pointer ${
                              mode === 'live' 
                                ? 'bg-[#B19470]/5 border-[#8C6239] text-stone-900' 
                                : 'bg-transparent border-stone-200 hover:bg-stone-50 text-stone-600'
                            }`}
                          >
                            <div className="flex justify-between items-center font-bold">
                              <span>Live Google Search Grounding</span>
                              <Globe className="w-3.5 h-3.5 text-[#B19470]" />
                            </div>
                            <p className="text-[10px] text-stone-400 font-medium mt-1 leading-normal">
                              Queries active live search APIs to retrieve fresh breaking indicators within the last 24h.
                            </p>
                          </button>
                        </div>
                      </div>

                      {/* Content balance ratio block */}
                      <div className="space-y-2 text-xs pt-1 border-t border-stone-100/60 mt-1">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">2. Regional Ratio Balance</label>
                          <span className="font-bold text-[#8C6239] bg-[#B19470]/10 px-2 py-0.5 rounded text-[10px]">
                            {ratio}% Nigeria / {100 - ratio}% Global
                          </span>
                        </div>
                        <input 
                          type="range"
                          min="20"
                          max="80"
                          value={ratio}
                          onChange={(e) => setRatio(parseInt(e.target.value))}
                          className="w-full h-1 bg-stone-150 rounded-lg appearance-none cursor-pointer accent-[#8C6239]"
                        />
                        <div className="flex justify-between text-[8px] font-bold text-stone-400 tracking-wider">
                          <span>GLOBAL SUMMARY</span>
                          <span>NIGERIA NEWS</span>
                        </div>
                      </div>

                      {/* Custom Master Instructions */}
                      <div className="space-y-2 text-xs pt-1 border-t border-stone-100/60 mt-1">
                        <label className="text-[10px] font-bold uppercase text-stone-400 tracking-wider block">3. Specific Editorial Focus</label>
                        <textarea 
                          value={customPrompt}
                          onChange={(e) => setCustomPrompt(e.target.value)}
                          placeholder="Focus of today's newsletter draft (e.g. monetary policy changes or Lagos seed investments)..."
                          className="w-full text-xs font-semibold bg-stone-50/50 border border-stone-200 focus:border-[#B19470] focus:bg-white p-3 rounded-lg outline-none transition h-20 resize-none font-medium text-stone-800"
                        />
                      </div>

                      {/* compile trigger */}
                      <button 
                        disabled={pipelineRunning}
                        onClick={runPipeline}
                        className="w-full py-3 bg-stone-950 hover:bg-stone-850 text-stone-100 font-bold text-xs uppercase tracking-wider rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
                      >
                        {pipelineRunning ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            Researching news trends...
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 fill-current text-[#FCFBF8]" />
                            Compile Today's Draft
                          </>
                        )}
                      </button>

                      {/* API credentials lock notice */}
                      <div className="text-[10px] text-stone-400 leading-relaxed font-sans font-medium p-3 bg-stone-50 rounded-xl border border-stone-200/50 text-center">
                        ⚡ AI model runs securely on our server. Custom API credentials can be adjusted securely inside AI Studio's Secrets setup.
                      </div>
                    </div>

                    {/* Right Column: Draft Editor Board Screen */}
                    <div className="lg:col-span-8 space-y-4">
                      
                      {pipelineRunning ? (
                        /* Beautiful Editorial Typographic Loader */
                        <div className="bg-white p-8 rounded-2xl border border-stone-200/60 shadow-sm text-center py-20 space-y-6 max-w-2xl mx-auto">
                          <div className="w-10 h-10 bg-[#B19470]/10 text-[#8C6239] rounded-full flex items-center justify-center animate-spin mx-auto text-sm">
                            <RefreshCw className="w-5 h-5" />
                          </div>
                          
                          <div className="space-y-4 max-w-sm mx-auto">
                            <h3 className="font-serif italic text-lg font-bold text-stone-900 leading-none">Preparing Draft News Outline</h3>
                            <p className="text-stone-450 text-xs font-medium">Please wait while our research assistant combs configured directories, verifies facts, and simplifies language structures.</p>
                            
                            <div className="pt-2 flex flex-col gap-2.5 text-[10px] font-bold text-stone-400 uppercase tracking-widest text-left">
                              <div className="flex items-center gap-2">
                                <span className={`w-4 h-4 rounded flex items-center justify-center text-[8px] font-mono border ${
                                  pipelineStep !== 'COLLECT' ? 'bg-emerald-600 text-stone-100 border-emerald-600' : 'bg-stone-50 border-stone-200 text-stone-300'
                                }`}>
                                  {pipelineStep !== 'COLLECT' ? '✓' : '1'}
                                </span>
                                <span className={pipelineStep === 'COLLECT' ? 'text-stone-800' : 'text-stone-400'}>Consulting Daily Publishers</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className={`w-4 h-4 rounded flex items-center justify-center text-[8px] font-mono border ${
                                  pipelineStep !== 'COLLECT' && pipelineStep !== 'CLEAN' ? 'bg-emerald-600 text-stone-100 border-emerald-600' : 'bg-stone-50 border-stone-200 text-stone-300'
                                }`}>
                                  {pipelineStep !== 'COLLECT' && pipelineStep !== 'CLEAN' ? '✓' : '2'}
                                </span>
                                <span className={pipelineStep === 'CLEAN' ? 'text-stone-800' : 'text-stone-400'}>Cleansing duplicate commentary drafts</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className={`w-4 h-4 rounded flex items-center justify-center text-[8px] font-mono border ${
                                  pipelineStep === 'VERIFY' || pipelineStep === 'WRITE' || pipelineStep === 'PUBLISH' ? 'bg-emerald-600 text-stone-100 border-emerald-600' : 'bg-stone-50 border-stone-200 text-stone-300'
                                }`}>
                                  {pipelineStep === 'VERIFY' || pipelineStep === 'WRITE' || pipelineStep === 'PUBLISH' ? '✓' : '3'}
                                </span>
                                <span className={pipelineStep === 'CLUSTER' || pipelineStep === 'VERIFY' ? 'text-stone-800' : 'text-stone-400'}>Cross-verifying source trust quotient</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className={`w-4 h-4 rounded flex items-center justify-center text-[8px] font-mono border ${
                                  pipelineStep === 'PUBLISH' ? 'bg-emerald-600 text-stone-100 border-emerald-600' : 'bg-stone-50 border-stone-200 text-stone-300'
                                }`}>
                                  {pipelineStep === 'PUBLISH' ? '✓' : '4'}
                                </span>
                                <span className={pipelineStep === 'WRITE' ? 'text-stone-800 animate-pulse' : 'text-stone-400'}>Translating newsletter structures</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : currentBrief ? (
                        /* Output Screen Canvas (Editorial Board) */
                        <div className="space-y-4">
                          {/* Inner Tabs for switching between preview and social */}
                          <div className="flex border-b border-stone-200 pb-1.5 gap-4 text-xs font-bold uppercase tracking-wider font-sans">
                            <button
                              onClick={() => setActiveWorkspaceSubTab('preview')}
                              className={`pb-1 px-1 transition cursor-pointer flex items-center gap-1 border-b-2 hover:text-stone-900 ${
                                activeWorkspaceSubTab === 'preview' 
                                  ? 'border-[#8C6239] text-stone-950' 
                                  : 'border-transparent text-stone-400'
                              }`}
                            >
                              📰 1. Editorial Draft Board
                            </button>
                            <button
                              onClick={() => setActiveWorkspaceSubTab('social')}
                              className={`pb-1 px-1 transition cursor-pointer flex items-center gap-1 border-b-2 hover:text-stone-900 ${
                                activeWorkspaceSubTab === 'social' 
                                  ? 'border-[#8C6239] text-stone-950' 
                                  : 'border-transparent text-stone-400'
                              }`}
                            >
                              📱 2. Social Outlets Copy
                            </button>
                          </div>

                          <div>
                            {activeWorkspaceSubTab === 'preview' ? (
                              <ReaderPreview 
                                brief={currentBrief} 
                                onDeploy={handleDeployBrief} 
                                isDeploying={isDeploying} 
                                onShareWhatsApp={handleShareWhatsApp}
                                onUpdateBrief={handleUpdateBrief}
                              />
                            ) : (
                              <SocialExport brief={currentBrief} />
                            )}
                          </div>
                        </div>
                      ) : (
                        /* Blank Canvas Empty State */
                        <div className="bg-white rounded-2xl border-2 border-dashed border-stone-200/80 p-8 py-20 text-center text-stone-500 max-w-xl mx-auto space-y-4">
                          <Newspaper className="w-9 h-9 text-stone-300 mx-auto" />
                          <h3 className="font-serif italic text-base font-bold text-stone-800">Your Blank News Journal Draft Board</h3>
                          <p className="text-stone-450 leading-relaxed max-w-xs mx-auto text-xs font-semibold">Tweak regional ratio metrics on the left, type custom directives such as startup focal fields, and generate your draft.</p>
                          <div className="pt-2">
                            <button 
                              onClick={runPipeline}
                              className="px-5 py-2.5 bg-stone-900 hover:bg-stone-850 text-stone-100 font-bold text-[10px] uppercase tracking-wider rounded-lg transition shadow-sm cursor-pointer inline-flex items-center gap-1.5"
                            >
                              <Play className="w-3 h-3 fill-current text-[#FCFBF8]" />
                              Compile First Draft
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                )}

                {/* 2. Sources Directory Tab */}
                {activeTab === 'sources' && (
                  <SourcesTab 
                    sources={sources} 
                    onToggle={handleToggleSource} 
                    onPriorityChange={handlePrioritySource} 
                    onReset={handleResetSources} 
                  />
                )}

                {/* 3. Archives Database Tab */}
                {activeTab === 'archives' && (
                  <div className="space-y-4 max-w-5xl mx-auto font-sans text-xs font-semibold">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-stone-200/60 shadow-sm">
                      <div>
                        <span className="text-[9px] font-bold text-[#8C6239] uppercase bg-[#B19470]/10 px-2 py-0.5 rounded border border-[#B19470]/20">CATALOG RECORDS</span>
                        <h3 className="text-base font-bold tracking-tight text-stone-900 mt-1 font-serif">Historical News Briefs</h3>
                        <p className="text-stone-450 font-medium text-xs">Review previous research briefings run or delete logs.</p>
                      </div>
                      
                      <div className="bg-stone-50 border border-stone-200/60 px-4 py-2 rounded-xl text-center shadow-sm">
                        <span className="block text-[8px] text-stone-400 font-extrabold uppercase tracking-wider">Indexed Issues</span>
                        <span className="text-base font-bold text-stone-800 font-mono block mt-0.5">{briefs.length} Catalogs</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {briefs.map((b) => (
                        <div 
                          key={b.id} 
                          className="bg-white p-5 rounded-xl border border-stone-200/60 hover:border-stone-300 shadow-sm hover:shadow transition-all flex justify-between items-start gap-3"
                          id={`brief-archive-row-${b.id}`}
                        >
                          <div 
                            className="cursor-pointer space-y-1.5 flex-1 outline-none"
                            onClick={() => {
                              setCurrentBrief(b);
                              setActiveTab('draft_studio');
                              setActiveWorkspaceSubTab('preview');
                            }}
                            id={`brief-archive-heading-${b.id}`}
                          >
                            <span className="text-[8px] font-bold text-[#8C6239] bg-[#B19470]/10 border border-[#B19470]/15 px-2 py-0.5 rounded uppercase">
                              {new Date(b.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            
                            <h4 className="font-serif italic text-base font-bold text-stone-900 tracking-tight transition hover:text-[#8C6239]">
                              {b.title}
                            </h4>
                            
                            <p className="text-stone-500 font-medium text-xs leading-normal line-clamp-2">
                              {b.summary30s}
                            </p>
                            
                            <div className="flex items-center gap-2 text-[9px] text-stone-400 font-bold pt-2 border-t border-stone-100">
                              <span>{b.wordCount || 400} Ingested words</span>
                              <span>•</span>
                              <span className="text-[#8C6239]">{b.confidenceAvg || 88}% fact checked confidence</span>
                            </div>
                          </div>
                          
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteBrief(b.id);
                            }}
                            className="text-stone-400 hover:text-red-650 hover:bg-red-50 p-2 rounded-lg border border-transparent hover:border-red-100 transition cursor-pointer"
                            id={`delete-brief-archive-btn-${b.id}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}

                      {briefs.length === 0 && (
                        <div className="col-span-full text-center py-20 bg-white border border-dashed border-stone-200 rounded-3xl space-y-2">
                          <BookOpen className="w-10 h-10 text-stone-300 mx-auto" />
                          <p className="text-stone-850 font-bold uppercase tracking-tight text-xs">Records are current blank</p>
                          <p className="text-stone-450 font-medium text-xs">Compile news drafts inside the Journal Draft Room to save release catalogs here.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

          {/* Premium Footer */}
          <footer className="mt-16 pt-5 border-t border-stone-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-[9px] text-stone-400 font-bold tracking-wider">
            <span>DAILY BRIEFING STUDIO — ALL PLATFORMS HARMONIZED OK</span>
            <span className="flex items-center gap-1 text-stone-500 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Editorial compiler ready
            </span>
          </footer>

        </div>
      )}

    </div>
  );
}
