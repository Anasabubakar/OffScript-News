import React, { useState } from 'react';
import { EditorialBrief, EditorialSegment } from '../types';
import { Calendar, CheckCircle, FileText, Share2, Clock, CornerDownRight, MessageCircle, Edit3, Eye, FileSignature, Check } from 'lucide-react';

interface ReaderPreviewProps {
  brief: EditorialBrief;
  onDeploy: (destination: 'website' | 'newsletter') => void;
  isDeploying: boolean;
  onShareWhatsApp: () => void;
  onUpdateBrief: (newBrief: EditorialBrief) => void;
}

export default function ReaderPreview({ brief, onDeploy, isDeploying, onShareWhatsApp, onUpdateBrief }: ReaderPreviewProps) {
  const [isEditing, setIsEditing] = useState(false);

  const getConfidenceLevel = (score: number) => {
    if (score >= 90) return { label: 'Verified Integrity', color: 'bg-emerald-50/60 text-emerald-800 border-emerald-100/85' };
    if (score >= 75) return { label: 'Good Confidence', color: 'bg-amber-50/60 text-amber-800 border-amber-100/85' };
    return { label: 'Editorial Caution', color: 'bg-rose-50/60 text-rose-800 border-rose-100/85' };
  };

  const confidence = getConfidenceLevel(brief.confidenceAvg);

  // Helper updates
  const updateMainBriefStr = (field: 'title' | 'summary30s', val: string) => {
    onUpdateBrief({
      ...brief,
      [field]: val
    });
  };

  const updateBigStory = (field: keyof EditorialSegment, val: string) => {
    if (!brief.segments.bigStory) return;
    onUpdateBrief({
      ...brief,
      segments: {
        ...brief.segments,
        bigStory: {
          ...brief.segments.bigStory,
          [field]: val
        }
      }
    });
  };

  const updateSegment = (category: 'nigeria' | 'africa' | 'world' | 'watchlist', idx: number, field: keyof EditorialSegment, val: string) => {
    const list = [...(brief.segments[category] || [])];
    if (!list[idx]) return;
    list[idx] = {
      ...list[idx],
      [field]: val
    };
    onUpdateBrief({
      ...brief,
      segments: {
        ...brief.segments,
        [category]: list
      }
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      
      {/* Editorial Controls Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-stone-900 text-stone-100 p-5 rounded-2xl border border-stone-800 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#B19470] animate-pulse"></span>
            <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">
              NEWSLETTER COMPILER
            </span>
          </div>
          <h3 className="text-sm sm:text-base font-semibold text-stone-100 tracking-tight font-sans">
            Ready to structure, polish, and publish
          </h3>
        </div>
        
        <div className="flex flex-wrap gap-2.5 w-full sm:w-auto">
          {/* Toggle Editing Button */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
              isEditing 
                ? 'bg-[#B19470] text-stone-950 border-[#B19470] hover:bg-[#c4a984]' 
                : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700'
            }`}
            id="toggle-edit-mode-btn"
          >
            {isEditing ? (
              <>
                <Eye className="w-3.5 h-3.5" />
                Finish Editing Draft
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5" />
                Edit Text Draft Inline
              </>
            )}
          </button>

          {/* Deploy Button */}
          <button 
            disabled={isDeploying}
            onClick={() => onDeploy('newsletter')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-950 text-xs font-bold rounded-xl shadow-sm cursor-pointer transition-all disabled:opacity-50"
            id="publish-brief-btn"
          >
            {isDeploying ? (
              <span className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin"></span>
                Publishing...
              </span>
            ) : (
              <>
                <Check className="w-3.5 h-3.5 text-stone-950" />
                Publish Newsletter Live
              </>
            )}
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="p-4 bg-amber-50/50 border border-amber-100/60 rounded-xl text-stone-800 text-xs flex items-start gap-2.5">
          <FileSignature className="w-4 h-4 text-[#8C6239] mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-bold text-[#8C6239]">Editorial In-Line Focus Mode Active</p>
            <p className="text-stone-600 mt-0.5 font-medium">Click and type directly into any article headline, news paragraph, or social vibe comment below. All changes automatically sync with your copyable WhatsApp and Substack channel drafts!</p>
          </div>
        </div>
      )}

      {/* Actual Reader Canvas */}
      <div className="bg-white text-slate-800 border border-stone-200/60 p-6 sm:p-12 rounded-3xl shadow-[0_4px_24px_rgba(131,121,111,0.03)] space-y-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-3 pb-8 border-b border-stone-100">
          {isEditing ? (
            <input
              type="text"
              value={brief.title || ''}
              onChange={(e) => updateMainBriefStr('title', e.target.value)}
              className="text-center font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-950 bg-amber-50/20 border-b border-dashed border-amber-250 focus:border-amber-400 focus:outline-none p-1.5 w-full max-w-xl mx-auto rounded"
              placeholder="Newsletter Issue Title..."
            />
          ) : (
            <h1 className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-none">
              {brief.title || "The Daily Briefing"}
            </h1>
          )}
          
          <p className="font-semibold text-[10px] tracking-widest uppercase text-stone-400 max-w-md mx-auto">
            SIMPLE, HUMAN-FRIENDLY DIGITAL NEWS JOURNAL
          </p>

          <div className="flex flex-wrap justify-center items-center gap-2 pt-2 text-[10px] font-bold text-stone-500">
            <span className="flex items-center gap-1 bg-stone-50 border border-stone-100 px-3 py-1 rounded-full uppercase">
              <Calendar className="w-3 h-3 text-stone-500" />
              {new Date(brief.date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span className="flex items-center gap-1 bg-stone-50 border border-stone-100 px-3 py-1 rounded-full uppercase">
              <FileText className="w-3 h-3 text-stone-500" />
              {brief.wordCount || 450} Words
            </span>
            <span className={`px-3 py-1 border rounded-full uppercase ${confidence.color}`}>
              {brief.confidenceAvg || 88}% Confidence Ratio • {confidence.label}
            </span>
          </div>
        </div>

        {/* 30 Seconds Recap */}
        <div className="bg-gradient-to-tr from-stone-50/50 to-stone-50/10 border border-stone-200/50 p-6 sm:p-8 rounded-2xl relative overflow-hidden space-y-2.5">
          <div className="absolute top-0 bottom-0 left-0 w-1 bg-[#B19470]"></div>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#8C6239] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#B19470]" />
            The 30-Second Glance
          </h3>
          {isEditing ? (
            <textarea
              value={brief.summary30s || ''}
              onChange={(e) => updateMainBriefStr('summary30s', e.target.value)}
              className="text-base sm:text-lg font-serif italic text-stone-900 bg-amber-50/20 border border-dashed border-amber-250 focus:border-amber-400 focus:outline-none p-2 w-full rounded focus:bg-white h-24 font-medium resize-none"
              placeholder="30-Second glance bullet outline..."
            />
          ) : (
            <p className="text-base sm:text-lg font-serif italic text-stone-850 leading-relaxed font-medium">
              "{brief.summary30s}"
            </p>
          )}
        </div>

        {/* Big Story Segment */}
        {brief.segments.bigStory && (
          <div className="space-y-5 pt-2">
            <div className="flex items-center gap-3">
              <span className="bg-[#B19470]/10 text-[#8C6239] border border-[#B19470]/20 text-[9px] font-bold px-3 py-0.5 rounded-full uppercase tracking-widest">
                TODAY'S MAIN ARTICLE
              </span>
              <div className="h-[1px] bg-stone-100 flex-1"></div>
            </div>

            <div className="space-y-5">
              {isEditing ? (
                <input
                  type="text"
                  value={brief.segments.bigStory.title || ''}
                  onChange={(e) => updateBigStory('title', e.target.value)}
                  className="text-xl sm:text-2xl font-bold font-serif text-stone-950 bg-amber-50/20 border-b border-dashed border-amber-250 focus:border-amber-400 focus:outline-none p-1.5 w-full rounded"
                  placeholder="Main Story Title..."
                />
              ) : (
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 tracking-tight leading-snug">
                  🔥 {brief.segments.bigStory.title}
                </h2>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* News & Significance column */}
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <h4 className="text-[10px] font-bold uppercase text-[#8C6239] tracking-widest block border-l-2 border-[#B19470] pl-2">
                      THE STORY
                    </h4>
                    {isEditing ? (
                      <textarea
                        value={brief.segments.bigStory.whatHappened || ''}
                        onChange={(e) => updateBigStory('whatHappened', e.target.value)}
                        className="text-stone-700 leading-relaxed text-xs sm:text-sm font-medium bg-amber-50/20 border border-dashed border-amber-250 focus:border-amber-400 focus:outline-none p-2 w-full rounded focus:bg-white h-28 resize-none"
                        placeholder="What happened news fact details..."
                      />
                    ) : (
                      <p className="text-slate-650 leading-relaxed text-xs sm:text-sm font-medium">
                        {brief.segments.bigStory.whatHappened}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-[10px] font-bold uppercase text-[#8C6239] tracking-widest block border-l-2 border-[#B19470] pl-2">
                      WHY IT MATTERS
                    </h4>
                    {isEditing ? (
                      <textarea
                        value={brief.segments.bigStory.whyItMatters || ''}
                        onChange={(e) => updateBigStory('whyItMatters', e.target.value)}
                        className="text-stone-900 leading-relaxed text-xs sm:text-sm font-bold bg-amber-50/20 border border-dashed border-amber-250 focus:border-amber-400 focus:outline-none p-2 w-full rounded focus:bg-white h-24 font-serif italic resize-none"
                        placeholder="Why we care details..."
                      />
                    ) : (
                      <p className="text-slate-900 leading-relaxed text-xs sm:text-sm font-bold italic font-serif">
                        {brief.segments.bigStory.whyItMatters}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-[10px] font-bold uppercase text-[#8C6239] tracking-widest block border-l-2 border-[#B19470] pl-2">
                      WHAT'S NEXT
                    </h4>
                    {isEditing ? (
                      <textarea
                        value={brief.segments.bigStory.whatHappensNext || ''}
                        onChange={(e) => updateBigStory('whatHappensNext', e.target.value)}
                        className="text-stone-700 leading-relaxed text-xs sm:text-sm font-medium bg-amber-50/20 border border-dashed border-amber-250 focus:border-amber-400 focus:outline-none p-2 w-full rounded focus:bg-white h-24 resize-none"
                        placeholder="Expected outcomes timeline..."
                      />
                    ) : (
                      <p className="text-slate-650 leading-relaxed text-xs sm:text-sm font-medium">
                        {brief.segments.bigStory.whatHappensNext}
                      </p>
                    )}
                  </div>
                </div>

                {/* Social Perspective & Sources Checked */}
                <div className="flex flex-col justify-between bg-stone-50/60 border border-stone-200/50 p-5 rounded-2xl gap-5">
                  <div className="space-y-3">
                    <span className="text-[9px] uppercase font-bold text-stone-500 tracking-widest flex items-center gap-1.5 border-b border-stone-200/50 pb-2">
                      <MessageCircle className="w-3.5 h-3.5 text-[#B19470]" />
                      Social & Reader Commentary
                    </span>
                    
                    {isEditing ? (
                      <textarea
                        value={brief.segments.bigStory.internetVibe || ''}
                        onChange={(e) => updateBigStory('internetVibe', e.target.value)}
                        className="text-xs text-stone-700 leading-relaxed italic bg-white border border-dashed border-amber-250 focus:border-amber-400 focus:outline-none p-2 w-full rounded h-32 resize-none"
                        placeholder="Social commentaries or regional comments vibe..."
                      />
                    ) : (
                      <div className="bg-white p-4.5 rounded-xl border border-stone-100 shadow-sm">
                        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic font-medium">
                          "{brief.segments.bigStory.internetVibe}"
                        </p>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1.5 pt-1 text-[9px] text-[#8C6239] font-bold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B19470]"></span>
                      Reflecting Community Forums Sentiment
                    </div>
                  </div>

                  {/* Curated authorities references */}
                  <div className="pt-3 border-t border-stone-200/50 flex flex-wrap gap-1 items-center text-[10px]">
                    <span className="text-stone-400 font-bold uppercase text-[9px] tracking-wider">SOURCES:</span>
                    {brief.segments.bigStory.sources && brief.segments.bigStory.sources.map((src, idx) => (
                      <span key={idx} className="bg-white border border-stone-200 px-2.5 py-0.5 rounded text-stone-600 text-[10px] font-semibold">
                        {src}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Nigeria Stories */}
        {brief.segments.nigeria && brief.segments.nigeria.length > 0 && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3">
              <span className="bg-stone-50 border border-stone-200/60 text-stone-800 text-[9px] font-bold px-3 py-0.5 rounded-full uppercase tracking-widest">
                NIGERIAN COVERAGE
              </span>
              <div className="h-[1px] bg-stone-100 flex-1"></div>
            </div>

            <div className="space-y-5">
              {brief.segments.nigeria.map((seg, idx) => (
                <SegmentCard 
                  key={idx} 
                  segment={seg} 
                  isEditing={isEditing} 
                  onEdit={(field, val) => updateSegment('nigeria', idx, field, val)} 
                />
              ))}
            </div>
          </div>
        )}

        {/* African Stories */}
        {brief.segments.africa && brief.segments.africa.length > 0 && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3">
              <span className="bg-stone-50 border border-stone-200/60 text-stone-800 text-[9px] font-bold px-3 py-0.5 rounded-full uppercase tracking-widest">
                AFRICAN COVERAGE
              </span>
              <div className="h-[1px] bg-stone-100 flex-1"></div>
            </div>

            <div className="space-y-5">
              {brief.segments.africa.map((seg, idx) => (
                <SegmentCard 
                  key={idx} 
                  segment={seg} 
                  isEditing={isEditing} 
                  onEdit={(field, val) => updateSegment('africa', idx, field, val)} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Global/World Stories */}
        {brief.segments.world && brief.segments.world.length > 0 && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3">
              <span className="bg-stone-50 border border-stone-200/60 text-stone-800 text-[9px] font-bold px-3 py-0.5 rounded-full uppercase tracking-widest">
                GLOBAL COVERAGE
              </span>
              <div className="h-[1px] bg-stone-100 flex-1"></div>
            </div>

            <div className="space-y-5">
              {brief.segments.world.map((seg, idx) => (
                <SegmentCard 
                  key={idx} 
                  segment={seg} 
                  isEditing={isEditing} 
                  onEdit={(field, val) => updateSegment('world', idx, field, val)} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Watchlist Section */}
        {brief.segments.watchlist && brief.segments.watchlist.length > 0 && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3">
              <span className="bg-[#B19470]/10 text-[#8C6239] border border-[#B19470]/25 text-[9px] font-bold px-3.5 py-0.5 rounded-full uppercase tracking-widest">
                TOPICS TO WATCH NEIGHBORHOOD
              </span>
              <div className="h-[1px] bg-stone-100 flex-1"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {brief.segments.watchlist.map((seg, idx) => (
                <div key={idx} className="bg-stone-50/40 p-5 rounded-xl border border-stone-200/50 space-y-2.5 shadow-none transition-all duration-300">
                  {isEditing ? (
                    <input
                      type="text"
                      value={seg.title || ''}
                      onChange={(e) => updateSegment('watchlist', idx, 'title', e.target.value)}
                      className="font-serif italic font-bold text-stone-950 bg-amber-50/20 border-b border-dashed border-amber-250 focus:outline-none p-1 w-full text-sm"
                      placeholder="Watchlist headline..."
                    />
                  ) : (
                    <h4 className="font-serif italic font-bold text-stone-900 leading-snug flex items-start gap-1.5 text-sm md:text-base">
                      <CornerDownRight className="w-4 h-4 text-[#B19470] mt-1 flex-shrink-0" />
                      {seg.title}
                    </h4>
                  )}

                  {isEditing ? (
                    <textarea
                      value={seg.whatHappened || ''}
                      onChange={(e) => updateSegment('watchlist', idx, 'whatHappened', e.target.value)}
                      className="text-stone-700 text-xs bg-amber-50/20 border border-dashed border-amber-250 focus:outline-none p-2 w-full h-18 resize-none rounded font-medium"
                      placeholder="Watchlist trend context..."
                    />
                  ) : (
                    <p className="text-slate-650 text-xs sm:text-sm leading-relaxed font-medium pl-5">
                      {seg.whatHappened}
                    </p>
                  )}

                  <p className="text-stone-850 font-semibold text-xs border-t border-stone-200/50 pt-2.5 flex items-center gap-1.5 pl-5">
                    <span className="text-[8px] font-bold text-[#8C6239] uppercase bg-[#B19470]/10 px-1.5 py-0.5 rounded border border-[#B19470]/20">Why:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={seg.whyItMatters || ''}
                        onChange={(e) => updateSegment('watchlist', idx, 'whyItMatters', e.target.value)}
                        className="bg-amber-50/20 border-b border-dashed border-amber-250 focus:outline-none p-1 font-medium w-full text-xs"
                        placeholder="Why watch importance..."
                      />
                    ) : (
                      <span>{seg.whyItMatters}</span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// Subcomponent SegmentCard
interface SegmentCardProps {
  segment: EditorialSegment;
  isEditing: boolean;
  onEdit: (field: keyof EditorialSegment, value: string) => void;
}

function SegmentCard({ segment, isEditing, onEdit }: SegmentCardProps) {
  return (
    <div className="bg-white border border-stone-200/60 p-5 sm:p-7 rounded-2xl space-y-4 shadow-none hover:shadow-md transition-all duration-300">
      
      {isEditing ? (
        <input
          type="text"
          value={segment.title || ''}
          onChange={(e) => onEdit('title', e.target.value)}
          className="text-base sm:text-lg font-bold font-serif text-stone-950 bg-amber-50/20 border-b border-dashed border-amber-250 focus:outline-none p-1 w-full rounded"
          placeholder="Story title..."
        />
      ) : (
        <h3 className="text-base sm:text-lg font-bold font-serif text-slate-900 leading-snug">
          🔗 {segment.title}
        </h3>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-1 text-xs leading-relaxed">
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-[#8C6239] tracking-widest block border-b border-stone-100 pb-1 uppercase">THE NEWS</span>
          {isEditing ? (
            <textarea
              value={segment.whatHappened || ''}
              onChange={(e) => onEdit('whatHappened', e.target.value)}
              className="text-stone-700 bg-amber-50/20 border border-dashed border-amber-250 focus:outline-none p-2 w-full h-24 resize-none rounded font-medium"
              placeholder="What happened..."
            />
          ) : (
            <p className="text-slate-650 font-medium leading-relaxed">{segment.whatHappened}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-[#8C6239] tracking-widest block border-b border-stone-100 pb-1 uppercase">WHY IT MATTERS</span>
          {isEditing ? (
            <textarea
              value={segment.whyItMatters || ''}
              onChange={(e) => onEdit('whyItMatters', e.target.value)}
              className="text-stone-950 bg-amber-50/20 border border-dashed border-amber-250 focus:outline-none p-2 w-full h-24 resize-none rounded font-bold"
              placeholder="Why it matters..."
            />
          ) : (
            <p className="text-slate-900 font-bold leading-relaxed">{segment.whyItMatters}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-[#8C6239] tracking-widest block border-b border-stone-100 pb-1 uppercase">NEXT PHASE</span>
          {isEditing ? (
            <textarea
              value={segment.whatHappensNext || ''}
              onChange={(e) => onEdit('whatHappensNext', e.target.value)}
              className="text-stone-700 bg-amber-50/20 border border-dashed border-amber-250 focus:outline-none p-2 w-full h-24 resize-none rounded font-medium"
              placeholder="What happens next..."
            />
          ) : (
            <p className="text-slate-650 font-medium leading-relaxed">{segment.whatHappensNext}</p>
          )}
        </div>
      </div>

      <div className="pt-3.5 border-t border-stone-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-[10px] font-semibold text-stone-500">
        <div className="italic">
          <strong>Vibe:</strong> {isEditing ? (
            <input
              type="text"
              value={segment.internetVibe || ''}
              onChange={(e) => onEdit('internetVibe', e.target.value)}
              className="bg-amber-50/20 border-b border-dashed border-amber-250 focus:outline-none p-1 text-stone-800 text-[10px] font-medium"
              placeholder="Vibe commentary..."
            />
          ) : (
            <span>"{segment.internetVibe}"</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-stone-400 font-bold uppercase text-[9px] tracking-wider">SOURCES:</span>
          {segment.sources && segment.sources.map((src, i) => (
            <span key={i} className="bg-stone-50 border border-stone-200 px-2 py-0.5 rounded text-stone-600 text-[9px] font-bold">{src}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
