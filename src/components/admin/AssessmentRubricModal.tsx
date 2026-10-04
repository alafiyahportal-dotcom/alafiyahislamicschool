'use client';

import React, { useState, useEffect } from 'react';
import { X, Award, CheckCircle2, Save, Printer, AlertCircle } from 'lucide-react';
import { AssessmentSheetPrintModal } from './AssessmentSheetPrintModal';

interface AssessmentRubricModalProps {
  isOpen: boolean;
  onClose: () => void;
  registration: any;
  onSaved: () => void;
}

export const AssessmentRubricModal: React.FC<AssessmentRubricModalProps> = ({
  isOpen,
  onClose,
  registration,
  onSaved
}) => {
  const [interviewerName, setInterviewerName] = useState('');
  const [scores, setScores] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState('');
  const [syncStatus, setSyncStatus] = useState<string>('KEEP_CURRENT');
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [currentAssessment, setCurrentAssessment] = useState<any>(null);

  const unitSlug = registration?.school?.slug || 'sd';

  // Define criteria aspects per unit
  const criteriaMap: Record<string, Array<{ key: string; label: string; desc: string; weight: number }>> = {
    tk: [
      { key: 'motorik', label: 'Motorik Kasar & Halus', desc: 'Keseimbangan berjalan, koordinasi gerak, menggunting, meronce', weight: 0.25 },
      { key: 'kemandirian', label: 'Kemandirian & Toilet Training', desc: 'Kemampuan makan mandiri, memakai/melepas sepatu, toilet training', weight: 0.25 },
      { key: 'komunikasi', label: 'Komunikasi Verbal & Kognitif Dasar', desc: 'Kosakata, menjawab pertanyaan santun, pengenalan warna & angka', weight: 0.25 },
      { key: 'wawancaraOrtu', label: 'Wawancara Komitmen Orang Tua', desc: 'Kesiapan mendampingi, keselarasan pola asuh islami di rumah', weight: 0.25 }
    ],
    sd: [
      { key: 'tahsinIqro', label: 'Tahsin & Bacaan Iqro / Qur\'an', desc: 'Ketepatan makhorijul huruf, kelancaran bacaan jilid Iqro', weight: 0.30 },
      { key: 'calistung', label: 'Kesiapan Calistung Dasar', desc: 'Mengenal huruf & angka, menulis nama sendiri, hitung sederhana', weight: 0.25 },
      { key: 'suratPendek', label: 'Hafalan Surat Pendek & Doa', desc: 'Kelancaran hafalan An-Nas s/d Al-Fil, doa sebelum belajar/makan', weight: 0.25 },
      { key: 'wawancaraOrtu', label: 'Wawancara & Komitmen Ortu', desc: 'Dukungan pembiasaan shalat 5 waktu & program tahfidz di rumah', weight: 0.20 }
    ],
    smp: [
      { key: 'tahfidzTajwid', label: 'Uji Tahfidz & Tilawah Al-Qur\'an', desc: 'Kelancaran hafalan, hukum tajwid (mad, ghunnah), tartil tilawah', weight: 0.35 },
      { key: 'potensiAkademik', label: 'Tes Potensi Akademik & Agama', desc: 'Logika matematika dasar, pemahaman fiqih ibadah & aqidah', weight: 0.25 },
      { key: 'kesiapanAsrama', label: 'Kesiapan Belajar & Kemandirian Murid', desc: 'Motivasi belajar, kemandirian karakter, adab pergaulan islami', weight: 0.25 },
      { key: 'wawancaraOrtu', label: 'Wawancara Komitmen Wali Murid', desc: 'Kepatuhan tata tertib sekolah terpadu, pembinaan berkelanjutan di rumah', weight: 0.15 }
    ]
  };

  const activeCriteria = criteriaMap[unitSlug] || criteriaMap.sd;

  useEffect(() => {
    if (registration) {
      // Set default interviewer
      if (unitSlug === 'tk') {
        setInterviewerName('Ibu Siti Aminah, S.Pd.');
      } else if (unitSlug === 'smp') {
        setInterviewerName('Bpk. Muhammad Ridwan, M.Pd.');
      } else {
        setInterviewerName('Bpk. Ahmad Fauzi, M.Ag.');
      }

      // Check if existing assessment in registration
      if (registration.assessment) {
        setCurrentAssessment(registration.assessment);
        setInterviewerName(registration.assessment.interviewerName || '');
        setNotes(registration.assessment.notes || '');
        try {
          const parsed = typeof registration.assessment.aspectScores === 'string'
            ? JSON.parse(registration.assessment.aspectScores)
            : registration.assessment.aspectScores;
          setScores(parsed || {});
        } catch (e) {
          setScores({});
        }
      } else {
        // Init default scores (e.g. 85 for all)
        const initScores: Record<string, number> = {};
        activeCriteria.forEach(c => {
          initScores[c.key] = 85;
        });
        setScores(initScores);
        setNotes('Ananda murid berakhlak baik, antusias selama observasi, dan orang tua kooperatif mendukung visi yayasan.');
      }
    }
  }, [registration, unitSlug]);

  if (!isOpen || !registration) return null;

  // Calculate weighted total score
  let calculatedTotal = 0;
  activeCriteria.forEach(c => {
    const s = scores[c.key] || 0;
    calculatedTotal += s * c.weight;
  });
  calculatedTotal = Math.round(calculatedTotal * 10) / 10;

  let recommendation = 'RECOMMENDED';
  if (calculatedTotal >= 80) {
    recommendation = 'RECOMMENDED';
  } else if (calculatedTotal >= 70) {
    recommendation = 'CONSIDERED';
  } else {
    recommendation = 'NOT_RECOMMENDED';
  }

  const handleScoreChange = (key: string, value: string) => {
    const num = Math.min(100, Math.max(0, parseInt(value, 10) || 0));
    setScores(prev => ({ ...prev, [key]: num }));
  };

  const handleSave = async () => {
    setLoading(true);
    setSaveMessage(null);
    setErrorMessage(null);

    try {
      const payload: any = {
        registrationId: registration.id,
        interviewerName,
        aspectScores: scores,
        totalScore: calculatedTotal,
        recommendation,
        notes
      };

      if (syncStatus === 'ACCEPTED' || syncStatus === 'REJECTED') {
        payload.syncStatus = syncStatus;
      }

      const res = await fetch('/api/admin/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Gagal menyimpan nilai asesmen');
      }

      setSaveMessage(`Nilai berhasil disimpan! Skor Akhir: ${calculatedTotal} (${recommendation})`);
      setCurrentAssessment(json.data);
      onSaved();
    } catch (e: any) {
      setErrorMessage(e.message || 'Terjadi kesalahan sistem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden my-6 border border-slate-200">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-[#184F48] text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2D7A70] flex items-center justify-center text-white shadow-inner">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold">Instrumen & Rubrik Asesmen Observasi</h3>
                <p className="text-xs text-emerald-200">
                  {registration.studentName} ({registration.registrationNo}) • {registration.school?.name}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-[#2D7A70] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Feedback Alerts */}
            {saveMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{saveMessage}</span>
              </div>
            )}
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Examiner Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Guru / Penguji Observasi:
                </label>
                <input
                  type="text"
                  value={interviewerName}
                  onChange={(e) => setInterviewerName(e.target.value)}
                  placeholder="Nama penguji & gelar"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2D7A70]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Status PPDB Saat Ini:
                </label>
                <div className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>{registration.status}</span>
                  <span className="text-[10px] text-slate-500 font-normal">Gelombang 1</span>
                </div>
              </div>
            </div>

            {/* Rubric Criteria Inputs */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Kriteria Penilaian ({registration.school?.unitLevel} IT)
                </h4>
                <span className="text-[11px] text-slate-500">Skala 0 - 100 per Aspek</span>
              </div>

              <div className="space-y-3">
                {activeCriteria.map((criterion, idx) => (
                  <div
                    key={criterion.key}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-[#2D7A70]/50 transition-colors bg-white shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-[#E8F3F1] text-[#184F48] font-bold text-[10px] flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-slate-900">{criterion.label}</span>
                          <span className="text-[10px] font-semibold text-[#2D7A70] bg-[#E8F3F1] px-2 py-0.5 rounded-full">
                            Bobot {Math.round(criterion.weight * 100)}%
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 pl-7">{criterion.desc}</p>
                      </div>

                      {/* Score Input & Slider */}
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={scores[criterion.key] || 0}
                          onChange={(e) => handleScoreChange(criterion.key, e.target.value)}
                          className="w-24 accent-[#2D7A70] cursor-pointer hidden sm:block"
                        />
                        <div className="w-16">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={scores[criterion.key] !== undefined ? scores[criterion.key] : ''}
                            onChange={(e) => handleScoreChange(criterion.key, e.target.value)}
                            className="w-full text-center px-2 py-1.5 text-xs font-bold border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D7A70] bg-slate-50"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Real-time Summary Card */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#E8F3F1] to-emerald-50 border border-[#2D7A70]/30 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600 font-medium">Kalkulasi Skor Tertimbang:</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-bold tracking-tight text-[#184F48] tabular-nums">{calculatedTotal}</span>
                  <span className="text-xs text-slate-500 font-medium">/ 100</span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">
                  Rekomendasi Hasil:
                </p>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    recommendation === 'RECOMMENDED'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : recommendation === 'CONSIDERED'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-rose-600 text-white shadow-xs'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    {recommendation === 'RECOMMENDED' && 'Sangat Direkomendasikan (Lulus)'}
                    {recommendation === 'CONSIDERED' && 'Dipertimbangkan (Cadangan)'}
                    {recommendation === 'NOT_RECOMMENDED' && 'Belum Memenuhi Kriteria'}
                  </span>
                </span>
              </div>
            </div>

            {/* Notes Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Catatan Guru Penguji / Rekomendasi Khusus:
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Catatan perkembangan tahfidz, kemandirian anak, atau kesiapan orang tua..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2D7A70]"
              />
            </div>

            {/* Auto Status Sync Selector */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs">
              <label className="block font-bold text-amber-900 mb-1">
                Sinkronisasi Status PPDB Langsung:
              </label>
              <div className="flex flex-wrap gap-2 mt-1.5">
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-800">
                  <input
                    type="radio"
                    name="syncStatus"
                    checked={syncStatus === 'KEEP_CURRENT'}
                    onChange={() => setSyncStatus('KEEP_CURRENT')}
                    className="accent-[#2D7A70]"
                  />
                  <span>Pertahankan Status Saat Ini ({registration.status})</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-emerald-800 font-semibold">
                  <input
                    type="radio"
                    name="syncStatus"
                    checked={syncStatus === 'ACCEPTED'}
                    onChange={() => setSyncStatus('ACCEPTED')}
                    className="accent-[#2D7A70]"
                  />
                  <span>Otomatis Terima Murid (ACCEPTED)</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-rose-800 font-semibold">
                  <input
                    type="radio"
                    name="syncStatus"
                    checked={syncStatus === 'REJECTED'}
                    onChange={() => setSyncStatus('REJECTED')}
                    className="accent-[#2D7A70]"
                  />
                  <span>Tandai Tidak Lolos (REJECTED)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200">
            <div>
              {currentAssessment && (
                <button
                  type="button"
                  onClick={() => setIsPrintOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>Cetak Berita Acara A4</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-[#2D7A70] hover:bg-[#184F48] rounded-lg transition-all cursor-pointer shadow-md disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Menyimpan...' : 'Simpan Nilai Asesmen'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Print Modal */}
      {currentAssessment && (
        <AssessmentSheetPrintModal
          isOpen={isPrintOpen}
          onClose={() => setIsPrintOpen(false)}
          registration={registration}
          assessment={currentAssessment}
        />
      )}
    </>
  );
};
