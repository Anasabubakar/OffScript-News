import React, { useState } from 'react';
import { EditorialBrief } from '../types';
import { 
  Clipboard, Check, Phone, Instagram, FileText, 
  Feather, Film, ArrowRight, ArrowLeft, Eye, Code, Compass, MessageSquare
} from 'lucide-react';

interface SocialExportProps {
  brief: EditorialBrief;
}

type ChannelType = 'whatsapp' | 'instagram' | 'tiktok' | 'substack';

export default function SocialExport({ brief }: SocialExportProps) {
  const [activeChannel, setActiveChannel] = useState<ChannelType>('whatsapp');
  const [copied, setCopied] = useState<boolean>(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');

  // Helper to copy content to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  // Helper to strip markdown clutter from slide & video scripts
  const stripMarkdown = (text: string): string => {
    if (!text) return "";
    return text
      .replace(/^#+\s+/gm, '')                    // Strip headings like "## "
      .replace(/#+/g, '')                         // Strip any lingering hashes completely
      .replace(/\*\*/g, '')                       // Strip bold "**"
      .replace(/\*/g, '')                         // Strip bold "*"
      .replace(/_/g, '')                          // Strip italic "_"
      .replace(/~~/g, '')                         // Strip strikethroughs
      .replace(/`{1,3}/g, '')                     // Strip inline code blocks
      .replace(/^-\s+/gm, '• ')                   // Standardize list dots nicely
      .replace(/^\*\s+/gm, '• ')                  // Standardize alternate lists
      .replace(/[*#_~`]/g, '')                    // Hard fallback: purge any lingering markdown symbols
      .trim();
  };

  // WhatsApp styling parser for simulated user interface
  const parseWhatsAppFormatting = (text: string) => {
    if (!text) return "";
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      // Clean up markdown headers ##, ### or **## if they accidentally slipped in
      let cleanLine = line
        .replace(/^#+\s+/g, '')
        .replace(/\*\*#+\s+/g, '')
        .replace(/#+/g, '')                       // remove any lingering hashes
        .trim();
      
      // If the line is empty now, just return a small spacer to keep output readable
      if (!cleanLine) {
        return <div key={idx} className="h-2"></div>;
      }
      
      // Convert standard markdown bold **bold** to *bold*
      cleanLine = cleanLine.replace(/\*\*/g, '*');
      
      const tokens: { type: 'normal' | 'bold' | 'italic'; text: string }[] = [];
      let i = 0;
      let currentToken = "";
      
      while (i < cleanLine.length) {
        if (cleanLine[i] === '*') {
          if (currentToken) {
            tokens.push({ type: 'normal', text: currentToken });
            currentToken = "";
          }
          i++;
          let boldText = "";
          while (i < cleanLine.length && cleanLine[i] !== '*') {
            boldText += cleanLine[i];
            i++;
          }
          if (boldText) {
            tokens.push({ type: 'bold', text: boldText });
          }
          i++; // Skip closing *
        } else if (cleanLine[i] === '_') {
          if (currentToken) {
            tokens.push({ type: 'normal', text: currentToken });
            currentToken = "";
          }
          i++;
          let italicText = "";
          while (i < cleanLine.length && cleanLine[i] !== '_') {
            italicText += cleanLine[i];
            i++;
          }
          if (italicText) {
            tokens.push({ type: 'italic', text: italicText });
          }
          i++; // Skip closing _
        } else {
          currentToken += cleanLine[i];
          i++;
        }
      }
      
      if (currentToken) {
        tokens.push({ type: 'normal', text: currentToken });
      }

      return (
        <div key={idx} className="min-h-[1.2rem] py-0.5 leading-relaxed font-sans text-xs sm:text-[13px] text-stone-850">
          {tokens.map((token, tIdx) => {
            if (token.type === 'bold') {
              return <strong key={tIdx} className="font-extrabold text-stone-950">{token.text}</strong>;
            }
            if (token.type === 'italic') {
              return <em key={tIdx} className="italic text-stone-700 bg-stone-100/30 px-0.5 rounded font-medium">{token.text}</em>;
            }
            return <span key={tIdx}>{token.text}</span>;
          })}
        </div>
      );
    });
  };

  // Formulate Copy ready content based on channel type
  const getCopyableContent = (): string => {
    switch (activeChannel) {
      case 'whatsapp':
        return brief.formats.whatsapp;
      case 'instagram':
        return brief.formats.instagram.map((slide, i) => `[SLIDE ${i + 1}]\n${stripMarkdown(slide)}`).join('\n\n');
      case 'tiktok':
        const tk = brief.formats.tiktok;
        return `HOOK:\n${stripMarkdown(tk.hook)}\n\nVISUAL CUES:\n${tk.visualCues.map(c => `• ${stripMarkdown(c)}`).join('\n')}\n\nNARRATION SCRIPT:\n${stripMarkdown(tk.script)}`;
      case 'substack':
        return brief.formats.web;
      default:
        return "";
    }
  };

  // Simple HTML Substack Rich-Text Previewer of Raw Markdown
  const renderSubstackReview = (markdown: string) => {
    if (!markdown) return null;
    const lines = markdown.split('\n');
    return (
      <div className="space-y-4 max-w-xl mx-auto py-4 text-stone-800">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (trimmed.startsWith('## ') || trimmed.startsWith('⚡ ')) {
            return (
              <h2 key={idx} className="font-serif italic text-xl font-bold text-stone-900 border-b border-stone-100 pb-1 pt-3">
                {trimmed.replace(/^##\s+/, '')}
              </h2>
            );
          }
          if (trimmed.startsWith('### ')) {
            return (
              <h3 key={idx} className="font-sans text-sm font-bold tracking-tight text-[#8C6239] uppercase pt-2">
                {trimmed.replace(/^###\s+/, '')}
              </h3>
            );
          }
          if (trimmed.startsWith('* **') && trimmed.includes(':**')) {
            // Split up bullet with bold header
            const inside = trimmed.slice(2); // remove '* '
            const boldPart = inside.substring(2, inside.indexOf(':**') + 1);
            const remaining = inside.substring(inside.indexOf(':**') + 3);
            return (
              <p key={idx} className="text-xs sm:text-[13px] leading-relaxed pl-4 relative font-medium">
                <span className="absolute left-0 text-[#B19470]">•</span>
                <strong className="font-bold text-stone-950">{boldPart} </strong>
                <span className="text-stone-600">{remaining}</span>
              </p>
            );
          }
          if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
            return (
              <p key={idx} className="text-xs sm:text-[13px] leading-relaxed pl-4 relative font-medium text-stone-600">
                <span className="absolute left-0 text-[#B19470]">•</span>
                {trimmed.slice(2)}
              </p>
            );
          }
          if (trimmed === '---') {
            return <hr key={idx} className="border-stone-150 my-6" />;
          }
          if (trimmed === '') return <div key={idx} className="h-2"></div>;
          
          return (
            <p key={idx} className="text-xs sm:text-[13px] leading-relaxed font-sans text-stone-600 font-medium">
              {trimmed}
            </p>
          );
        })}
      </div>
    );
  };

  // Directory of channel objects for sidebar configuration
  const channels = [
    {
      id: 'whatsapp' as ChannelType,
      name: 'WhatsApp Broadcast',
      icon: Phone,
      description: 'Compact chat format with bullet triggers & bold asterisks.',
      badge: 'Group Channels & Communities',
      accentColor: 'border-emerald-500 hover:bg-emerald-50/20 text-emerald-700',
      activeColor: 'bg-emerald-50/70 border-emerald-500 ring-1 ring-emerald-500/20'
    },
    {
      id: 'instagram' as ChannelType,
      name: 'Instagram Slide Companion',
      icon: Instagram,
      description: 'Pristine slide-by-slide copy ready for graphic layouts.',
      badge: 'Carousels & Social Feeds',
      accentColor: 'border-pink-500 hover:bg-pink-50/20 text-pink-700',
      activeColor: 'bg-pink-550/5 border-pink-500 ring-1 ring-pink-500/20'
    },
    {
      id: 'tiktok' as ChannelType,
      name: 'TikTok & Reels Audio Script',
      icon: Film,
      description: 'Paced vertical short script with live screen guidelines.',
      badge: 'Vertical Reels & Audio Notes',
      accentColor: 'border-stone-800 hover:bg-stone-100 text-stone-900',
      activeColor: 'bg-stone-50 border-stone-800 ring-1 ring-stone-800/20'
    },
    {
      id: 'substack' as ChannelType,
      name: 'Substack & Newsletter Blog',
      icon: FileText,
      description: 'Rich plain markdown structured with dividers & bibliography.',
      badge: 'Deep-Dive Publications',
      accentColor: 'border-amber-600 hover:bg-amber-50/20 text-amber-800',
      activeColor: 'bg-amber-500/5 border-amber-600 ring-1 ring-amber-655/20'
    }
  ];

  const currentChannelObj = channels.find(c => c.id === activeChannel)!;

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-4">
      
      {/* Dynamic Header Block */}
      <div className="bg-[#FAF9F5] p-5.5 sm:p-7 rounded-2xl border border-stone-200/80 relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <span className="text-[9px] font-bold tracking-widest bg-stone-900 text-[#FCFBF8] px-3 py-0.5 rounded-full uppercase block w-max">
            FORMAT HARMONIZER
          </span>
          <h2 className="text-xl font-bold tracking-tight text-stone-950 flex items-center gap-2 mt-1.5 font-serif">
            <Feather className="w-5 h-5 text-[#8C6239]" />
            Delivery Outlets Hub
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm font-medium">
            This issue is compiled and custom-formatted across separate social and publishing targets. Switch channels below to review and broadcast.
          </p>
        </div>
      </div>

      {/* Main Two Column Layout split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN: Clean directory sidebar selection */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider pl-1 font-mono">
            SELECT DISTRIBUTION OUTLET
          </span>
          
          <div className="space-y-2.5">
            {channels.map((ch) => {
              const Icon = ch.icon;
              const isActive = activeChannel === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => {
                    setActiveChannel(ch.id);
                    setSlideIndex(0);
                  }}
                  className={`w-full text-left p-4.5 rounded-2xl border transition-all duration-200 cursor-pointer flex gap-3.5 relative ${
                    isActive 
                      ? ch.activeColor 
                      : 'bg-white border-stone-200/75 hover:border-stone-300 hover:shadow-sm'
                  }`}
                  id={`nav-channel-${ch.id}`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                    isActive ? 'bg-stone-900 text-[#FCFBF8]' : 'bg-stone-50 text-stone-550'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  
                  <div className="space-y-1 pr-2 flex-1 min-w-0">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#8C6239] block truncate">
                      {ch.badge}
                    </span>
                    <h4 className="font-bold text-stone-900 text-xs leading-none">
                      {ch.name}
                    </h4>
                    <p className="text-stone-400 text-[10px] sm:text-xs font-semibold leading-normal line-clamp-2">
                      {ch.description}
                    </p>
                  </div>
                  
                  {isActive && (
                    <div className="absolute right-4.5 top-1/2 -translate-y-1/2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#8C6239] animate-ping"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="bg-white/80 border border-stone-250/50 p-4 rounded-2xl text-[10px] text-stone-400 leading-relaxed font-sans font-medium text-center">
            💡 Tap any card to review its specific formatted file. Changes made in the <strong>Editorial Studio</strong> text inputs sync here instantly.
          </div>
        </div>

        {/* RIGHT COLUMN: Spacieux Device Layout with simulated display & copy tools */}
        <div className="lg:col-span-8 bg-white border border-stone-200/60 rounded-2xl shadow-sm flex flex-col overflow-hidden min-h-[660px]">
          
          {/* Top Control Header Toolbar */}
          <div className="bg-stone-50/80 px-5.5 py-4 border-b border-stone-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="space-y-0.5">
              <span className="text-[8px] font-mono font-bold tracking-widest text-stone-400 uppercase">
                Active Broadcast Canvas
              </span>
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5 font-serif">
                <currentChannelObj.icon className="w-4 h-4 text-[#8C6239]" />
                {currentChannelObj.name}
              </h3>
            </div>

            {/* View Mode Toggle and Copy Action Button */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto self-stretch sm:self-auto justify-end">
              {/* Output Preview Toggle */}
              <div className="bg-stone-200/50 p-0.5 rounded-lg flex text-[10px] font-bold uppercase tracking-wider">
                <button
                  onClick={() => setViewMode('preview')}
                  className={`px-3 py-1.5 rounded-md flex items-center gap-1 transition ${
                    viewMode === 'preview' 
                      ? 'bg-white text-stone-900 shadow-xs' 
                      : 'text-stone-500 hover:text-stone-850 cursor-pointer'
                  }`}
                  id="mode-toggle-preview"
                >
                  <Eye className="w-3 h-3" /> Preview
                </button>
                <button
                  onClick={() => setViewMode('code')}
                  className={`px-3 py-1.5 rounded-md flex items-center gap-1 transition ${
                    viewMode === 'code' 
                      ? 'bg-white text-stone-900 shadow-xs' 
                      : 'text-stone-500 hover:text-stone-850 cursor-pointer'
                  }`}
                  id="mode-toggle-code"
                >
                  <Code className="w-3 h-3" /> Code Copy
                </button>
              </div>

              {/* Ready copy button */}
              <button
                onClick={() => copyToClipboard(getCopyableContent())}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  copied 
                    ? 'bg-emerald-50 text-emerald-850 border-emerald-250' 
                    : 'bg-stone-900 hover:bg-stone-800 text-stone-100 border-stone-900 shadow-xs'
                }`}
                id="channel-copy-action"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Clipboard className="w-3.5 h-3.5" />
                    Copy Draft
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Description line of the format type */}
          <div className="bg-stone-50/30 px-6 py-2 border-b border-stone-100 text-[10px] text-stone-400 font-bold tracking-wide uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B19470]"></span>
            {activeChannel === 'whatsapp' && 'Output strips double headings and exposes smart WhatsApp parameters (*bold* / _italics_).'}
            {activeChannel === 'instagram' && 'Slide deck strings parsed of all residual asterisks & hashtags. Ready to style.'}
            {activeChannel === 'tiktok' && 'Full visual pacing scripts customized for continuous speech and short screen attention spans.'}
            {activeChannel === 'substack' && 'Perfect Substack editor blocks. Pre-parsed formatting with tidy headers.'}
          </div>

          {/* Active Canvas Body based on Toggle and Selection */}
          <div className="flex-1 p-6 sm:p-8 bg-stone-50/20 overflow-y-auto max-h-[580px]">
            
            {viewMode === 'code' ? (
              /* RAW COPYABLE CODE VIEW MODE */
              <div className="h-full flex flex-col space-y-3">
                <span className="text-[9px] font-semibold text-stone-400 font-mono tracking-widest uppercase block">
                  RAW DOCUMENT COMPILER CODE
                </span>
                <div className="flex-1 bg-stone-900 text-stone-200 p-5 rounded-2xl border border-stone-850 font-mono text-[11px] whitespace-pre-wrap overflow-y-auto min-h-[450px] shadow-inner leading-relaxed select-all">
                  {getCopyableContent()}
                </div>
              </div>
            ) : (
              /* ACTIVE CHANNEL HIGH-FIDELITY PREVIEW VIEW MODE */
              <div className="h-full">
                
                {/* 1. WHATSAPP LIVE CELL PHONE PREVIEW */}
                {activeChannel === 'whatsapp' && (
                  <div className="max-w-md mx-auto bg-[#ECE5DD] rounded-[32px] border-4 border-stone-800 shadow-xl overflow-hidden flex flex-col h-[500px]">
                    {/* Simulated Phone Top Header */}
                    <div className="bg-[#075E54] px-4 py-3.5 flex items-center justify-between text-white flex-shrink-0">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-600/70 border border-emerald-500/30 flex items-center justify-center font-bold text-xs font-serif text-[#FCFBF8]">
                          BJ
                        </div>
                        <div className="leading-tight">
                          <h4 className="font-bold text-xs">Briefly Daily Broadcast</h4>
                          <span className="text-[8px] text-stone-250 font-medium">98 subscribers • Online</span>
                        </div>
                      </div>
                      <div className="text-[10px] font-semibold text-stone-350 bg-stone-900/10 px-2 py-0.5 rounded">
                        ✓ VERIFIED
                      </div>
                    </div>

                    {/* Chat Area Scrollable */}
                    <div className="flex-1 p-3.5 overflow-y-auto space-y-3 relative flex flex-col">
                      <div className="text-center self-center my-1">
                        <span className="bg-[#DCEFDC] text-stone-700 text-[8px] sm:text-[9px] font-bold px-3 py-0.5 rounded shadow-xs tracking-wide border border-emerald-100">
                          TODAY • BROADCAST LAUNCH
                        </span>
                      </div>
                      
                      {/* Interactive WhatsApp bubble */}
                      <div className="bg-white p-4 rounded-xl shadow-xs border border-stone-200 relative max-w-[85%] self-end">
                        <div className="text-[10px] font-bold text-[#075E54] tracking-wide mb-1 border-b border-stone-50 pb-1">
                          ⚡ Briefly Digest Editorial
                        </div>
                        
                        <div className="space-y-0.5">
                          {parseWhatsAppFormatting(brief.formats.whatsapp)}
                        </div>
                        
                        <div className="text-[8px] text-stone-400 text-right mt-1.5 font-mono">
                          9:41 AM ✓✓
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. INSTAGRAM SLIDE COMPONENT CAROUSEL CARDS */}
                {activeChannel === 'instagram' && (
                  <div className="max-w-md mx-auto space-y-4">
                    {/* Visual Slide */}
                    <div className="aspect-square bg-stone-900 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between border-2 border-stone-850 shadow-lg text-white">
                      {/* Background branding lines */}
                      <div className="absolute inset-0 bg-radial-gradient from-stone-850 to-stone-950 opacity-40"></div>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#B19470] rounded-full blur-[80px] opacity-15"></div>
                      
                      <div className="relative z-10 flex justify-between items-center text-[9px] font-mono tracking-widest text-[#B19470] font-bold">
                        <span>BRIEFLY NEWS OS JOURNAL</span>
                        <span className="bg-[#8C6239] text-[#FCFBF8] px-2.5 py-0.5 rounded font-sans uppercase">
                          Slide {slideIndex + 1} / {brief.formats.instagram.length}
                        </span>
                      </div>

                      <div className="relative z-10 flex-1 flex flex-col justify-center py-4 space-y-3.5">
                        {/* Title of the card parse */}
                        <div className="text-sm font-sans tracking-wide text-stone-300 font-bold uppercase border-b border-stone-800 pb-2 mb-1 flex items-center gap-1.5">
                          <Instagram className="w-4 h-4 text-pink-500" />
                          Slide Insight Card
                        </div>
                        
                        <p className="text-base sm:text-lg font-serif italic font-bold leading-relaxed text-[#FCFBF8]">
                          {stripMarkdown(brief.formats.instagram[slideIndex])}
                        </p>
                      </div>

                      <div className="relative z-10 pt-3 border-t border-stone-850 flex justify-between items-center text-[10px] text-stone-450 font-semibold font-sans">
                        <span>Swipe to read next ➔</span>
                        <span className="text-[#B19470] font-mono">STAY SMART.</span>
                      </div>
                    </div>

                    {/* Carousel navigation controls and indicators */}
                    <div className="flex justify-between items-center sm:px-2">
                      <button 
                        onClick={() => setSlideIndex(prev => Math.max(0, prev - 1))}
                        disabled={slideIndex === 0}
                        className="px-4 py-2 text-xs font-bold text-stone-600 background-white border border-stone-200 rounded-xl hover:bg-stone-50 cursor-pointer disabled:opacity-40 select-none flex items-center gap-1 transition"
                        id="insta-slide-prev"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Previous
                      </button>

                      {/* Dot indicators */}
                      <div className="flex gap-1.5">
                        {brief.formats.instagram.map((_, i) => (
                          <div 
                            key={i} 
                            onClick={() => setSlideIndex(i)}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                              slideIndex === i ? 'bg-[#8C6239] w-3.5' : 'bg-stone-300 hover:bg-stone-400'
                            }`}
                          />
                        ))}
                      </div>

                      <button 
                        onClick={() => setSlideIndex(prev => Math.min(brief.formats.instagram.length - 1, prev + 1))}
                        disabled={slideIndex === brief.formats.instagram.length - 1}
                        className="px-4 py-2 text-xs font-bold text-stone-600 background-white border border-stone-200 rounded-xl hover:bg-stone-50 cursor-pointer disabled:opacity-40 select-none flex items-center gap-1 transition"
                        id="insta-slide-next"
                      >
                        Next <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. TIKTOK & REELS TELEPROMPTER SCRIPT VIEW */}
                {activeChannel === 'tiktok' && (
                  <div className="max-w-md mx-auto bg-stone-950 rounded-3xl p-6.5 text-stone-300 border-2 border-stone-850 shadow-xl space-y-4.5 h-[500px] overflow-y-auto">
                    
                    {/* Visual header */}
                    <div className="flex justify-between items-center border-b border-stone-850 pb-2">
                      <span className="text-[#8C6239] font-bold text-[9px] uppercase tracking-widest font-mono">
                        🎬 Production Script
                      </span>
                      <span className="bg-red-600 text-white font-bold text-[8px] font-sans px-2 py-0.5 rounded tracking-wide animate-pulse">
                        REC DIRECTIVE
                      </span>
                    </div>

                    <div className="space-y-4 font-sans text-xs">
                      {/* Hook block */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block font-mono">
                          ★ First 3s Hook Line:
                        </span>
                        <div className="p-3 bg-stone-900 border border-stone-850 rounded-xl">
                          <p className="font-bold text-stone-100 italic leading-relaxed text-xs">
                            "{stripMarkdown(brief.formats.tiktok.hook)}"
                          </p>
                        </div>
                      </div>

                      {/* Visual Cues */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-[#B19470] uppercase tracking-widest block font-mono">
                          🎥 Camera Screen Cues:
                        </span>
                        <div className="flex flex-col gap-1.5">
                          {brief.formats.tiktok.visualCues && brief.formats.tiktok.visualCues.map((cue, idx) => (
                            <div key={idx} className="bg-stone-900 border border-stone-850 p-2.5 rounded-lg text-stone-300 text-[10px] font-medium flex items-center gap-2">
                              <span className="text-[#8C6239] font-bold font-mono">CUE {idx + 1}:</span>
                              <span>{stripMarkdown(cue)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Narrator Dialogue Speech Script */}
                      <div className="space-y-1.5 pt-2 border-t border-stone-850">
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest block font-mono">
                          🎤 Narrator Teleprompter Lines:
                        </span>
                        <div className="bg-stone-900/40 p-3.5 border border-stone-850/50 rounded-xl">
                          <p className="text-stone-100 font-medium whitespace-pre-wrap text-[11px] sm:text-xs leading-relaxed">
                            {stripMarkdown(brief.formats.tiktok.script)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. SUBSTACK & NEWSLETTER RICH HTML REVIEWER */}
                {activeChannel === 'substack' && (
                  <div className="bg-[#FCFBF9] p-6.5 sm:p-9 border border-stone-250/50 rounded-3xl shadow-sm text-stone-800 font-sans min-h-[350px]">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4.5">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-amber-600 text-[#FCFBF8] font-bold text-[10px] rounded-sm flex items-center justify-center font-serif">
                          S
                        </div>
                        <span className="text-[9px] tracking-widest font-extrabold uppercase text-stone-400">
                          Substack publication view
                        </span>
                      </div>
                      <span className="text-[9px] text-stone-450 font-bold uppercase">
                        {brief.wordCount || 450} words • Draft saved
                      </span>
                    </div>

                    {/* Styled Reader Review Component mapping */}
                    <div className="max-h-[460px] overflow-y-auto pr-1">
                      {renderSubstackReview(brief.formats.web)}
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

          {/* Action Footer info */}
          <div className="bg-stone-50 px-5.5 py-3 border-t border-stone-150 flex justify-between items-center text-[9px] text-stone-450 font-bold tracking-wider uppercase font-sans flex-shrink-0">
            <span>Harmonizer State: SYNCED</span>
            <span className="text-[#8C6239]">Briefly News OS © 2026</span>
          </div>
          
        </div>

      </div>

    </div>
  );
}
