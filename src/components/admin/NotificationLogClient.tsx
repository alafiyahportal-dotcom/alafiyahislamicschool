'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  Filter,
  Copy,
  Check,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  Send,
  Building2,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

export interface NotificationLogItem {
  id: string;
  recipientPhone: string;
  recipientName: string | null;
  eventType: string;
  messageContent: string;
  status: string;
  schoolName: string | null;
  schoolSlug: string | null;
  createdAt: string;
}

interface NotificationLogClientProps {
  initialLogs: NotificationLogItem[];
}

export default function NotificationLogClient({ initialLogs }: NotificationLogClientProps) {
  const [logs, setLogs] = useState<NotificationLogItem[]>(initialLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.recipientPhone.includes(searchTerm) ||
      (log.recipientName && log.recipientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      log.messageContent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.schoolName && log.schoolName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesEvent = selectedEvent === 'ALL' || log.eventType === selectedEvent;
    return matchesSearch && matchesEvent;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getEventBadge = (eventType: string) => {
    switch (eventType) {
      case 'PPDB_REGISTERED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Pendaftaran Baru</span>
          </span>
        );
      case 'PAYMENT_CONFIRMED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E8F3F1] text-[#184F48] border border-[#2D7A70]/30">
            <CheckCircle2 className="w-3 h-3 text-[#2D7A70]" />
            <span>Kuitansi Lunas</span>
          </span>
        );
      case 'TEST_SCHEDULED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
            <Calendar className="w-3 h-3 text-blue-600" />
            <span>Jadwal Observasi</span>
          </span>
        );
      case 'ADMISSION_ANNOUNCED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Hasil Kelulusan</span>
          </span>
        );
      case 'COMMISSION_EARNED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
            <span>Bonus Afiliasi</span>
          </span>
        );
      case 'PAYOUT_TRANSFERRED':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
            <CheckCircle2 className="w-3 h-3 text-teal-600" />
            <span>Transfer Komisi</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
            <span>{eventType}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-medium">Total Pesan Disimulasikan</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{logs.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-emerald-600 font-medium">Kuitansi Pembayaran</p>
          <p className="text-xl font-bold text-emerald-700 mt-1">
            {logs.filter((l) => l.eventType === 'PAYMENT_CONFIRMED').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-blue-600 font-medium">Undangan Observasi</p>
          <p className="text-xl font-bold text-blue-700 mt-1">
            {logs.filter((l) => l.eventType === 'TEST_SCHEDULED').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-purple-600 font-medium">Notifikasi Afiliasi</p>
          <p className="text-xl font-bold text-purple-700 mt-1">
            {logs.filter((l) => l.eventType === 'COMMISSION_EARNED' || l.eventType === 'PAYOUT_TRANSFERRED').length}
          </p>
        </div>
      </div>

      {/* Main Console Box (Google Workspace Style) */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center space-x-2 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari penerima, no HP, atau isi pesan..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#2D7A70] focus:ring-1 focus:ring-[#2D7A70]"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 focus:outline-hidden focus:border-[#2D7A70]"
            >
              <option value="ALL">Semua Jenis Notifikasi</option>
              <option value="PPDB_REGISTERED">Pendaftaran Baru</option>
              <option value="PAYMENT_CONFIRMED">Kuitansi Pembayaran Lunas</option>
              <option value="TEST_SCHEDULED">Jadwal Ujian Observasi</option>
              <option value="ADMISSION_ANNOUNCED">Hasil Seleksi / Kelulusan</option>
              <option value="COMMISSION_EARNED">Bonus Komisi Afiliasi</option>
              <option value="PAYOUT_TRANSFERRED">Pencairan Komisi Mitra</option>
            </select>
          </div>
        </div>

        {/* Logs List */}
        <div className="divide-y divide-slate-100">
          {filteredLogs.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="font-medium text-slate-600">Belum ada riwayat pesan WhatsApp</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Pesan akan otomatis dicatat saat formulir didaftarkan, diverifikasi, atau dijadwalkan
              </p>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row items-start justify-between gap-4"
              >
                {/* Left Metadata */}
                <div className="w-full md:w-72 flex-shrink-0 space-y-1.5">
                  <div className="flex items-center space-x-2">
                    {getEventBadge(log.eventType)}
                    <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {log.status}
                    </span>
                  </div>

                  <div className="text-sm font-bold text-slate-900 mt-1">
                    {log.recipientName || 'Calon Wali Murid'}
                  </div>

                  <a
                    href={`https://wa.me/${log.recipientPhone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 text-emerald-700 hover:text-emerald-800 font-mono text-xs font-semibold"
                  >
                    <Phone className="w-3 h-3 text-emerald-600" />
                    <span>+{log.recipientPhone}</span>
                  </a>

                  <div className="text-[11px] text-slate-400 flex items-center space-x-1 mt-1">
                    <Clock className="w-3 h-3" />
                    <span>{log.createdAt}</span>
                  </div>
                </div>

                {/* Right Message Body (WhatsApp Bubble Style) */}
                <div className="flex-1 w-full bg-[#f0f7f4] border border-emerald-200/60 rounded-2xl p-4 text-xs font-mono text-slate-800 relative group shadow-2xs">
                  <pre className="whitespace-pre-wrap font-sans text-xs text-slate-800 leading-relaxed">
                    {log.messageContent}
                  </pre>

                  {/* Copy Button */}
                  <div className="mt-3 pt-3 border-t border-emerald-200/50 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-sans">
                      Salin isi pesan untuk dikirim langsung via WhatsApp Web
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(log.id, log.messageContent)}
                      className="px-2.5 py-1 rounded-md bg-white border border-emerald-300 text-emerald-800 text-[11px] font-bold shadow-2xs hover:bg-emerald-50 transition-colors inline-flex items-center space-x-1 cursor-pointer"
                    >
                      {copiedId === log.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-emerald-700" />
                          <span>Salin Teks Pesan</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
