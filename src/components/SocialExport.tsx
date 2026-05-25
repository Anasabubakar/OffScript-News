import React, { useState } from 'react';
import { EditorialBrief } from '../types';
import { Clipboard, CheckCircle2, Phone, Instagram, FileText, Feather, Film, ArrowRight, ArrowLeft } from 'lucide-react';

interface SocialExportProps {
  brief: EditorialBrief;
}

export default function SocialExport({ brief }: SocialExportProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(key);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      
      {/* Overview */}
      <div className="bg-[#FAF9F5] p-6 sm:p-8 rounded-2xl border border-stone-200/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
        <div className="space-y-1">
          <span className="text-[10px] font-bold tracking-widest bg-stone-900 text-[#FCFBF8] px-3.5 py-1 rounded-full uppercase block w-max">
            DRAFT EXPORT HUB
          </span>
          <h2 className="text-xl font-bold tracking-tight text-stone-950 flex items-center gap-2 mt-1.5 font-serif">
            <Feather className="w-5 h-5 text-[#8C6239]" />
            Your Copy-Ready Channels
          </h2>
          <p className="text-stone-500 text-xs sm:text-sm font-medium">
            Your compiled issue has been automatically formatted for various publication platforms. Tweak and copy any format directly to broadcast to your readers.
          </p>
        </div>
      </div>

      {/* Grid of Outputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* WhatsApp Broadcast Client Mockup */}
        <div className="bg-white rounded-2xl border border-stone-200/60 p-6 space-y-4 text-stone-800 shadow-sm">
          <div className="flex justify-between items-center pb-3 border-b border-stone-100">
            <h3 className="font-bold text-stone-800 flex items-center gap-2 text-xs uppercase tracking-wider">
              <Phone className="w-4 h-4 text-emerald-600" />
              WhatsApp Broadcast Draft
            </h3>
            
            <button 
              onClick={() => copyToClipboard(brief.formats.whatsapp, 'whatsapp')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                copiedSection === 'whatsapp' 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                  : 'bg-stone-50 hover:bg-stone-100/80 text-stone-700 border border-stone-200'
              }`}
              id="copy-whatsapp-btn"
            >
              {copiedSection === 'whatsapp' ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Clipboard className="w-4 h-4 text-stone-400" />
                  Copy Text
                </>
              )}
            </button>
          </div>

          <p className="text-stone-500 text-xs font-medium leading-relaxed">
            Formatted with asterisks (<strong className="text-stone-850">*bold*</strong>) and underscores (<em className="text-stone-850">_italics_</em>) optimized for immediate WhatsApp group chat propagation.
          </p>

          {/* Simulated WhatsApp Chat Bubble */}
          <div className="bg-stone-50/50 border border-stone-150 rounded-2xl p-4.5 h-80 overflow-y-auto font-sans relative">
            <div className="text-center mb-3">
              <span className="bg-stone-200/50 text-stone-600 text-[8px] font-bold px-2.5 py-0.5 tracking-wider rounded-full inline-block">
                PREVIEW BROADCAST DIALOG
              </span>
            </div>
            
            <div className="bg-white p-4 rounded-xl border border-stone-200/50 text-stone-800 text-xs font-sans space-y-2.5 whitespace-pre-wrap max-w-sm ml-auto relative shadow-sm leading-relaxed">
              {brief.formats.whatsapp}
              <div className="text-[9px] text-stone-400 text-right mt-2 font-mono">
                9:41 AM ✓✓
              </div>
            </div>
          </div>
        </div>

        {/* Instagram Slide Carousel Designer */}
        <div className="bg-white rounded-2xl border border-stone-200/60 p-6 space-y-4 text-stone-800 shadow-sm">
          <div className="flex justify-between items-center pb-3 border-b border-stone-100">
            <h3 className="font-bold text-stone-800 flex items-center gap-2 text-xs uppercase tracking-wider">
              <Instagram className="w-4 h-4 text-[#C13584]" />
              Instagram Carousel Companion
            </h3>
            
            <button 
              onClick={() => copyToClipboard(brief.formats.instagram.join("\n\n"), 'instagram')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                copiedSection === 'instagram' 
                  ? 'bg-pink-50 text-[#C13584] border border-pink-200' 
                  : 'bg-stone-50 hover:bg-stone-100/80 text-stone-700 border border-stone-200'
              }`}
              id="copy-instagram-btn"
            >
              {copiedSection === 'instagram' ? <CheckCircle2 className="w-4 h-4 text-pink-550" /> : <Clipboard className="w-4 h-4 text-stone-400" />}
              {copiedSection === 'instagram' ? 'Copied!' : 'Copy Slides'}
            </button>
          </div>

          <p className="text-stone-500 text-xs font-medium leading-relaxed">
            Spacious, pre-spaced story scripts formatted for graphic slides or multi-card posts. Slide outlines shown below.
          </p>

          {/* Interactive Slide Deck Mockup */}
          <div className="bg-stone-900 rounded-2xl p-5 h-80 flex flex-col justify-between text-stone-200 relative shadow-inner overflow-hidden border border-stone-850">
            {/* Slide Count */}
            <div className="flex justify-between items-center text-[9px] font-mono tracking-widest text-stone-400 font-bold uppercase">
              <span>SOCIAL CAROUSEL COMPANION</span>
              <span className="bg-[#B19470] text-stone-950 px-2.5 py-0.5 rounded font-bold">
                Slide {slideIndex + 1} / {brief.formats.instagram.length}
              </span>
            </div>

            {/* Slide Body */}
            <div className="flex-1 flex flex-col justify-center py-2 space-y-2 whitespace-pre-wrap overflow-y-auto">
              <p className="text-xs sm:text-sm font-sans text-stone-100 leading-relaxed font-semibold">
                {brief.formats.instagram[slideIndex]}
              </p>
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center pt-3 border-t border-stone-800">
              <button 
                onClick={() => setSlideIndex(prev => Math.max(0, prev - 1))}
                disabled={slideIndex === 0}
                className="px-2.5 py-1.5 text-[11px] font-semibold uppercase hover:text-white disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 rounded border border-stone-700 bg-stone-850 cursor-pointer text-stone-300 transition-all"
                id="prev-slide-btn"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Prev
              </button>
              
              <button 
                onClick={() => setSlideIndex(prev => Math.min(brief.formats.instagram.length - 1, prev + 1))}
                disabled={slideIndex === brief.formats.instagram.length - 1}
                className="px-2.5 py-1.5 text-[11px] font-semibold uppercase hover:text-white disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 rounded border border-stone-700 bg-stone-850 cursor-pointer text-stone-300 transition-all"
                id="next-slide-btn"
              >
                Next <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* TikTok / Reels Script Screen */}
        <div className="bg-white rounded-2xl border border-stone-200/60 p-6 space-y-4 text-stone-800 shadow-sm">
          <div className="flex justify-between items-center pb-3 border-b border-stone-100">
            <h3 className="font-bold text-stone-800 flex items-center gap-2 text-xs uppercase tracking-wider">
              <Film className="w-4 h-4 text-[#8C6239]" />
              TikTok & Reels Audio Script
            </h3>
            
            <button 
              onClick={() => copyToClipboard(`HOOK:\n${brief.formats.tiktok.hook}\n\nSCRIPT:\n${brief.formats.tiktok.script}`, 'tiktok')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                copiedSection === 'tiktok' 
                  ? 'bg-stone-100 text-[#8C6239] border border-stone-200' 
                  : 'bg-stone-50 hover:bg-stone-100/80 text-stone-700 border border-stone-200'
              }`}
              id="copy-tiktok-btn"
            >
              {copiedSection === 'tiktok' ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Clipboard className="w-4 h-4 text-stone-400" />
                  Copy Script
                </>
              )}
            </button>
          </div>

          <p className="text-stone-500 text-xs font-medium leading-relaxed">
            Cozy vertical video prompts incorporating visual cues, active outlines, and clear spoken dialogs for engaging youth video content.
          </p>

          {/* Script Teleprompter UI */}
          <div className="bg-stone-950 rounded-2xl p-4.5 h-8 w-80 text-stone-350 overflow-y-auto font-mono text-xs border border-stone-850 space-y-3.5">
            <div>
              <span className="text-[#B19470] font-bold uppercase tracking-wider block text-[9px] mb-1">
                ⭐ Intro Hook (First 3s)
              </span>
              <p className="bg-stone-900 border border-stone-850 p-2.5 rounded-lg text-stone-200 font-semibold italic">
                "{brief.formats.tiktok.hook}"
              </p>
            </div>

            <div>
              <span className="text-stone-400 font-bold uppercase tracking-wider block text-[9px] mb-1">
                🎬 Screen Cues & Visual Framing
              </span>
              <div className="flex flex-col gap-1">
                {brief.formats.tiktok.visualCues && brief.formats.tiktok.visualCues.map((cue, idx) => (
                  <span key={idx} className="bg-stone-900 text-stone-300 px-2.5 py-1.5 rounded text-[10px] block border border-stone-850">
                    {cue}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2.5 border-t border-stone-850">
              <span className="text-stone-400 font-bold uppercase tracking-wider block text-[9px] mb-1">
                🎤 Dialogue Dialogue Script
              </span>
              <p className="text-stone-200 font-sans font-medium whitespace-pre-wrap text-xs leading-relaxed">
                {brief.formats.tiktok.script}
              </p>
            </div>
          </div>
        </div>

        {/* Website Raw Markdown Export */}
        <div className="bg-white rounded-2xl border border-stone-200/60 p-6 space-y-4 text-stone-800 shadow-sm">
          <div className="flex justify-between items-center pb-3 border-b border-stone-100">
            <h3 className="font-bold text-stone-800 flex items-center gap-2 text-xs uppercase tracking-wider">
              <FileText className="w-4 h-4 text-stone-600" />
              Substack & Blog Markdown 
            </h3>
            
            <button 
              onClick={() => copyToClipboard(brief.formats.web, 'markdown')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                copiedSection === 'markdown' 
                  ? 'bg-amber-50 text-[#8C6239] border border-amber-200' 
                  : 'bg-stone-50 hover:bg-stone-100/80 text-stone-700 border border-stone-200'
              }`}
              id="copy-markdown-btn"
            >
              {copiedSection === 'markdown' ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#8C6239]" />
                  Copied!
                </>
              ) : (
                <>
                  <Clipboard className="w-4 h-4 text-stone-400" />
                  Copy Markdown
                </>
              )}
            </button>
          </div>

          <p className="text-stone-500 text-xs font-medium leading-relaxed">
            Pristine plain markdown layout. Fits perfectly for copy-pasting directly into Substack, beehiiv, Mailchimp, or standard CMS systems.
          </p>

          <div className="bg-stone-50/50 border border-stone-200/50 rounded-2xl p-4 h-80 overflow-y-auto font-mono text-[11px] text-stone-700 leading-relaxed">
            <pre className="whitespace-pre-wrap">{brief.formats.web}</pre>
          </div>
        </div>

      </div>
    </div>
  );
}
