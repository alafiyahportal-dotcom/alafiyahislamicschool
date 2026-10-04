'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Heart, Shield } from 'lucide-react';

interface GoalTag {
  id: string;
  label: string;
  response: string;
}

const goalTags: GoalTag[] = [
  {
    id: 'tahfidz',
    label: '+ Hafalan Qur’an Mutqin',
    response: 'Program Talaqqi intensif Al-Afiyah membimbing hafalan 3-5 Juz dengan tajwid tartil dan fashahah mutqin.'
  },
  {
    id: 'adab',
    label: '+ Berakhlak & Beradab',
    response: 'Penanaman adab sebelum ilmu menjadi fondasi utama seluruh aktivitas belajar di lingkungan sekolah Al-Afiyah.'
  },
  {
    id: 'sains',
    label: '+ Juara Sains & MTK',
    response: 'Laboratorium lengkap dan bimbingan olimpiade mengasah nalar kritis dan prestasi akademik ananda.'
  },
  {
    id: 'bahasa',
    label: '+ Bahasa Arab & Inggris',
    response: 'Lingkungan bilingual interaktif melatih keberanian berbicara dan wawasan internasional sejak dini.'
  },
  {
    id: 'mandiri',
    label: '+ Mandiri & Disiplin',
    response: 'Program pembelajaran terpadu melatih kemandirian murid, kedisiplinan ibadah tepat waktu, dan jiwa kepemimpinan.'
  },
  {
    id: 'aman',
    label: '+ Lingkungan Aman & Nyaman',
    response: 'Komitmen zero-bullying dengan dewan guru yang mendampingi secara personal dan penuh kehangatan.'
  }
];

export default function HavenlyMoodCard() {
  const [selectedTag, setSelectedTag] = useState<GoalTag>(goalTags[0]);

  return (
    <div className="bg-black/35 backdrop-blur-md border border-white/20 rounded-3xl p-5 sm:p-6 text-white shadow-2xl max-w-sm sm:max-w-md">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
          Impian Untuk Ananda
        </span>
        <span className="text-[10px] text-stone-300 bg-white/10 px-2 py-0.5 rounded-full">
          Pilih &amp; Klik
        </span>
      </div>

      <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
        Apa target pendidikan utama Ayah/Bunda?
      </h4>

      {/* Interactive Tag Pills */}
      <div className="flex flex-wrap gap-2 mt-3.5">
        {goalTags.map((tag) => {
          const isSelected = selectedTag.id === tag.id;
          return (
            <button
              key={tag.id}
              onClick={() => setSelectedTag(tag)}
              className={`text-xs px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md scale-105 ring-2 ring-white/60'
                  : 'bg-white/10 hover:bg-white/20 text-stone-200 border border-white/15'
              }`}
            >
              {tag.label}
            </button>
          );
        })}
      </div>

      {/* Dynamic Response Box */}
      <div className="mt-4 pt-3.5 border-t border-white/15">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTag.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="text-left"
          >
            <p className="text-[11px] sm:text-xs text-amber-100 leading-relaxed italic">
              &ldquo;{selectedTag.response}&rdquo;
            </p>
            <div className="mt-2 text-[10px] font-semibold text-stone-300 flex items-center space-x-1">
              <Shield className="w-3 h-3 text-amber-400" />
              <span>Komitmen Mutu Pendidikan Yayasan Imam Bonjol</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
