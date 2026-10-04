'use client';

import React, { useState, useEffect } from 'react';
import {
  Radio,
  Send,
  Users,
  CheckCircle2,
  Clock,
  Share2,
  AlertCircle,
  MessageSquare,
  School,
  ExternalLink,
  ChevronRight,
  Filter,
  Check,
  RotateCcw,
  ShieldCheck,
  Info
} from 'lucide-react';

interface RecipientItem {
  id: string;
  studentName: string;
  parentName: string;
  phone: string;
  registrationNo: string;
  schoolName: string;
  schoolSlug: string;
  status: string;
}

interface SegmentCounts {
  PAYMENT_PENDING: number;
  VERIFIED: number;
  ACCEPTED: number;
  ALL_APPLICANTS: number;
  AFFILIATE_ACTIVE: number;
}

interface BroadcastManagerClientProps {
  initialCounts: SegmentCounts;
  initialRecipients: RecipientItem[];
  defaultSchoolSlug?: string;
  isUnitScoped?: boolean;
  schoolName?: string;
}

const CANNED_TEMPLATES: Record<string, { title: string; text: string }> = {
  KELULUSAN: {
    title: '🎉 Pengumuman Kelulusan & Arahan Daftar Ulang',
    text: `Assalamu'alaikum Warahmatullahi Wabarakatuh.
Yth. Bapak/Ibu {nama_wali},

Alhamdulillah! Panitia PPDB *{nama_sekolah}* mengumumkan bahwa calon murid atas nama:
👤 *Nama:* {nama_murid}
📋 *No. Registrasi:* {no_registrasi}

Dinyatakan *LOLOS SELEKSI & RESMI DITERIMA* Tahun Ajaran 2026/2027.

Silakan unduh Surat Keputusan (SK) Kelulusan dan Kartu Tanda Murid (KTM) Digital melalui tautan resmi:
🔗 {link_portal}

Jadwal Daftar Ulang & Ukur Seragam: 1 - 10 Oktober 2026 di kantor tata usaha sekolah.

Jazakumullah Khairan Katsiran.
_Panitia PPDB Yayasan Pendidikan Imam Bonjol Majalengka_`,
  },
  UNDANGAN_TES: {
    title: '📅 Undangan Observasi & Wawancara',
    text: `Assalamu'alaikum Warahmatullahi Wabarakatuh.
Yth. Bapak/Ibu {nama_wali},

Berikut kami sampaikan jadwal tes observasi & wawancara pemetaan murid baru di *{nama_sekolah}*:
👤 *Nama Murid:* {nama_murid}
📋 *No. Registrasi:* {no_registrasi}

Mohon hadir 15 menit sebelum jadwal dengan membawa cetak Kartu Ujian dari portal murid:
🔗 {link_portal}

Informasi lebih lanjut hubungi nomor layanan helpdesk resmi kami.

Wassalamu'alaikum Wr. Wb.
_Panitia PPDB Yayasan Pendidikan Imam Bonjol Majalengka_`,
  },
  PENGINGAT_BAYAR: {
    title: '⏳ Pengingat Batas Pembayaran Formulir',
    text: `Assalamu'alaikum Warahmatullahi Wabarakatuh.
Yth. Bapak/Ibu {nama_wali},

Terima kasih atas pendaftaran ananda *{nama_murid}* ({no_registrasi}) di *{nama_sekolah}*.

Mengingat kuota kelas gelombang ini hampir terpenuhi, kami mengingatkan agar segera menyelesaikan pembayaran formulir pendaftaran untuk mengunci nomor antrean verifikasi berkas:
🔗 {link_portal}

Pembayaran dapat dilakukan melalui QRIS instan atau Virtual Account bank syariah/nasional.

Jazakumullah Khairan Katsiran.
_Panitia PPDB Yayasan Pendidikan Imam Bonjol Majalengka_`,
  },
  MOTIVASI_AFILIASI: {
    title: '🤝 Kabar & Evaluasi Kemitraan Afiliasi',
    text: `Assalamu'alaikum Warahmatullahi Wabarakatuh.
Yth. Mitra Afiliasi {nama_murid},

Alhamdulillah, antusiasme pendaftaran murid baru Yayasan Imam Bonjol Majalengka terus meningkat.

Terima kasih atas syiar dan rekomendasi yang telah Anda bagikan. Pantau perolehan komisi dan riwayat pencairan saldo referral Anda melalui tautan:
🔗 https://alafiyah.sch.id/affiliate/dashboard

Mari terus perluas keberkahan dakwah pendidikan Al-Qur'an bersama Al-Afiyah!
_Tim Kemitraan Yayasan Pendidikan Imam Bonjol_`,
  },
};

