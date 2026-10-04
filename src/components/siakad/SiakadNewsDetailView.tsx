'use client';

import React from 'react';
import { 
  ChevronLeft, 
  Share2, 
  Calendar, 
  User, 
  Tag, 
  Clock, 
  ArrowLeft,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

export interface SiakadNewsItem {
  id: string;
  title: string;
  category: string;
  categoryColor: string;
  unitTag?: string; // e.g. "TK IT", "SD IT", "SMP IT", "Yayasan"
  date: string;
  author: string;
  authorRole: string;
  coverImage: string;
  excerpt: string;
  readTime: string;
  paragraphs: string[];
  keyHighlights: string[];
}

interface SiakadNewsDetailViewProps {
  news: SiakadNewsItem;
  onBack: () => void;
}

export default function SiakadNewsDetailView({
  news,
  onBack,
}: SiakadNewsDetailViewProps) {
  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: news.title,
        text: news.excerpt,
        url: window.location.href,
      }).catch(() => {});
    } else {
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`*${news.title}*\n\n${news.excerpt}\n\nBaca selengkapnya di SIAKAD Al-Afiyah: ${window.location.href}`)}`;
      window.open(waUrl, '_blank');
    }
  };

  return (
    <div className="flex-1 flex flex-col pb-24 overflow-y-auto bg-[#F5F7F6] text-slate-800 font-sans selection:bg-amber-300 selection:text-emerald-950 relative">
      {/* Top Floating Action Bar */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali</span>
        </button>

        <span className="text-xs font-extrabold text-slate-800 tracking-tight">
          Kabar &amp; Momen Sekolah
        </span>

        <button
          onClick={handleShare}
          className="p-2 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 transition-colors"
          title="Bagikan Berita"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Hero Cover Image */}
      <div className="w-full h-56 relative overflow-hidden bg-slate-900 shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={news.coverImage} 
          alt={news.title}
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Badges on Cover */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {news.unitTag && (
              <span className="px-2.5 py-1 rounded-full bg-white text-slate-900 text-[10px] font-black tracking-wide shadow-md">
                {news.unitTag}
              </span>
            )}
            <span 
              className="px-2.5 py-1 rounded-full text-white text-[10px] font-black tracking-wide shadow-md backdrop-blur-xs"
              style={{ backgroundColor: news.categoryColor }}
            >
              {news.category}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 text-white text-[10px] font-medium backdrop-blur-xs">
            <Clock className="w-3 h-3 text-amber-300" />
            <span>{news.readTime}</span>
          </div>
        </div>
      </div>

      {/* Article Content Body */}
      <div className="px-4 py-5 space-y-4">
        {/* Title and Metadata */}
        <div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium mb-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-700" />
            <span>{news.date}</span>
            <span>•</span>
            <span className="text-emerald-800 font-bold">{news.unitTag ? `${news.unitTag} • Al-Afiyah` : 'Yayasan Pendidikan Imam Bonjol'}</span>
          </div>

          <h1 className="text-lg font-black text-slate-900 leading-snug tracking-tight">
            {news.title}
          </h1>
        </div>

        {/* Author Card */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-full bg-[#123E38] text-white flex items-center justify-center font-bold text-xs shrink-0">
            {news.author.charAt(0)}
          </div>
          <div>
            <p className="text-xs font-extrabold text-slate-900">{news.author}</p>
            <p className="text-[10px] text-slate-500">{news.authorRole}</p>
          </div>
        </div>

        {/* Lead Excerpt Card */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-950 text-xs font-semibold leading-relaxed">
          {news.excerpt}
        </div>

        {/* Article Paragraphs */}
        <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
          {news.paragraphs.map((p, idx) => (
            <p key={idx} className="text-justify">
              {p}
            </p>
          ))}
        </div>

        {/* Key Highlights */}
        {news.keyHighlights && news.keyHighlights.length > 0 && (
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-2.5">
            <h4 className="text-xs font-black text-slate-900">
              Poin Penting &amp; Kesimpulan Kegiatan:
            </h4>
            <div className="space-y-2">
              {news.keyHighlights.map((hl, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px] text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{hl}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 space-y-2">
          <button
            onClick={handleShare}
            className="w-full py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Share2 className="w-4 h-4" />
            <span>Bagikan Kabar ke WhatsApp Wali Murid</span>
          </button>

          <button
            onClick={onBack}
            className="w-full py-3 px-4 rounded-2xl bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-[#123E38]" />
            <span>Kembali ke Beranda SIAKAD</span>
          </button>
        </div>
      </div>
    </div>
  );
}
