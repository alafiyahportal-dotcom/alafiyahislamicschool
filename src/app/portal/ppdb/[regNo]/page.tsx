import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { PrintCardButton, DownloadLetterButton, ViewReceiptButton, PrintIdCardButton, PrintRegistrationFormButton, EditBiodataButton } from '@/components/portal/PortalActionButtons';
import PortalDocumentStatusList from '@/components/portal/PortalDocumentStatusList';
import { 
  CheckCircle2, 
  Clock, 
  FileText, 
  MessageCircle, 
  School, 
  Calendar, 
  User, 
  ShieldCheck,
  Award,
  AlertCircle,
  MapPin,
  Shirt
} from 'lucide-react';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ApplicantPortalPage({
  params,
}: {
  params: Promise<{ regNo: string }>;
}) {
  const resolvedParams = await params;
  const reg = await prisma.pPDBRegistration.findUnique({
    where: { registrationNo: resolvedParams.regNo },
    include: {
      school: true,
      invoices: true,
      documents: true,
      reRegistration: true,
    },
  });

  if (!reg) {
    notFound();
  }

  const invoice = reg.invoices[0];
  const isPaid = invoice?.paymentStatus === 'PAID' || reg.status === 'VERIFIED' || reg.status === 'INTERVIEW_SCHEDULED' || reg.status === 'ACCEPTED';
  
  let parentData: Record<string, string> = {};
  let specificData: Record<string, string> = {};

  try {
    parentData = JSON.parse(reg.parentData || '{}');
  } catch {
    // fallback
  }

  try {
    specificData = JSON.parse(reg.schoolSpecificData || '{}');
  } catch {
    // fallback
  }

  return (
    <div className="min-h-screen soft-mesh-bg flex flex-col justify-between">
      <Navbar
        schoolName={reg.school.name}
        badgeText={reg.school.badgeText}
        schoolSlug={reg.school.slug as 'tk' | 'sd' | 'smp'}
      />

      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 my-auto">
        {/* Top Banner Status */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#184F48] uppercase tracking-wide bg-[#E8F3F1] px-3 py-1 rounded-full border border-[#2D7A70]/30">
                {reg.school.slug === 'sd' && (
                  <img
                    src="/images/sd-logo.png"
                    alt="Logo SD IT Al-Afiyah"
                    className="w-4 h-4 object-contain shrink-0"
                  />
                )}
                <span>Portal Resmi Murid {reg.school.name}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                {reg.studentName}
              </h1>
              <p className="text-xs text-slate-500 font-mono mt-1">
                No. Registrasi: <span className="font-bold text-slate-800">{reg.registrationNo}</span>
              </p>
            </div>

            <div className="flex flex-col sm:items-end">
              <span className="text-xs text-slate-400 font-medium">Status Pendaftaran:</span>
              <div className="mt-1">
                {reg.status === 'ACCEPTED' ? (
                  <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span>ALHAMDULILLAH, DITERIMA</span>
                  </span>
                ) : reg.status === 'INTERVIEW_SCHEDULED' ? (
                  <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold border border-blue-300">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>JADWAL OBSERVASI DITETAPKAN</span>
                  </span>
                ) : isPaid ? (
                  <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-[#E8F3F1] text-[#184F48] text-xs font-bold border border-[#2D7A70]/30">
                    <CheckCircle2 className="w-4 h-4 text-[#2D7A70]" />
                    <span>BERKAS LUNAS & TERVERIFIKASI</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>MENUNGGU PEMBAYARAN FORMULIR</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Conditional Acceptance Banner */}
          {reg.status === 'ACCEPTED' && (
            <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-emerald-950">
                    Selamat! Ananda Dinyatakan Lolos & Diterima
                  </h3>
                  <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                    Berdasarkan hasil observasi dan wawancara, Ananda memenuhi kualifikasi murid baru di {reg.school.name} Tahun Ajaran 2026/2027.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <PrintIdCardButton
                  studentName={reg.studentName}
                  regNo={reg.registrationNo}
                  schoolName={reg.school.name}
                  schoolSlug={reg.school.slug}
                  gender={reg.gender}
                  nik={reg.nik}
                  admissionTrack={specificData.track || 'REGULER'}
                  status={reg.status}
                  parentPhone={parentData.phone || parentData.whatsapp || '0812-2334-4552'}
                  variant="primary"
                />
                <DownloadLetterButton
                  studentName={reg.studentName}
                  regNo={reg.registrationNo}
                  schoolName={reg.school.name}
                  schoolSlug={reg.school.slug}
                  admissionTrack={specificData.track || 'REGULER'}
                  nik={reg.nik}
                  parentName={parentData.fatherName || parentData.motherName || 'Wali Murid'}
                />
                <PrintRegistrationFormButton
                  regNo={reg.registrationNo}
                  studentName={reg.studentName}
                  nik={reg.nik}
                  gender={reg.gender}
                  pob={reg.pob}
                  dob={reg.dob.toISOString()}
                  address={reg.address}
                  schoolName={reg.school.name}
                  schoolSlug={reg.school.slug}
                  admissionTrack={specificData.track || 'REGULER'}
                  schoolSpecificData={specificData}
                  parentData={parentData}
                  createdAt={reg.createdAt.toISOString()}
                />
                <Link
                  href={`/portal/ppdb/${reg.registrationNo}/daftar-ulang`}
                  className="px-3.5 py-2 rounded-xl bg-[#184F48] hover:bg-[#133f3a] text-white text-xs font-bold inline-flex items-center space-x-1.5 shadow-sm transition-all flex-shrink-0"
                >
                  <Shirt className="w-3.5 h-3.5 text-amber-300" />
                  <span>{reg.reRegistration ? 'Ubah Seragam' : 'Daftar Ulang'}</span>
                </Link>
              </div>
            </div>
          )}

          {/* Dedicated Re-Registration Banner if ACCEPTED */}
          {reg.status === 'ACCEPTED' && (
            <div className={`mt-4 p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              reg.reRegistration
                ? 'bg-emerald-50/60 border-emerald-200'
                : 'bg-amber-50/80 border-amber-200 animate-pulse'
            }`}>
              <div className="flex items-start space-x-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  reg.reRegistration ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
                }`}>
                  <Shirt className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-900">
                    {reg.reRegistration
                      ? `Daftar Ulang Terkonfirmasi (Ukuran Seragam: ${reg.reRegistration.uniformSize})`
                      : 'Wajib: Konfirmasi Daftar Ulang & Pengukuran Seragam Online'}
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    {reg.reRegistration
                      ? 'Spesifikasi ukuran seragam murid telah tercatat di sistem logistik. Anda dapat mengubah data atau mencetak tanda terima resmi.'
                      : 'Batas waktu daftar ulang: 1 - 10 Oktober 2026. Pilih ukuran seragam anak (S-XXL) dan skema pembayaran biaya pangkal.'}
                  </p>
                </div>
              </div>

              <Link
                href={`/portal/ppdb/${reg.registrationNo}/daftar-ulang`}
                className={`px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 transition-all flex-shrink-0 ${
                  reg.reRegistration
                    ? 'bg-[#E8F3F1] hover:bg-[#D4EBE7] text-[#184F48]'
                    : 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm'
                }`}
              >
                <span>{reg.reRegistration ? 'Lihat Bukti Tanda Terima →' : 'Isi Form Daftar Ulang Sekarang →'}</span>
              </Link>
            </div>
          )}

          {/* Grid Informasi Murid & Tagihan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            {/* Rincian Murid */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-[#2D7A70]" />
                <span>Biodata Calon Murid</span>
              </h3>
              <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/80 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Unit Sekolah:</span>
                  <span className="font-bold text-slate-900 inline-flex items-center gap-1.5">
                    {reg.school.slug === 'sd' && (
                      <img
                        src="/images/sd-logo.png"
                        alt="Logo SD IT Al-Afiyah"
                        className="w-4 h-4 object-contain inline-block"
                      />
                    )}
                    <span>{reg.school.name}</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">NIK Murid:</span>
                  <span className="font-mono text-slate-900">{reg.nik}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Jenis Kelamin:</span>
                  <span className="text-slate-900">{reg.gender === 'L' ? 'Laki-Laki' : 'Perempuan'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Orang Tua / Wali:</span>
                  <span className="text-slate-900">{parentData.fatherName || parentData.motherName || 'Wali Murid'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">WhatsApp:</span>
                  <span className="font-mono text-[#2D7A70] font-semibold">
                    {parentData.phone || parentData.whatsapp || parentData.motherPhone || '-'}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500">Formulir 28 Poin Fisik:</span>
                  <EditBiodataButton
                    regNo={reg.registrationNo}
                    studentName={reg.studentName}
                    nik={reg.nik}
                    gender={reg.gender}
                    pob={reg.pob}
                    dob={reg.dob.toISOString()}
                    address={reg.address}
                    schoolSlug={reg.school.slug}
                    schoolSpecificData={specificData}
                    parentData={parentData}
                    buttonText="📝 Lengkapi / Susulkan Data"
                    variant="amber"
                  />
                </div>
              </div>
            </div>

            {/* Rincian Tagihan */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-[#2D7A70]" />
                <span>Status Tagihan Formulir</span>
              </h3>
              <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/80 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">No. Tagihan:</span>
                  <span className="font-mono text-slate-900">{invoice?.orderId || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Biaya Formulir:</span>
                  <span className="font-bold text-slate-900">Rp {reg.registrationFee.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Metode Pembayaran:</span>
                  <span className="text-slate-900">{invoice?.paymentMethod || 'Midtrans QRIS/VA'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Waktu Bayar:</span>
                  <span className="text-slate-900">
                    {invoice?.paidAt ? new Date(invoice.paidAt).toLocaleString('id-ID') : 'Belum Dibayar'}
                  </span>
                </div>
                {!isPaid && (
                  <div className="mt-3 pt-3 border-t border-slate-200/80 bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-950 text-xs">Rekening Kas Unit Resmi:</span>
                      <span className="text-[10px] bg-emerald-700 text-white px-2 py-0.5 rounded-full font-bold">
                        {reg.school.bankName}
                      </span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-emerald-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-500 block">No. Rekening Transfer:</span>
                        <strong className="font-mono text-sm font-bold text-slate-900">
                          {reg.school.bankAccountNumber}
                        </strong>
                        <span className="text-[11px] text-slate-600 block">a.n {reg.school.bankAccountHolder}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      Cantumkan no. registrasi <strong>{reg.registrationNo}</strong> pada berita transfer dan kirimkan bukti setor ke panitia PPDB unit.
                    </p>
                  </div>
                )}
                {isPaid && invoice && (
                  <div className="pt-2 flex justify-end border-t border-slate-200/60 mt-2">
                    <ViewReceiptButton
                      studentName={reg.studentName}
                      regNo={reg.registrationNo}
                      schoolName={reg.school.name}
                      orderId={invoice.orderId}
                      amount={invoice.amount}
                      paymentMethod={invoice.paymentMethod || 'Midtrans QRIS'}
                      paidAt={invoice.paidAt ? invoice.paidAt.toISOString() : undefined}
                      parentName={parentData.fatherName || parentData.motherName || 'Wali Murid'}
                      schoolSlug={reg.school.slug}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Agenda Ujian & Wawancara */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#2D7A70]" />
              <span>Jadwal Observasi & Wawancara Murid</span>
            </h3>
            <div className="bg-[#E8F3F1]/60 rounded-2xl p-4 border border-[#2D7A70]/30 text-xs text-[#184F48] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="font-bold text-sm">Observasi Gelombang 1: Sabtu, 28 Maret 2026</p>
                <p className="text-[#2D7A70] mt-0.5">
                  Waktu: Pukul 08.00 - 11.30 WIB • Ruang: Gedung Utama Al-Afiyah Majalengka
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <PrintIdCardButton
                  studentName={reg.studentName}
                  regNo={reg.registrationNo}
                  schoolName={reg.school.name}
                  schoolSlug={reg.school.slug}
                  gender={reg.gender}
                  nik={reg.nik}
                  admissionTrack={specificData.track || 'REGULER'}
                  status={reg.status}
                  parentPhone={parentData.phone || parentData.whatsapp || '0812-2334-4552'}
                />
                <PrintCardButton
                  studentName={reg.studentName}
                  regNo={reg.registrationNo}
                  schoolName={reg.school.name}
                  schoolSlug={reg.school.slug}
                  admissionTrack={specificData.track || 'REGULER'}
                />
                <EditBiodataButton
                  regNo={reg.registrationNo}
                  studentName={reg.studentName}
                  nik={reg.nik}
                  gender={reg.gender}
                  pob={reg.pob}
                  dob={reg.dob.toISOString()}
                  address={reg.address}
                  schoolSlug={reg.school.slug}
                  schoolSpecificData={specificData}
                  parentData={parentData}
                  buttonText="Formulir 28 Poin"
                  variant="secondary"
                />
                <PrintRegistrationFormButton
                  regNo={reg.registrationNo}
                  studentName={reg.studentName}
                  nik={reg.nik}
                  gender={reg.gender}
                  pob={reg.pob}
                  dob={reg.dob.toISOString()}
                  address={reg.address}
                  schoolName={reg.school.name}
                  schoolSlug={reg.school.slug}
                  admissionTrack={specificData.track || 'REGULER'}
                  schoolSpecificData={specificData}
                  parentData={parentData}
                  createdAt={reg.createdAt.toISOString()}
                />
              </div>
            </div>
          </div>

          {/* Official WhatsApp Group */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-600">
              <span className="font-bold text-slate-900 block mb-0.5">Grup Komunikasi Calon Wali Murid:</span>
              Dapatkan info terkini jadwal observasi, seragam, dan buku pegangan murid.
            </div>
            <a
              href="https://chat.whatsapp.com/alafiyah-ppdb-2026"
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-2 transition-colors flex-shrink-0 shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Gabung Grup WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Portal Document Verification & Self-Service Re-upload List */}
        <PortalDocumentStatusList
          initialDocuments={reg.documents}
          registrationNo={reg.registrationNo}
          studentName={reg.studentName}
          schoolName={reg.school.name}
        />
      </main>

      <Footer />
    </div>
  );
}
