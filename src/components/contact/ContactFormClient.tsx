'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, MessageSquare, User, Phone, Mail, HelpCircle } from 'lucide-react';

export default function ContactFormClient() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    unit: 'Semua Unit / Yayasan',
    subject: 'Informasi Pendaftaran PPDB',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    // Direct routing based on unit selection
    let targetPhone = '6281223344552';
    if (formData.unit.includes('SD IT') || formData.unit.includes('SDIT')) {
      targetPhone = '62895322226104';
    }

    // Open WhatsApp with formatted inquiry text
    const text = encodeURIComponent(
      `Assalamu'alaikum Warahmatullahi Wabarakatuh,\n\nNama: ${formData.name}\nNo. WhatsApp: ${formData.phone}\nUnit Minat: ${formData.unit}\nTopik: ${formData.subject}\n\nPesan:\n${formData.message}`
    );
    window.open(`https://wa.me/${targetPhone}?text=${text}`, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80">
      <div className="mb-6">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#184F48] uppercase tracking-wider mb-2">
          <MessageSquare className="w-4 h-4 text-[#2D7A70]" />
          <span>Formulir Layanan Konsultasi</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Kirimkan Pesan atau Pertanyaan Anda
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Tim sekretariat kami akan merespons pertanyaan Anda via WhatsApp atau email dalam kurun waktu 1x24 jam kerja.
        </p>
      </div>

      {submitted ? (
        <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-emerald-900">
            Pesan Berhasil Diteruskan!
          </h4>
          <p className="text-xs text-emerald-700 max-w-sm mx-auto">
            Jendela WhatsApp telah terbuka untuk terhubung langsung dengan Layanan Sekretariat Al-Afiyah.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="text-xs font-bold text-[#184F48] underline hover:text-[#123E38] pt-2"
          >
            Kirim Pesan Lain
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nama Lengkap Orang Tua / Murid *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Bapak H. Hendra Gunawan"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#184F48]/20 focus:border-[#184F48]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nomor WhatsApp Aktif *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="08xxxxxxxxxx"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#184F48]/20 focus:border-[#184F48]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Unit Pendidikan yang Dituju
              </label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#184F48]/20 focus:border-[#184F48]"
              >
                <option value="Semua Unit / Yayasan">Semua Unit / Yayasan</option>
                <option value="TK IT Al-Afiyah">TK IT Al-Afiyah (PAUD/TK)</option>
                <option value="SD IT Al-Afiyah">SDIT Al-Afiyah (Smart Akhlaq Fitrah - SPMB)</option>
                <option value="SMP IT Al-Afiyah">SMP IT Al-Afiyah (Fullday School)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Topik Keperluan
              </label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#184F48]/20 focus:border-[#184F48]"
              >
                <option value="Informasi Pendaftaran PPDB">Informasi Pendaftaran PPDB</option>
                <option value="Biaya & Beasiswa Tahfidz">Biaya &amp; Beasiswa Tahfidz</option>
                <option value="Jadwal Kunjungan Sekolah">Jadwal Kunjungan Sekolah</option>
                <option value="Konfirmasi Pembayaran">Konfirmasi Pembayaran</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Pesan / Pertanyaan Detail
            </label>
            <textarea
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tuliskan pertanyaan atau informasi yang ingin Anda konsultasikan..."
              className="w-full p-3.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#184F48]/20 focus:border-[#184F48]"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#184F48] hover:bg-[#123E38] text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center space-x-2"
          >
            <span>Kirim Pesan via WhatsApp</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      )}
    </div>
  );
}
