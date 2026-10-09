'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  MessageCircle,
  X,
  Send,
  HelpCircle,
  Search,
  ChevronDown,
  Building2,
  Phone,
  ExternalLink,
  School,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';

import { getStoredReferralCode } from '@/lib/referral';

interface UnitHelpdesk {
  slug: 'tk' | 'sd' | 'smp' | 'foundation';
  name: string;
  badge: string;
  phone: string;
  officerName: string;
  greetingTemplate: string;
  primaryColor: string;
}

const HELPDESK_UNITS: UnitHelpdesk[] = [
  {
    slug: 'sd',
    name: 'SDIT Al-Afiyah',
    badge: 'Smart Akhlak Fitrah • Hanya 2 Rombel',
    phone: '6281310139001',
    officerName: 'Ibu Guru Panitia SPMB SD IT',
    greetingTemplate: 'Assalamu\'alaikum Panitia SPMB SDIT Al-Afiyah. Saya ingin berkonsultasi mengenai pendaftaran murid baru SD IT (SPMB 2027/2028).',
    primaryColor: '#059669',
  },
  {
    slug: 'tk',
    name: 'PAUD / TK IT Al-Afiyah',
    badge: 'Pondasi Karakter Usia Dini',
    phone: '6281223344551',
    officerName: 'Ibu Guru Panitia PPDB TK IT',
    greetingTemplate: 'Assalamu\'alaikum Panitia PPDB TK IT Al-Afiyah. Saya ingin berkonsultasi mengenai pendaftaran calon murid baru TK IT untuk Tahun Ajaran 2027/2028.',
    primaryColor: '#0d9488',
  },
  {
    slug: 'smp',
    name: 'SMP IT Al-Afiyah',
    badge: 'Sekolah Menengah Terpadu',
    phone: '6281223344553',
    officerName: 'Panitia PPDB SMP IT',
    greetingTemplate: 'Assalamu\'alaikum Panitia PPDB SMP IT Al-Afiyah. Saya ingin berkonsultasi mengenai pendaftaran murid baru SMP IT untuk Tahun Ajaran 2027/2028.',
    primaryColor: '#1e40af',
  },
  {
    slug: 'foundation',
    name: 'Yayasan Al-Afiyah Majalengka',
    badge: 'Sekretariat Pusat',
    phone: '6281223344550',
    officerName: 'Customer Care Yayasan',
    greetingTemplate: 'Assalamu\'alaikum Layanan Informasi Terpadu Yayasan Al-Afiyah Majalengka. Saya ingin menanyakan informasi umum PPDB terpadu.',
    primaryColor: '#184F48',
  },
];

interface FAQItem {
  id: string;
  category: 'SYARAT' | 'TAHFIDZ' | 'KURIKULUM' | 'BIAYA' | 'SELEKSI';
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'SYARAT',
    question: 'Kapan batas akhir pendaftaran murid baru dibuka?',
    answer: 'SD IT Al-Afiyah T.A. 2027/2028 dibuka dalam 3 gelombang: Gelombang 1 (1 Okt – 30 Des 2026, biaya Rp 250.000), Gelombang 2 (1 Jan – 3 Apr 2027, Rp 275.000), dan Gelombang 3 (6 Apr – 26 Jun 2027, Rp 300.000). Jika kuota telah penuh, pendaftaran unit akan otomatis ditutup oleh sistem.',
  },
  {
    id: 'faq-2',
    category: 'TAHFIDZ',
    question: 'Bagaimana target capaian hafalan Al-Qur\'an dan metodenya?',
    answer: 'SD IT Al-Afiyah menargetkan hafalan minimal Juz 30 Mutqin dengan metode talaqqi tartil harian. Untuk SMP IT Al-Afiyah, target kurikulum adalah 3-5 Juz mutqin & tartil, serta tersedia kelas khusus Peminatan Tahfidz bagi murid yang ingin mendalami hafalan lebih intensif.',
  },
  {
    id: 'faq-3',
    category: 'KURIKULUM',
    question: 'Bagaimana sistem pembelajaran di SMP IT Al-Afiyah?',
    answer: 'SMP IT Al-Afiyah menyelenggarakan sistem Fullday School (sekolah terpadu dari pagi hingga sore hari). Pembelajaran mengintegrasikan kurikulum nasional Kemendikbud, penguatan tahfidz Al-Qur\'an, sains modern, percakapan bahasa Arab & Inggris aktif, serta pembiasaan karakter islami tanpa sistem asrama atau mondok.',
  },
  {
    id: 'faq-4',
    category: 'BIAYA',
    question: 'Apakah tersedia program beasiswa untuk murid tahfidz atau dhuafa?',
    answer: 'Ya! Yayasan Pendidikan Imam Bonjol menyediakan Jalur Prestasi Tahfidz (bebas biaya formulir & potongan infaq pembangunan) serta Jalur Afirmasi Beasiswa Dhuafa / Yatim dengan melampirkan SKTM atau surat keterangan dari kelurahan setempat.',
  },
  {
    id: 'faq-5',
    category: 'SELEKSI',
    question: 'Bagaimana bentuk tes wawancara dan observasi murid baru?',
    answer: 'Observasi murid dilakukan dengan pendekatan ramah anak yang menyenangkan tanpa tekanan ujian kaku. Untuk TK berupa stimulasi motorik dan sosialisasi bermain; untuk SD berupa kesiapan belajar dan membaca Iqro; sedangkan untuk SMP berupa tes tahsin hafalan dan wawancara motivasi belajar.',
  },
  {
    id: 'faq-6',
    category: 'BIAYA',
    question: 'Apakah formulir pendaftaran bisa disimpan draf dan dilanjutkan nanti?',
    answer: 'Tentu bisa. Formulir online PPDB Al-Afiyah dilengkapi fitur Auto-Save ke memori lokal peramban. Data isian orang tua akan tersimpan secara otomatis meskipun peramban sempat ditutup tidak sengaja.',
  },
];

