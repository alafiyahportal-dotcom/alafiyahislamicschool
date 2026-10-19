'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Calendar, 
  User, 
  Tag, 
  ArrowRight, 
  BookOpen, 
  Share2, 
  Clock, 
  X, 
  CheckCircle2, 
  ExternalLink, 
  MapPin,
  ZoomIn,
  ZoomOut,
  Download,
  Maximize2
} from 'lucide-react';

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  author: string;
  date: string;
  schoolName?: string;
  readingTime?: string;
  imageUrl?: string;
  paragraphs?: string[];
  keyHighlights?: string[];
}

interface NewsListClientProps {
  initialArticles: NewsArticle[];
  schoolSlug?: 'smp' | 'sd' | 'tk' | 'foundation';
  defaultCategory?: string;
}

export default function NewsListClient({ 
  initialArticles, 
  schoolSlug = 'foundation',
  defaultCategory = 'Semua' 
}: NewsListClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(defaultCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{
    url: string;
    title: string;
    author?: string;
    date?: string;
  } | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Prevent background scroll when modal or lightbox is active
  useEffect(() => {
    if (selectedArticle || lightboxImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedArticle, lightboxImage]);

  // Handle ESC key to close modal or lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxImage) {
          setLightboxImage(null);
          setZoomLevel(1);
        } else if (selectedArticle) {
          setSelectedArticle(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImage, selectedArticle]);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.35, 3));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.35, 0.7));
  const handleResetZoom = () => setZoomLevel(1);

  const handleDownloadImage = (url: string, title: string) => {
    try {
      const a = document.createElement('a');
      a.href = url;
      const safeTitle = (title || 'foto_alafiyah')
        .toLowerCase()
        .replace(/[^a-z0-9]/gi, '_')
        .slice(0, 50);
      a.download = `${safeTitle}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      console.error('Download error:', e);
      window.open(url, '_blank');
    }
  };

  const isSmp = schoolSlug === 'smp';
  const isSd = schoolSlug === 'sd';

  const categories = ['Semua', 'Pengumuman', 'Kabar Sekolah', 'Kajian Islam', 'Prestasi', 'Tahfidz'];

  // Parse URL query parameter ?cat=... on mount and browser navigation without triggering CSR bailout
  useEffect(() => {
    const syncFromUrl = () => {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get('cat') || params.get('category');
      if (catParam) {
        const lower = catParam.toLowerCase();
        if (lower.includes('prestasi')) setSelectedCategory('Prestasi');
        else if (lower.includes('kajian') || lower.includes('artikel')) setSelectedCategory('Kajian Islam');
        else if (lower.includes('warta') || lower.includes('kabar')) setSelectedCategory('Kabar Sekolah');
        else if (lower.includes('pengumuman')) setSelectedCategory('Pengumuman');
        else if (lower.includes('tahfidz')) setSelectedCategory('Tahfidz');
        else if (lower.includes('semua')) setSelectedCategory('Semua');
      }
    };

    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  const filteredArticles = useMemo(() => {
    return initialArticles.filter((article) => {
      const matchesCategory = 
        selectedCategory === 'Semua' || 
        article.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        (selectedCategory === 'Kabar Sekolah' && (article.category.toLowerCase().includes('kegiatan') || article.category.toLowerCase().includes('warta')));
      
      const matchesQuery = 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (article.schoolName && article.schoolName.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesQuery;
    });
  }, [initialArticles, selectedCategory, searchQuery]);

  const handleShare = (art: NewsArticle) => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: art.title,
        text: art.excerpt,
        url: window.location.href,
      }).catch(() => {});
    } else {
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`*${art.title}*\n\n${art.excerpt}\n\nBaca selengkapnya di Al-Afiyah: ${window.location.href}`)}`;
      window.open(waUrl, '_blank');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-full overflow-hidden">
      {/* Top Filter & Search Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills with horizontal scroll */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none w-full md:w-auto -mx-1 px-1">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  isActive
                    ? isSmp 
                      ? 'bg-[#030164] text-[#ffd51e] shadow-sm ring-1 ring-[#ffd51e]/40'
                      : isSd
                      ? 'bg-[#00A651] text-white shadow-sm'
                      : 'bg-[#184F48] text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72 flex-shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul artikel, topik..."
            className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
              isSmp 
                ? 'focus:ring-[#030164]/20 focus:border-[#030164]'
                : isSd
                ? 'focus:ring-[#00A651]/20 focus:border-[#00A651]'
                : 'focus:ring-[#184F48]/20 focus:border-[#184F48]'
            }`}
          />
        </div>
      </div>

      {/* Article Grid */}
      {filteredArticles.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200/80 shadow-sm space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">Tidak ada artikel di kategori &ldquo;{selectedCategory}&rdquo;</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Coba pilih kategori &ldquo;Semua&rdquo; atau gunakan kata kunci pencarian lain untuk melihat seluruh warta.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('Semua');
              setSearchQuery('');
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              isSmp
                ? 'bg-[#030164] text-[#ffd51e] hover:bg-blue-900'
                : 'bg-[#184F48] text-white hover:bg-[#123E38]'
            }`}
          >
            Lihat Semua Artikel
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredArticles.map((art) => (
            <article
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedArticle(art);
                }
              }}
              className={`bg-white rounded-2xl border border-slate-200/80 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group cursor-pointer text-left focus:outline-none focus:ring-2 ${
                isSmp 
                  ? 'hover:border-[#030164]/40 focus:ring-[#030164]'
                  : 'hover:border-[#184F48]/40 focus:ring-[#184F48]'
              }`}
            >
              {/* Cover Image */}
              {art.imageUrl && (
                <div 
                  className="relative w-full h-56 sm:h-64 overflow-hidden bg-slate-950 shrink-0 group/img cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxImage({
                      url: art.imageUrl!,
                      title: art.title,
                      author: art.author,
                      date: art.date,
                    });
                  }}
                  title="Klik untuk membuka foto penuh (fullscreen)"
                >
                  {/* Layer 1: Ambient Blurred Background */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={art.imageUrl}
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-cover scale-125 blur-lg opacity-40 transition-transform duration-500 group-hover/img:scale-135"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Layer 2: Main Image (Uncropped with object-contain) */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="absolute inset-0 w-full h-full object-contain p-2 transition-transform duration-300 group-hover/img:scale-[1.03]"
                  />

                  {/* School Name Badge */}
                  {art.schoolName && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-md text-slate-900 text-[10px] font-black shadow-sm z-10">
                      {art.schoolName}
                    </span>
                  )}

                  {/* Zoom Badge Button on Top Right */}
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/70 hover:bg-black/90 text-white text-[10px] font-bold backdrop-blur-md border border-white/20 transition-all hover:scale-105 shadow-sm">
                    <ZoomIn className="w-3.5 h-3.5 text-amber-300" />
                    <span>Perbesar Foto</span>
                  </div>

                  {/* Bottom Action Badge */}
                  <div className="absolute bottom-2.5 right-3 z-10 text-[10px] font-bold text-white/95 bg-black/70 px-2.5 py-1 rounded-md backdrop-blur-xs flex items-center gap-1 border border-white/10">
                    <span>Lihat &amp; Baca</span>
                    <ArrowRight className="w-3 h-3 text-amber-300" />
                  </div>
                </div>
              )}

              {/* Card Body */}
              <div className="p-4 sm:p-6 space-y-2.5 sm:space-y-3 flex-1 flex flex-col">
                {/* Category & Reading Time */}
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-md font-bold text-[11px] ${
                      isSmp 
                        ? 'bg-blue-50 text-[#030164] border border-blue-200'
                        : 'bg-[#E8F3F1] text-[#184F48]'
                    }`}>
                      {art.category}
                    </span>
                    {!art.imageUrl && art.schoolName && (
                      <span className="px-2 py-0.5 rounded-md font-semibold text-[10px] bg-slate-100 text-slate-600">
                        {art.schoolName}
                      </span>
                    )}
                  </div>
                  <span className="flex items-center space-x-1 text-slate-400 text-[11px] shrink-0">
                    <Clock className="w-3 h-3" />
                    <span>{art.readingTime || '3 min'}</span>
                  </span>
                </div>

                {/* Title */}
                <h3 className={`text-sm sm:text-base font-bold text-slate-900 transition-colors line-clamp-2 leading-snug ${
                  isSmp ? 'group-hover:text-[#030164]' : 'group-hover:text-[#184F48]'
                }`}>
                  {art.title}
                </h3>

                {/* Excerpt */}
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed flex-1">
                  {art.excerpt}
                </p>
              </div>

              {/* Card Footer */}
              <div className="px-4 py-3 sm:px-6 sm:py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center space-x-2 min-w-0">
                  <div className={`w-6 h-6 rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0 ${
                    isSmp ? 'bg-[#030164]' : 'bg-[#184F48]'
                  }`}>
                    {art.author.charAt(0)}
                  </div>
                  <span className="truncate text-[11px] font-medium text-slate-700">
                    {art.author}
                  </span>
                </div>

                <div className="flex items-center space-x-1.5 text-slate-400 text-[11px] shrink-0">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{art.date}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Interactive Article Reading Modal */}
      {selectedArticle && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setSelectedArticle(null)}
        >
          <div 
            className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[88vh] overflow-y-auto shadow-2xl border border-slate-200/80 text-left relative flex flex-col my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Sticky Header */}
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  isSmp 
                    ? 'bg-blue-50 text-[#030164] border border-blue-200' 
                    : 'bg-[#E8F3F1] text-[#184F48]'
                }`}>
                  {selectedArticle.category}
                </span>
                {selectedArticle.schoolName && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900">
                    {selectedArticle.schoolName}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleShare(selectedArticle)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
                  title="Bagikan ke WhatsApp"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  title="Tutup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Poster / Cover Image */}
            {selectedArticle.imageUrl && (
              <div 
                onClick={() => setLightboxImage({
                  url: selectedArticle.imageUrl!,
                  title: selectedArticle.title,
                  author: selectedArticle.author,
                  date: selectedArticle.date,
                })}
                className="relative w-full bg-slate-950 flex items-center justify-center overflow-hidden min-h-[260px] max-h-[480px] cursor-zoom-in group/modalImg"
                title="Klik untuk membuka foto penuh (fullscreen)"
              >
                {/* Ambient Blurred Background */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedArticle.imageUrl}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover scale-125 blur-lg opacity-35"
                />
                <div className="absolute inset-0 bg-black/30" />

                {/* Main Uncropped Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedArticle.imageUrl}
                  alt={selectedArticle.title}
                  className="relative z-10 w-full h-auto max-h-[480px] object-contain p-2 group-hover/modalImg:scale-[1.02] transition-transform duration-300"
                />

                {/* Floating Zoom Cue */}
                <div className="absolute bottom-3 right-3 z-20 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg group-hover/modalImg:bg-black/90 group-hover/modalImg:scale-105 transition-all">
                  <ZoomIn className="w-3.5 h-3.5 text-amber-300" />
                  <span>Perbesar Foto Penuh</span>
                </div>
              </div>
            )}

            {/* Modal Body */}
            <div className="p-4 sm:p-8 space-y-5">
              {/* Title & Meta */}
              <div>
                <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 leading-snug">
                  {selectedArticle.title}
                </h2>
                
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-slate-500 mt-2.5 pt-2.5 border-t border-slate-100">
                  <span className="flex items-center gap-1.5">
                    <User className={`w-3.5 h-3.5 ${isSmp ? 'text-[#030164]' : 'text-[#184F48]'}`} />
                    <strong className="text-slate-700">{selectedArticle.author}</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedArticle.date}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>{selectedArticle.readingTime || '3 menit baca'}</span>
                  </span>
                </div>
              </div>

              {/* Lead Excerpt */}
              <div className={`p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed font-medium ${
                isSmp 
                  ? 'bg-blue-50/70 border-blue-200 text-blue-950'
                  : 'bg-emerald-50/60 border-emerald-100/80 text-emerald-950'
              }`}>
                {selectedArticle.excerpt}
              </div>

              {/* Paragraphs */}
              <div className="space-y-4 text-slate-700 text-xs sm:text-sm leading-relaxed">
                {selectedArticle.paragraphs && selectedArticle.paragraphs.length > 0 ? (
                  selectedArticle.paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))
                ) : (
                  <p>{selectedArticle.excerpt}</p>
                )}
              </div>

              {/* Key Highlights */}
              {selectedArticle.keyHighlights && selectedArticle.keyHighlights.length > 0 && (
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Poin Penting &amp; Informasi Utama</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600 pl-1">
                    {selectedArticle.keyHighlights.map((hl, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Footer Actions */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleShare(selectedArticle)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-bold hover:bg-[#1EBE5D] transition-colors shadow-sm cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Bagikan ke WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Tutup Kabar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Photo Lightbox Modal */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-[80] bg-black/95 backdrop-blur-md flex flex-col justify-between p-3 sm:p-6 animate-in fade-in duration-200 select-none"
          onClick={() => {
            setLightboxImage(null);
            setZoomLevel(1);
          }}
        >
          {/* Top Bar */}
          <div 
            className="flex items-center justify-between gap-3 text-white max-w-7xl mx-auto w-full z-20 pb-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="min-w-0 pr-4">
              <h3 className="text-sm sm:text-base font-bold text-white truncate">
                {lightboxImage.title}
              </h3>
              {(lightboxImage.author || lightboxImage.date) && (
                <p className="text-xs text-slate-300 truncate">
                  {lightboxImage.author} {lightboxImage.date ? `• ${lightboxImage.date}` : ''}
                </p>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <div className="bg-white/10 rounded-xl p-1 flex items-center border border-white/20">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="p-1.5 sm:p-2 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="Perkecil (-)"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleResetZoom}
                  className="px-2 py-1 text-xs font-mono font-bold text-amber-300 hover:bg-white/20 rounded-md transition-colors cursor-pointer"
                  title="Reset Zoom (100%)"
                >
                  {Math.round(zoomLevel * 100)}%
                </button>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="p-1.5 sm:p-2 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="Perbesar (+)"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleDownloadImage(lightboxImage.url, lightboxImage.title)}
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Unduh / Simpan Foto"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Unduh</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLightboxImage(null);
                  setZoomLevel(1);
                }}
                className="p-2 sm:p-2.5 rounded-xl bg-white/15 hover:bg-red-500/80 text-white transition-colors cursor-pointer border border-white/20"
                title="Tutup (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Photo Canvas */}
          <div 
            className="flex-1 flex items-center justify-center overflow-auto my-auto relative w-full"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setLightboxImage(null);
                setZoomLevel(1);
              }
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxImage.url}
              alt={lightboxImage.title}
              style={{
                transform: `scale(${zoomLevel})`,
                transition: 'transform 0.2s cubic-bezier(0.2, 0, 0, 1)',
              }}
              className="max-w-[95vw] max-h-[82vh] object-contain rounded-lg shadow-2xl cursor-grab active:cursor-grabbing"
              onClick={(e) => {
                e.stopPropagation();
                setZoomLevel((prev) => (prev === 1 ? 1.8 : 1));
              }}
            />
          </div>

          {/* Bottom Hint */}
          <div 
            className="text-center text-[11px] text-slate-400 pt-2 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <span>💡 Klik gambar untuk zoom • Gunakan tombol + / - untuk perbesar • Tekan Esc untuk keluar</span>
          </div>
        </div>
      )}
    </div>
  );
}
