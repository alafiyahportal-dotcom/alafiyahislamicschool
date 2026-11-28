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

  // Ensure every registration has default document slots (KK, AKTA, FOTO, IJAZAH) so parents/admins can always upload or view them
  const requiredTypes = reg.school.slug === 'smp' ? ['KK', 'AKTA', 'FOTO', 'IJAZAH'] : ['IJAZAH', 'FOTO', 'AKTA', 'KK'];
  const existingTypes = new Set(reg.documents.map((d) => d.docType));
  const missingTypes = requiredTypes.filter((t) => !existingTypes.has(t));
  if (missingTypes.length > 0) {
    try {
      for (const docType of missingTypes) {
        const created = await prisma.pPDBDocument.create({
          data: {
            registrationId: reg.id,
            docType,
            fileName: `Belum Diunggah (${docType})`,
            fileUrl: 'DEFERRED',
            verificationStatus: 'PENDING',
          },
        });
        reg.documents.push(created);
      }
    } catch {
      // ignore
    }
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

  const isSmp = reg.school.slug === 'smp' || reg.registrationNo.toUpperCase().includes('SMP');

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col justify-between font-sans">
      <Navbar
        schoolName={reg.school.name}
        badgeText={reg.school.badgeText}
        schoolSlug={reg.school.slug as 'tk' | 'sd' | 'smp'}
        transparentAtTop={false}
      />

      <main className="flex-1 pt-16 sm:pt-20">
        {/* Compact Header Minimalis Al-Hidayah Style */}
        <section
          className={`text-white py-8 sm:py-10 border-b-4 ${
            isSmp
              ? 'bg-[#030164] border-b-[#ffd51e]'
              : 'bg-[#00594f] border-b-[#e5a93b]'
          }`}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs text-white/80 font-bold uppercase tracking-wider block mb-1">
                Portal Calon {isSmp ? 'Santri' : 'Murid'} • {reg.school.name}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {reg.studentName}
              </h1>
              <p className="text-xs font-mono text-white/90 mt-1">
                No. Registrasi: <strong>{reg.registrationNo}</strong>
              </p>
            </div>

            <div>
              {reg.status === 'ACCEPTED' ? (
                <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xs bg-emerald-500 text-white text-xs font-extrabold">
                  <Award className="w-4 h-4" />
                  <span>LULUS &amp; DITERIMA</span>
                </span>
              ) : isPaid ? (
                <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xs bg-white/15 border border-white/30 text-white text-xs font-extrabold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>FORMULIR LUNAS</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xs bg-[#e5a93b] text-white text-xs font-extrabold">
                  <Clock className="w-4 h-4" />
                  <span>MENUNGGU PEMBAYARAN</span>
                </span>
              )}
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="bg-white rounded-sm p-5 sm:p-7 border border-slate-200 mb-8">
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
                    Berdasarkan hasil observasi dan wawancara, Ananda memenuhi kualifikasi murid baru di {reg.school.name} Tahun Ajaran 2027/2028.
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
                  className={`px-3.5 py-2 rounded-xl ${isSmp ? 'bg-[#030164] hover:bg-[#090580]' : 'bg-[#184F48] hover:bg-[#133f3a]'} text-white text-xs font-bold inline-flex items-center space-x-1.5 shadow-sm transition-all flex-shrink-0`}
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
                ? isSmp ? 'bg-blue-50/60 border-blue-200' : 'bg-emerald-50/60 border-emerald-200'
                : 'bg-amber-50/80 border-amber-200 animate-pulse'
            }`}>
              <div className="flex items-start space-x-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  reg.reRegistration ? (isSmp ? 'bg-[#030164] text-white' : 'bg-emerald-600 text-white') : 'bg-amber-500 text-white'
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
                      ? `Spesifikasi ukuran seragam ${isSmp ? 'santri' : 'murid'} telah tercatat di sistem logistik. Anda dapat mengubah data atau mencetak tanda terima resmi.`
                      : `Batas waktu daftar ulang: 1 - 10 Oktober 2026. Pilih ukuran seragam ${isSmp ? 'santri' : 'anak'} (S-XXL) dan skema pembayaran biaya pangkal.`}
                  </p>
                </div>
              </div>

              <Link
                href={`/portal/ppdb/${reg.registrationNo}/daftar-ulang`}
                className={`px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 transition-all flex-shrink-0 ${
                  reg.reRegistration
                    ? isSmp ? 'bg-blue-100 hover:bg-blue-200 text-[#030164]' : 'bg-[#E8F3F1] hover:bg-[#D4EBE7] text-[#184F48]'
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
                <User className={`w-3.5 h-3.5 ${isSmp ? 'text-[#030164]' : 'text-[#2D7A70]'}`} />
                <span>Biodata Calon {isSmp ? 'Santri' : 'Murid'}</span>
              </h3>
              <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/80 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Unit Sekolah:</span>
                  <span className="font-bold text-slate-900 inline-flex items-center gap-1.5">
                    {reg.school.slug === 'smp' && (
                      <img
                        src="/images/smp-logo.png"
                        alt="Logo SMP IT Al-Afiyah"
                        className="w-4 h-4 object-contain inline-block"
                      />
                    )}
                    {reg.school.slug === 'sd' && (
                      <img
                        src="/images/sd-logo.png"
                        alt="Logo SDIT Al-Afiyah"
                        className="w-4 h-4 object-contain inline-block"
                      />
                    )}
                    <span>{reg.school.name}</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">NIK {isSmp ? 'Santri' : 'Murid'}:</span>
                  <span className="font-mono text-slate-900">{reg.nik}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Jenis Kelamin:</span>
                  <span className="text-slate-900">{reg.gender === 'L' ? 'Laki-Laki' : 'Perempuan'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Orang Tua / Wali:</span>
                  <span className="text-slate-900">{parentData.fatherName || parentData.motherName || (isSmp ? 'Wali Santri' : 'Wali Murid')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">WhatsApp:</span>
                  <span className={`font-mono ${isSmp ? 'text-[#030164]' : 'text-[#2D7A70]'} font-semibold`}>
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
                <FileText className={`w-3.5 h-3.5 ${isSmp ? 'text-[#030164]' : 'text-[#2D7A70]'}`} />
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
                  <div className={`mt-3 pt-3 border-t border-slate-200/80 ${isSmp ? 'bg-blue-50/70 border-blue-200/80' : 'bg-emerald-50/70 border-emerald-200/80'} p-3.5 rounded-xl border space-y-2`}>
                    {reg.school.bankAccountNumber ? (
                      <>
                        <div className="flex items-center justify-between">
                          <span className={`font-bold ${isSmp ? 'text-blue-950' : 'text-emerald-950'} text-xs`}>Rekening Resmi {reg.school.name}:</span>
                          <span className={`text-[10px] ${isSmp ? 'bg-[#030164]' : 'bg-emerald-700'} text-white px-2 py-0.5 rounded-full font-bold`}>
                            {reg.school.bankName}
                          </span>
                        </div>
                        <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-500 block">No. Rekening Transfer:</span>
                            <strong className="font-mono text-sm font-bold text-slate-900">
                              {reg.school.bankAccountNumber}
                            </strong>
                            <span className="text-[11px] text-slate-600 block">a.n {reg.school.bankAccountHolder}</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-[11px] text-amber-900 leading-relaxed">
                        Nomor rekening resmi akan dikirimkan oleh panitia {reg.school.name}. Silakan hubungi panitia via WhatsApp sebelum melakukan transfer.
                      </p>
                    )}
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      Cantumkan no. registrasi <strong>{reg.registrationNo}</strong> pada berita transfer dan kirimkan bukti setor ke panitia {isSmp ? 'SPMB' : 'PPDB'} unit.
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
                      parentName={parentData.fatherName || parentData.motherName || (isSmp ? 'Wali Santri' : 'Wali Murid')}
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
              <Calendar className={`w-3.5 h-3.5 ${isSmp ? 'text-[#030164]' : 'text-[#2D7A70]'}`} />
              <span>{isSmp ? 'Jadwal Tes Seleksi & Observasi Santri' : 'Jadwal Observasi & Wawancara Murid'}</span>
            </h3>
            <div className={`${isSmp ? 'bg-blue-50/70 border-blue-200 text-blue-950' : 'bg-[#E8F3F1]/60 border-[#2D7A70]/30 text-[#184F48]'} rounded-2xl p-4 border text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3`}>
              <div>
                <p className="font-bold text-sm">
                  {isSmp ? 'Tes SPMB & Wawancara Gelombang 1: Sabtu, 28 Maret 2026' : 'Observasi Gelombang 1: Sabtu, 28 Maret 2026'}
                </p>
                <p className={`${isSmp ? 'text-blue-700' : 'text-[#2D7A70]'} mt-0.5`}>
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
              <span className="font-bold text-slate-900 block mb-0.5">
                Grup Komunikasi Calon Wali {isSmp ? 'Santri' : 'Murid'}:
              </span>
              Dapatkan info terkini jadwal {isSmp ? 'tes SPMB' : 'observasi'}, seragam, dan buku pegangan {isSmp ? 'santri' : 'murid'}.
            </div>
            <a
              href="https://chat.whatsapp.com/alafiyah-ppdb-2026"
              target="_blank"
              rel="noreferrer"
              className={`py-2.5 px-5 rounded-xl ${isSmp ? 'bg-[#030164] hover:bg-[#090580]' : 'bg-emerald-600 hover:bg-emerald-700'} text-white text-xs font-bold flex items-center space-x-2 transition-colors flex-shrink-0 shadow-xs`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>Gabung Grup WhatsApp SPMB</span>
            </a>
          </div>
        </div>

        {/* Portal Document Verification & Self-Service Re-upload List */}
        <PortalDocumentStatusList
          initialDocuments={reg.documents.map((d) => {
            const rawUrl = (d.fileUrl || '').trim();
            const isFakeDefaultName =
              d.fileName === 'Kartu_Keluarga.pdf' ||
              d.fileName === 'Akta_Kelahiran.pdf' ||
              d.fileName === 'Pas_Foto_3x4.jpg' ||
              d.fileName === 'dokumen.pdf';
            const isDeferred =
              !rawUrl ||
              rawUrl === 'DEFERRED' ||
              rawUrl === '/uploads/sample.pdf' ||
              rawUrl === '/uploads/sample-foto.jpg' ||
              isFakeDefaultName ||
              d.fileName.toLowerCase().includes('disusulkan') ||
              d.fileName.toLowerCase().includes('belum diunggah');

            const docTitle =
              d.docType === 'KK'
                ? 'Kartu Keluarga (KK)'
                : d.docType === 'AKTA'
                ? 'Akta Kelahiran'
                : d.docType === 'FOTO'
                ? 'Pas Foto 3x4'
                : d.docType === 'IJAZAH'
                ? 'Ijazah / SKL'
                : `Dokumen ${d.docType}`;

            return {
              ...d,
              fileName: isDeferred ? `Belum Diunggah (${docTitle})` : d.fileName,
              fileUrl: isDeferred
                ? 'DEFERRED'
                : rawUrl.startsWith('data:')
                ? `/api/ppdb/document-file/${d.id}`
                : rawUrl,
            };
          })}
          registrationNo={reg.registrationNo}
          studentName={reg.studentName}
          schoolName={reg.school.name}
        />
        </div>
      </main>

      <Footer schoolSlug={reg.school.slug as 'tk' | 'sd' | 'smp'} />
    </div>
  );
}
