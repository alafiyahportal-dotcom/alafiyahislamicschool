'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Trophy, Medal, Search, Filter, Calendar } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  studentName: string;
  category: string;
  level: string;
  rank: string;
  year: string;
  description?: string | null;
  imageUrl?: string | null;
  school?: {
    name: string;
    slug: string;
    primaryColor: string;
  };
}

interface AchievementShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultUnit?: string;
}

export default function AchievementShowcaseModal({
  isOpen,
  onClose,
  defaultUnit = 'all',
}: AchievementShowcaseModalProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedUnit, setSelectedUnit] = useState(defaultUnit);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    const fetchAchievements = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/admin/achievements?schoolSlug=${selectedUnit}&category=${selectedCategory}&search=${encodeURIComponent(
            searchQuery
          )}`
        );
        const json = await res.json();
        if (json.success) {
          setAchievements(json.data);
        }
      } catch (err) {
        console.error('Failed to load achievements:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [isOpen, selectedUnit, selectedCategory, searchQuery]);

  if (!isOpen) return null;

  const categories = [
    { key: 'all', label: 'Semua Bidang' },
    { key: 'TAHFIDZ', label: 'Tahfidz Qur’an' },
    { key: 'SAINS', label: 'Sains & Riset' },
    { key: 'SENI_BAHASA', label: 'Bahasa & Seni' },
    { key: 'OLAHRAGA', label: 'Olahraga' },
  ];

  const getRankBadge = (rank: string) => {
    switch (rank) {
      case 'JUARA_1':
        return {
          label: 'Juara 1 (Emas)',
          bg: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: Trophy,
          iconColor: 'text-amber-600',
        };
      case 'JUARA_2':
        return {
          label: 'Juara 2 (Perak)',
          bg: 'bg-slate-100 text-slate-800 border-slate-300',
          icon: Medal,
          iconColor: 'text-slate-500',
        };
      case 'JUARA_3':
        return {
          label: 'Juara 3 (Perunggu)',
          bg: 'bg-orange-100 text-orange-800 border-orange-300',
          icon: Award,
          iconColor: 'text-orange-600',
        };
      default:
        return {
          label: 'Finalis Terpilih',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          icon: Medal,
          iconColor: 'text-emerald-600',
        };
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#184F48] to-[#2D7A70] text-white p-5 sm:p-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center text-amber-300 shadow-xs">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-amber-300 font-bold block">
                  Galeri Kebanggaan Yayasan
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
                  Papan Prestasi &amp; Karya Murid Al-Afiyah
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search & Filters Bar */}
          <div className="p-4 sm:p-5 bg-[#F8FAFC] border-b border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Box */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama murid, judul kejuaraan, atau lomba..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2D7A70]/30 text-slate-800"
                />
              </div>

              {/* Unit Selector */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
                {[
                  { slug: 'all', label: 'Semua Unit' },
                  { slug: 'tk', label: 'TK IT' },
                  { slug: 'sd', label: 'SDIT' },
                  { slug: 'smp', label: 'SMP IT' },
                ].map((unit) => (
                  <button
                    key={unit.slug}
                    onClick={() => setSelectedUnit(unit.slug)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      selectedUnit === unit.slug
                        ? 'bg-[#2D7A70] text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {unit.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-slate-400 text-[11px] font-semibold flex items-center mr-1">
                <Filter className="w-3 h-3 mr-1" /> Bidang:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-2.5 py-1 rounded-full font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat.key
                      ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Achievement Grid Content */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
            {loading ? (
              <div className="py-16 text-center text-slate-400">
                <div className="w-8 h-8 border-3 border-[#2D7A70] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs font-medium">Memuat katalog prestasi murid...</p>
              </div>
            ) : achievements.length === 0 ? (
              <div className="py-16 text-center text-slate-500">
                <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">Belum ada prestasi yang cocok</p>
                <p className="text-xs text-slate-400 mt-1">
                  Coba ubah kata kunci pencarian atau ganti filter bidang lomba.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((item) => {
                  const rankInfo = getRankBadge(item.rank);
                  const Icon = rankInfo.icon;

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-md transition-all hover:border-[#2D7A70]/40 flex gap-4 group"
                    >
                      {/* Thumbnail photo */}
                      <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-stone-100 relative shrink-0 border border-slate-200">
                        <Image
                          src={item.imageUrl || '/images/arc-tahfidz.jpg'}
                          alt={item.studentName}
                          fill
                          sizes="96px"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-1 left-1">
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-black/70 text-white backdrop-blur-xs uppercase tracking-wider">
                            {item.school?.slug.toUpperCase() || 'AL-AFIYAH'}
                          </span>
                        </div>
                      </div>

                      {/* Content details */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          {/* Rank badge & Level */}
                          <div className="flex items-center space-x-1.5 flex-wrap gap-y-1 mb-1">
                            <span
                              className={`inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${rankInfo.bg}`}
                            >
                              <Icon className={`w-3 h-3 ${rankInfo.iconColor}`} />
                              <span>{rankInfo.label}</span>
                            </span>
                            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded-sm">
                              Tingkat {item.level}
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                            {item.title}
                          </h4>

                          <p className="text-xs font-bold text-[#184F48] mt-1 truncate">
                            👤 {item.studentName}
                          </p>

                          {item.description && (
                            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 mt-2 border-t border-slate-100">
                          <span className="font-semibold text-slate-600 truncate">
                            {item.school?.name}
                          </span>
                          <span className="flex items-center font-mono">
                            <Calendar className="w-2.5 h-2.5 mr-1" />
                            {item.year}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
            Prestasi dicapai melalui program bimbingan intensif dan pembiasaan adab mulia di Yayasan Pendidikan Imam Bonjol Al-Afiyah Majalengka.
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