export default function BroadcastManagerClient({
  initialCounts,
  initialRecipients,
  defaultSchoolSlug = 'all',
  isUnitScoped = false,
  schoolName,
}: BroadcastManagerClientProps) {
  const [segment, setSegment] = useState<string>('ACCEPTED');
  const [schoolSlug, setSchoolSlug] = useState<string>(defaultSchoolSlug);
  const [counts, setCounts] = useState<SegmentCounts>(initialCounts);
  const [recipients, setRecipients] = useState<RecipientItem[]>(initialRecipients);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoadingRecipients, setIsLoadingRecipients] = useState(false);

  // Template state
  const [activeTemplateKey, setActiveTemplateKey] = useState<string>('KELULUSAN');
  const [messageContent, setMessageContent] = useState<string>(
    CANNED_TEMPLATES.KELULUSAN.text
  );
  const [broadcastTitle, setBroadcastTitle] = useState<string>(
    'Pengumuman Kelulusan PPDB 2026/2027'
  );

  // Send state
  const [isSending, setIsSending] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [sendSuccess, setSendSuccess] = useState<{
    totalSent: number;
    title: string;
  } | null>(null);

  // Fetch recipients when segment or school changes
  useEffect(() => {
    let isMounted = true;
    async function fetchRecipients() {
      setIsLoadingRecipients(true);
      try {
        const res = await fetch(
          `/api/admin/broadcast?segment=${segment}&schoolSlug=${schoolSlug}`
        );
        const data = await res.json();
        if (data.success && isMounted) {
          setRecipients(data.recipients || []);
          if (data.segmentCounts) setCounts(data.segmentCounts);
          // Default select all
          setSelectedIds((data.recipients || []).map((r: RecipientItem) => r.id));
        }
      } catch (err) {
        console.error('Error loading recipients:', err);
      } finally {
        if (isMounted) setIsLoadingRecipients(false);
      }
    }

    fetchRecipients();
    return () => {
      isMounted = false;
    };
  }, [segment, schoolSlug]);

  const handleSelectTemplate = (key: string) => {
    setActiveTemplateKey(key);
    setMessageContent(CANNED_TEMPLATES[key].text);
    setBroadcastTitle(CANNED_TEMPLATES[key].title);
  };

  const handleInsertToken = (token: string) => {
    setMessageContent((prev) => `${prev} ${token}`);
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === recipients.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(recipients.map((r) => r.id));
    }
  };

  const handleToggleRecipient = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Preview token replacement using the first selected recipient (or placeholder)
  const sampleRecipient = recipients[0] || {
    studentName: 'Muhammad Rayyan Al-Ghifari',
    parentName: 'Hendra Gunawan',
    registrationNo: 'REG-SD-2026-0001',
    schoolName: 'SD IT Al-Afiyah',
  };

  const previewMessage = messageContent
    .replace(/{nama_murid}/g, sampleRecipient.studentName)
    .replace(/{nama_wali}/g, sampleRecipient.parentName)
    .replace(/{no_registrasi}/g, sampleRecipient.registrationNo)
    .replace(/{nama_sekolah}/g, sampleRecipient.schoolName)
    .replace(
      /{link_portal}/g,
      `https://alafiyah.sch.id/portal/ppdb/${sampleRecipient.registrationNo}`
    );

  const handleExecuteBroadcast = async () => {
    setIsSending(true);
    try {
      const res = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          segment,
          schoolSlug,
          templateContent: messageContent,
          recipientIds: selectedIds,
          broadcastTitle,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setSendSuccess({
          totalSent: result.totalSent,
          title: broadcastTitle,
        });
        setShowConfirmModal(false);
      } else {
        alert(result.error || 'Gagal mengirim pesan siaran');
      }
    } catch (err) {
      console.error('Broadcast error:', err);
      alert('Terjadi kendala jaringan saat memproses siaran');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md bg-[#E8F3F1] text-[#184F48] text-xs font-bold mb-2">
            <Radio className="w-3.5 h-3.5 text-[#2D7A70] animate-pulse" />
            <span>Pusat Notifikasi Siaran Terpadu</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            WhatsApp Broadcast Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Kirimkan notifikasi massal terarah kepada kelompok calon wali murid dan mitra afiliasi dalam 1-klik.
          </p>
        </div>

        {/* Action Link to Logs */}
        <div className="flex items-center space-x-3">
          <a
            href={isUnitScoped && defaultSchoolSlug !== 'all' ? `/admin/${defaultSchoolSlug}/notifications` : '/admin/foundation/notifications'}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
          >
            <MessageSquare className="w-4 h-4 text-slate-400" />
            <span>Audit Log Notifikasi</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>
      </div>

      {/* Success Notification Alert */}
      {sendSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex items-start justify-between gap-4 animate-in fade-in duration-300">
          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-900">
                Siaran Massal Berhasil Terkirim!
              </h3>
              <p className="text-xs text-emerald-700 mt-0.5">
                Sebanyak <span className="font-bold">{sendSuccess.totalSent} pesan WhatsApp</span> untuk program &quot;{sendSuccess.title}&quot; telah berhasil dicatat dan disimulasikan ke dalam database `NotificationLog`.
              </p>
              <div className="mt-2 flex items-center space-x-3">
                <a
                  href="/admin/foundation/notifications"
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-900 underline flex items-center space-x-1"
                >
                  <span>Lihat Riwayat Audit Pesan</span>
                  <ChevronRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
          <button
            onClick={() => setSendSuccess(null)}
            className="text-emerald-500 hover:text-emerald-800 p-1 text-xs font-bold"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Segment Selector & School Filter */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {/* Button Segment 1: Lolos Seleksi */}
        <button
          onClick={() => setSegment('ACCEPTED')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            segment === 'ACCEPTED'
              ? 'bg-[#E8F3F1] border-[#2D7A70] ring-2 ring-[#2D7A70]/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Murid Diterima
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            {counts.ACCEPTED}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Kelulusan &amp; Daftar Ulang</p>
        </button>

        {/* Button Segment 2: Siap Ujian/Observasi */}
        <button
          onClick={() => setSegment('VERIFIED')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            segment === 'VERIFIED'
              ? 'bg-[#E8F3F1] border-[#2D7A70] ring-2 ring-[#2D7A70]/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Berkas Sah
            </span>
            <Clock className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            {counts.VERIFIED}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Undangan Ujian Observasi</p>
        </button>

        {/* Button Segment 3: Belum Bayar */}
        <button
          onClick={() => setSegment('PAYMENT_PENDING')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            segment === 'PAYMENT_PENDING'
              ? 'bg-[#E8F3F1] border-[#2D7A70] ring-2 ring-[#2D7A70]/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Belum Bayar
            </span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            {counts.PAYMENT_PENDING}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Pengingat Tagihan Formulir</p>
        </button>

        {/* Button Segment 4: Semua Pendaftar */}
        <button
          onClick={() => setSegment('ALL_APPLICANTS')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            segment === 'ALL_APPLICANTS'
              ? 'bg-[#E8F3F1] border-[#2D7A70] ring-2 ring-[#2D7A70]/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Semua Murid
            </span>
            <Users className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            {counts.ALL_APPLICANTS}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Seluruh Pendaftar PPDB</p>
        </button>

        {/* Button Segment 5: Mitra Afiliasi */}
        <button
          onClick={() => setSegment('AFFILIATE_ACTIVE')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            segment === 'AFFILIATE_ACTIVE'
              ? 'bg-[#E8F3F1] border-[#2D7A70] ring-2 ring-[#2D7A70]/20 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Mitra Afiliasi
            </span>
            <Share2 className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
            {counts.AFFILIATE_ACTIVE}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Guru &amp; Alumni Mitra</p>
        </button>
      </div>

      {/* Main Workspace Grid (Editor Left, WhatsApp Live Preview Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Template Library & Message Editor (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            
            {/* Filter Unit Sekolah */}
            {segment !== 'AFFILIATE_ACTIVE' && (
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                  <Filter className="w-3.5 h-3.5 text-[#2D7A70]" />
                  <span>Saring Unit Sekolah:</span>
                </span>
                {isUnitScoped ? (
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold">
                    {schoolName || defaultSchoolSlug.toUpperCase()}
                  </span>
                ) : (
                  <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-xl text-xs">
                    {[
                      { slug: 'all', label: 'Semua' },
                      { slug: 'tk', label: 'TK IT' },
                      { slug: 'sd', label: 'SD IT' },
                      { slug: 'smp', label: 'SMP IT' },
                    ].map((u) => (
                      <button
                        key={u.slug}
                        onClick={() => setSchoolSlug(u.slug)}
                        className={`px-3 py-1 rounded-lg font-bold transition ${
                          schoolSlug === u.slug
                            ? 'bg-white text-[#184F48] shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {u.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Canned Templates Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Pilih Template Pesan Siaran Cepat:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(CANNED_TEMPLATES).map(([key, t]) => (
                  <button
                    key={key}
                    onClick={() => handleSelectTemplate(key)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition ${
                      activeTemplateKey === key
                        ? 'bg-[#E8F3F1] border-[#2D7A70] text-[#184F48]'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {t.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Broadcast Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Judul Agenda Siaran (Internal Admin):
              </label>
              <input
                type="text"
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2D7A70]"
              />
            </div>

            {/* Dynamic Tokens Inserter */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Sisipkan Variabel Personalisasi Cerdas:
                </label>
                <span className="text-[11px] text-slate-400">Klik untuk menyisipkan</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { token: '{nama_murid}', label: '👤 Nama Murid' },
                  { token: '{nama_wali}', label: '👨‍👩‍👦 Nama Wali' },
                  { token: '{no_registrasi}', label: '📋 No. Registrasi' },
                  { token: '{nama_sekolah}', label: '🏫 Unit Sekolah' },
                  { token: '{link_portal}', label: '🔗 Link Portal Murid' },
                ].map((t) => (
                  <button
                    key={t.token}
                    type="button"
                    onClick={() => handleInsertToken(t.token)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#E8F3F1] hover:text-[#184F48] border border-slate-200 text-[11px] font-mono font-medium text-slate-700 transition"
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Isi Pesan WhatsApp:
              </label>
              <textarea
                rows={10}
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2D7A70] leading-relaxed resize-y"
              />
            </div>

            {/* Send Trigger Button */}
            <div className="pt-2 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                Target Terpilih:{' '}
                <span className="font-bold text-slate-900">
                  {selectedIds.length} dari {recipients.length} Penerima
                </span>
              </div>

              <button
                type="button"
                disabled={selectedIds.length === 0 || isSending}
                onClick={() => setShowConfirmModal(true)}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#184F48] hover:bg-[#2D7A70] disabled:bg-slate-300 text-white font-bold text-xs sm:text-sm shadow-sm transition"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Siaran Massal ({selectedIds.length})</span>
              </button>
            </div>
          </div>

          {/* Recipient Picker Table */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Daftar Calon Penerima ({recipients.length})
                </h3>
                <p className="text-[11px] text-slate-500">
                  Pilih murid yang akan menerima pesan siaran ini.
                </p>
              </div>
              <button
                type="button"
                onClick={handleToggleSelectAll}
                className="text-xs font-bold text-[#2D7A70] hover:underline"
              >
                {selectedIds.length === recipients.length
                  ? 'Batal Pilih Semua'
                  : 'Pilih Semua'}
              </button>
            </div>

            {isLoadingRecipients ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Memuat daftar penerima...
              </div>
            ) : recipients.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Tidak ada penerima yang cocok dengan segmen ini.
              </div>
            ) : (
              <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-xl">
                {recipients.map((r) => {
                  const isChecked = selectedIds.includes(r.id);
                  return (
                    <div
                      key={r.id}
                      onClick={() => handleToggleRecipient(r.id)}
                      className={`p-2.5 flex items-center justify-between cursor-pointer text-xs transition ${
                        isChecked ? 'bg-[#F9FCFB]' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="rounded border-slate-300 text-[#2D7A70] focus:ring-[#2D7A70]"
                        />
                        <div>
                          <div className="font-bold text-slate-900">
                            {r.studentName}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Wali: {r.parentName} • {r.registrationNo}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[11px] font-mono text-slate-600">
                          {r.phone}
                        </div>
                        <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                          {r.schoolSlug.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Authentic WhatsApp Chat Bubble Live Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#EFEAE2] rounded-2xl p-4 sm:p-5 border border-slate-300 shadow-sm relative overflow-hidden">
            {/* WhatsApp Header Bar Mockup */}
            <div className="bg-[#128C7E] text-white -mx-4 -mt-4 sm:-mx-5 sm:-mt-5 p-3.5 flex items-center space-x-3 shadow-xs">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                IB
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold truncate">
                  Panitia PPDB Al-Afiyah Majalengka
                </div>
                <div className="text-[10px] text-white/80">Online Resmi</div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
                SIMULATOR
              </span>
            </div>

            {/* WhatsApp Chat Bubble */}
            <div className="mt-4 space-y-3">
              <div className="text-center">
                <span className="text-[10px] font-semibold bg-white/80 text-slate-600 px-2.5 py-0.5 rounded-full shadow-2xs">
                  HARI INI
                </span>
              </div>

              <div className="bg-[#DCF8C6] rounded-2xl rounded-tl-xs p-3.5 shadow-2xs text-xs text-slate-900 whitespace-pre-wrap font-sans leading-relaxed border border-[#C5E1A5]/50">
                {previewMessage}

                <div className="mt-2 flex items-center justify-end space-x-1 text-[10px] text-slate-500">
                  <span>
                    {new Date().toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span className="text-[#34B7F1] font-bold">✓✓</span>
                </div>
              </div>
            </div>

            {/* Chat Disclaimer Callout */}
            <div className="mt-4 p-3 rounded-xl bg-white/70 border border-slate-200 text-[11px] text-slate-600 flex items-start space-x-2">
              <Info className="w-4 h-4 text-teal-700 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800">Mode Pratinjau Dinamis:</span>{' '}
                Pratinjau di atas merefleksikan pesan yang diterima oleh contoh murid{' '}
                <span className="font-semibold text-slate-900">{sampleRecipient.studentName}</span>. Variabel akan berganti otomatis untuk setiap penerima.
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Send className="w-6 h-6 text-amber-700" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                Konfirmasi Siaran Notifikasi Massal
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Anda akan mengirimkan pesan siaran kepada{' '}
                <span className="font-bold text-slate-900">
                  {selectedIds.length} penerima
                </span>{' '}
                dalam segmen <span className="font-bold text-teal-700">{segment}</span>.
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
              <div>
                <span className="text-slate-400">Agenda:</span>{' '}
                <span className="font-semibold">{broadcastTitle}</span>
              </div>
              <div>
                <span className="text-slate-400">Total Pesan:</span>{' '}
                <span className="font-bold text-slate-900">{selectedIds.length} Target</span>
              </div>
              <div>
                <span className="text-slate-400">Pencatatan:</span>{' '}
                <span className="text-emerald-700 font-semibold">
                  Tersimpan di Prisma NotificationLog
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                disabled={isSending}
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isSending}
                onClick={handleExecuteBroadcast}
                className="px-4 py-2 rounded-xl bg-[#184F48] hover:bg-[#2D7A70] text-white text-xs font-bold shadow-xs flex items-center space-x-1.5"
              >
                {isSending ? (
                  <span>Mengirimkan Pesan...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Luncurkan Sekarang</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
