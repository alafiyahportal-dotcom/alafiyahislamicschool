'use client';

import React, { useState } from 'react';
import { Navigation, MessageCircle, Copy, Check } from 'lucide-react';

interface CampusLocationMapSectionProps {
  unitSlug?: 'all' | 'foundation' | 'sd' | 'tk' | 'smp';
}

export default function CampusLocationMapSection({ unitSlug = 'foundation' }: CampusLocationMapSectionProps) {
  const [copied, setCopied] = useState(false);

  const isFoundation = unitSlug === 'foundation' || unitSlug === 'all';
  const isSd = unitSlug === 'sd';
  const isTk = unitSlug === 'tk';
  const isSmp = unitSlug === 'smp';

  const sectionTitle = isFoundation
    ? 'Lokasi Lingkungan Sekolah Islam Terpadu Al-Afiyah'
    : `Lokasi ${
        isSd ? 'SD IT Al-Afiyah' : isTk ? 'TK IT Al-Afiyah' : isSmp ? 'SMP IT Al-Afiyah' : 'Sekolah Al-Afiyah'
      }`;

  const sectionSubtitle = isFoundation
    ? 'Seluruh unit pendidikan (PAUD/TK IT, SD IT, dan SMP IT Al-Afiyah) berada berdampingan dalam satu kawasan kompleks kampus terpadu yang asri, tenang, dan strategis di Majalengka.'
    : `Lingkungan sekolah ${
        isSd ? 'SD IT Al-Afiyah' : isTk ? 'TK IT Al-Afiyah' : 'SMP IT Al-Afiyah'
      } terletak di kawasan yang asri, tenang, dan mudah diakses di Majalengka.`;

  const addressLabel = isFoundation ? 'Alamat Kompleks Kampus Terpadu' : 'Alamat Sekolah';

  const schoolAddress =
    isFoundation || isSd
      ? 'Lingkungan Giri Asih - Jl. Gerakan Koperasi, Babakan Jawa, Kel. Majalengka Wetan, Kec. Majalengka, Jawa Barat 45411'
      : isTk
      ? 'Kompleks Pendidikan Islam Imam Bonjol, Babakan Jawa, Kec. Majalengka, Kab. Majalengka, Jawa Barat 45419'
      : 'Jl. Gerakan Koperasi No. 110, Kel. Majalengka Wetan, Kec. Majalengka, Kab. Majalengka, Jawa Barat 45411';

  const mapQuery = isFoundation || isSd
    ? '-6.8367783,108.237785'
    : isTk
    ? 'Babakan Jawa Majalengka Jawa Barat'
    : 'Jl Gerakan Koperasi No 110 Majalengka Wetan Jawa Barat';

  const mapZoom = isFoundation || isSd ? 18 : 16;

  const phone = isFoundation
    ? '+62 895-3222-26104 / +62 812-2334-4552'
    : isSd
    ? '+62 895-3222-26104'
    : '+62 812-2334-4552';
  const phoneRaw = isFoundation || isSd ? '62895322226104' : '6281223344552';

  const hours = isFoundation
    ? 'Senin – Jum\'at: 07.00 – 15.00 WIB'
    : isSd
    ? 'Senin – Jum\'at: 07.00 – 14.30 WIB'
    : isTk
    ? 'Senin – Jum\'at: 07.30 – 11.30 WIB'
    : 'Senin – Sabtu: 07.00 – 16.00 WIB';

  const hoursSub = isFoundation
    ? 'Layanan Terpadu Seluruh Unit (Sabtu & Ahad: Layanan Online)'
    : 'Sabtu & Ahad: Layanan Informasi Online';

  const handleCopy = () => {
    navigator.clipboard.writeText(schoolAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const googleMapsUrl = isFoundation || isSd
    ? 'https://www.google.com/maps/dir/?api=1&destination=-6.8367783,108.237785'
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
  const iframeSrc = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=${mapZoom}&ie=UTF8&iwloc=&output=embed`;

  return (
    <section id="lokasi-sekolah" className="py-16 sm:py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Clean Header: Solid text, no text gradient, no floating badge */}
        <div className="mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {sectionTitle}
          </h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-3xl">
            {sectionSubtitle}
          </p>
        </div>

        {/* Clean 2-Column Grid: Left Info, Right Map (Completely Unobstructed) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Info Card: Simple, spacious, professional */}
          <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-6 sm:p-7 border border-slate-200 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Alamat */}
              <div>
                {isFoundation && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/80 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                    <span>Satu Kompleks Berdampingan: TK IT • SD IT • SMP IT</span>
                  </div>
                )}
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  {addressLabel}
                </p>
                <p className="text-sm font-medium text-slate-800 leading-relaxed">
                  {schoolAddress}
                </p>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="mt-2.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Alamat berhasil disalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Alamat</span>
                    </>
                  )}
                </button>
              </div>

              {/* Jam Layanan */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Jam Pelayanan &amp; Kunjungan
                </p>
                <p className="text-sm font-medium text-slate-800">
                  {hours}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {hoursSub}
                </p>
              </div>

              {/* Kontak */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Hotline Panitia
                </p>
                <a
                  href={`https://wa.me/${phoneRaw}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold text-slate-900 hover:text-emerald-700 transition-colors"
                >
                  {phone}
                </a>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 mt-6 border-t border-slate-200 flex flex-col sm:flex-row lg:flex-col gap-3">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 text-center"
              >
                <Navigation className="w-4 h-4 text-emerald-400" />
                <span>Petunjuk Arah (Google Maps)</span>
              </a>

              <a
                href={`https://wa.me/${phoneRaw}?text=${encodeURIComponent(
                  isFoundation
                    ? "Assalamu'alaikum Panitia Al-Afiyah, saya ingin bertanya perihal lokasi kampus terpadu TK IT, SD IT & SMP IT Al-Afiyah"
                    : `Assalamu'alaikum Panitia ${isSd ? 'SD IT' : isTk ? 'TK IT' : 'SMP IT'}, saya ingin konsultasi lokasi sekolah`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold transition-colors flex items-center justify-center gap-2 text-center"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Hubungi via WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Map Viewer: Completely clean, unobstructed, NO floating overlays */}
          <div className="lg:col-span-7 min-h-[380px] sm:min-h-[440px] rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-slate-100">
            <iframe
              title={`Peta ${sectionTitle}`}
              src={iframeSrc}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '380px' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full block"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