export default function HelpdeskChatWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'CHAT' | 'FAQ'>('CHAT');
  const [selectedUnitSlug, setSelectedUnitSlug] = useState<'tk' | 'sd' | 'smp' | 'foundation'>('sd');
  const [faqSearch, setFaqSearch] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>('faq-1');
  const [refCode, setRefCode] = useState<string | null>(null);
  const [isOpeningSpmb, setIsOpeningSpmb] = useState(false);

  useEffect(() => {
    setRefCode(getStoredReferralCode());
  }, []);

  let spmbUrl = selectedUnitSlug && selectedUnitSlug !== 'foundation'
    ? `/ppdb/daftar?school=${selectedUnitSlug}`
    : '/ppdb/daftar';
  if (refCode) {
    spmbUrl += `${spmbUrl.includes('?') ? '&' : '?'}ref=${encodeURIComponent(refCode)}`;
  }

  const selectedUnit = useMemo(() => {
    return HELPDESK_UNITS.find((u) => u.slug === selectedUnitSlug) || HELPDESK_UNITS[0];
  }, [selectedUnitSlug]);

  const filteredFaq = useMemo(() => {
    if (!faqSearch.trim()) return FAQ_DATA;
    const query = faqSearch.toLowerCase();
    return FAQ_DATA.filter(
      (f) => f.question.toLowerCase().includes(query) || f.answer.toLowerCase().includes(query)
    );
  }, [faqSearch]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Do NOT render customer helpdesk widget in admin pages or SIAKAD mobile app
  if (
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/siakad') ||
    pathname?.startsWith('/portal/siakad')
  ) {
    return null;
  }

  const handleLaunchWhatsApp = () => {
    const text = encodeURIComponent(selectedUnit.greetingTemplate);
    const url = `https://wa.me/${selectedUnit.phone}?text=${text}`;
    window.open(url, '_blank');
  };

  return (
    <div className="hidden sm:block fixed bottom-6 right-6 z-40 print:hidden font-sans">
      {/* 1. Floating Launcher Button - Al-Irsyad Style Pill */}
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white/95 hover:bg-[#0D5C54] text-[#0D5C54] hover:text-white border border-[#2D7A70] sm:border-[1.5px] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
          aria-label="Informasi Pendaftaran PPDB & Konsultasi"
        >
          <span className="text-xs sm:text-sm font-semibold tracking-wide">
            Info Pendaftaran
          </span>
        </button>
      ) : (
        /* 2. Floating Popover Card */
        <div
          ref={containerRef}
          className="w-[calc(100vw-24px)] sm:w-[400px] max-w-[400px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col h-[520px] max-h-[calc(100vh-120px)] animate-fadeIn"
        >
          {/* Card Top Header */}
          <div className="p-4 bg-gradient-to-r from-[#2D7A70] to-[#184F48] text-white flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-white font-bold text-base shadow-xs">
                A
              </div>
              <div>
                <h3 className="text-sm font-bold leading-tight">Informasi Pendaftaran (SPMB)</h3>
                <p className="text-[11px] text-emerald-200 mt-0.5 font-medium">
                  Sekolah Islam Terpadu Al-Afiyah
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Tutup jendela informasi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Direct SPMB Registration Banner */}
          <div className="px-4 py-2.5 bg-[#E8F3F1] border-b border-[#2D7A70]/20 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold text-[#184F48]">SPMB T.A. 2027/2028 Dibuka</span>
            </div>
            <a
              href={spmbUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                setIsOpeningSpmb(true);
                setTimeout(() => {
                  setIsOpeningSpmb(false);
                  setIsOpen(false);
                }, 1500);
              }}
              className="text-[11px] font-bold text-[#2D7A70] hover:text-[#0D5C54] flex items-center space-x-1 underline decoration-1 hover:decoration-2 transition-colors cursor-pointer"
            >
              {isOpeningSpmb ? (
                <span className="flex items-center space-x-1 text-emerald-700">
                  <span className="w-3 h-3 border-2 border-[#2D7A70] border-t-transparent rounded-full animate-spin" />
                  <span>Membuka Tab...</span>
                </span>
              ) : (
                <>
                  <span>Daftar SPMB Online</span>
                  <ArrowRight className="w-3 h-3" />
                </>
              )}
            </a>
          </div>

          {/* Tab Switcher */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-100 border-b border-slate-200 text-xs font-bold text-slate-600 flex-shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('CHAT')}
              className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                activeTab === 'CHAT' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              <Phone className="w-3.5 h-3.5 text-[#2D7A70]" />
              <span>Chat WhatsApp</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('FAQ')}
              className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                activeTab === 'FAQ' ? 'bg-white text-slate-900 shadow-2xs' : 'hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Tanya Jawab (FAQ)</span>
            </button>
          </div>

          {/* TAB 1: Chat WhatsApp */}
          {activeTab === 'CHAT' && (
            <div className="p-4 flex-1 overflow-y-auto space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Pilih Unit Sekolah Tujuan:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {HELPDESK_UNITS.map((unit) => (
                    <button
                      key={unit.slug}
                      type="button"
                      onClick={() => setSelectedUnitSlug(unit.slug)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedUnitSlug === unit.slug
                          ? 'border-[#2D7A70] bg-[#E8F3F1] text-[#184F48] shadow-2xs'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100/70'
                      }`}
                    >
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white border border-slate-200 block w-fit mb-1">
                        {unit.badge}
                      </span>
                      <p className="text-xs font-bold leading-tight">{unit.name}</p>
                    </button>
                  ))}
                </div>

                {/* Selected Unit Helpdesk Card */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex items-center space-x-2.5">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: selectedUnit.primaryColor }}
                    >
                      WA
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{selectedUnit.officerName}</h4>
                      <p className="text-[11px] font-mono text-slate-500">+{selectedUnit.phone}</p>
                    </div>
                  </div>

                  {/* Message Preview */}
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-600 italic">
                    &quot;{selectedUnit.greetingTemplate}&quot;
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleLaunchWhatsApp}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Mulai Chat WhatsApp Resmi</span>
              </button>
            </div>
          )}

          {/* TAB 2: FAQ Knowledgebase */}
          {activeTab === 'FAQ' && (
            <div className="p-4 flex-1 overflow-y-auto space-y-3 flex flex-col">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  placeholder="Cari pertanyaan (usia, tahfidz, biaya)..."
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-[#2D7A70] focus:outline-hidden"
                />
              </div>

              {/* Accordion FAQ Items */}
              <div className="space-y-2 flex-1 overflow-y-auto pr-1">
                {filteredFaq.length > 0 ? (
                  filteredFaq.map((faq) => {
                    const isExp = expandedFaq === faq.id;
                    return (
                      <div
                        key={faq.id}
                        className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50/50"
                      >
                        <button
                          type="button"
                          onClick={() => setExpandedFaq(isExp ? null : faq.id)}
                          className="w-full p-3 text-left flex items-start justify-between gap-2 text-xs font-bold text-slate-800 hover:bg-slate-100/60 transition-colors cursor-pointer"
                        >
                          <span>{faq.question}</span>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                              isExp ? 'rotate-180 text-[#2D7A70]' : ''
                            }`}
                          />
                        </button>
                        {isExp && (
                          <div className="p-3 pt-0 text-[11px] text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="py-8 text-center text-xs text-slate-400 italic">
                    Tidak menemukan jawaban yang sesuai. Silakan gunakan tab Chat WhatsApp untuk bertanya langsung.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer Note */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center text-[10px] text-slate-400 flex-shrink-0">
            Yayasan Pendidikan Imam Bonjol Majalengka
          </div>
        </div>
      )}
    </div>
  );
}
