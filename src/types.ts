/**
 * Briefly News OS - Types & Interfaces
 */

export interface NewsSource {
  id: string;
  name: string;
  type: 'aggregator' | 'national' | 'pan-african' | 'global-trust' | 'specialized-tech' | 'specialized-business' | 'official' | 'social' | 'community';
  category: 'General' | 'Tech' | 'Business' | 'Government' | 'Health' | 'Culture' | 'Social' | 'Community';
  country: 'Nigeria' | 'South Africa' | 'Kenya' | 'Global' | 'US' | 'UK';
  url: string;
  rssUrl?: string;
  priority: number; // 0 - 100
  active: boolean;
  credibilityScore: number; // base weight for verification
}

export interface RawArticle {
  id: string;
  sourceId: string;
  sourceName: string;
  type: string;
  title: string;
  body: string;
  url: string;
  author?: string;
  publishedAt: string;
  category: string;
  country: string;
}

export interface ArticleClean {
  id: string;
  rawId: string;
  title: string;
  cleanedText: string;
  summary: string;
  entities: string[];
  keywords: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface StoryCluster {
  id: string;
  title: string;
  summary: string;
  category: string;
  articles: Array<{
    id: string;
    title: string;
    source: string;
    url: string;
  }>;
  confidenceScore: number; // fact verification score
  importanceScore: number; // ranking score
  youthRelevanceScore: number; // Gen Z appeal
  status: 'publish' | 'caution' | 'reject';
  verificationDetail: {
    sourcesCount: number;
    officialConfirmed: boolean;
    contradictionsFound: boolean;
    crossCheckNotes: string;
  };
}

export interface EditorialBrief {
  id: string;
  date: string;
  title: string;
  coverImage?: string;
  summary30s: string; // Tighter 30s recap
  segments: {
    bigStory: EditorialSegment;
    nigeria: EditorialSegment[];
    africa: EditorialSegment[];
    world: EditorialSegment[];
    techBusiness: EditorialSegment[];
     watchlist: EditorialSegment[];
  };
  confidenceAvg: number;
  totalArticlesProcessed: number;
  totalClustersFound: number;
  wordCount: number;
  // Multiple output formats
  formats: {
    web: string; // Markdown / Styled text
    whatsapp: string; // Preformatted copyable with *bold*, _italics_, clean bullets
    instagram: string[]; // Carousel slides strings
    tiktok: {
      hook: string;
      visualCues: string[];
      script: string;
    };
  };
}

export interface EditorialSegment {
  id: string;
  title: string;
  clusterId?: string;
  whatHappened: string;
  whyItMatters: string;
  whatHappensNext: string;
  internetVibe: string; // Gen Z comments reaction
  sources: string[];
}

export interface PipelineLog {
  timestamp: string;
  step: 'COLLECT' | 'CLEAN' | 'CLUSTER' | 'VERIFY' | 'RANK' | 'WRITE' | 'QUALITY_CHECK' | 'PUBLISH';
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
  details?: any;
}

export interface PipelineResult {
  brief: EditorialBrief;
  logs: PipelineLog[];
  clusters: StoryCluster[];
}
