'use client';

import React, { useState } from 'react';
import { 
  X, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Users, 
  FileText, 
  School, 
  Heart, 
  MapPin, 
  Phone, 
  Calendar,
  Loader2
} from 'lucide-react';
import { calculateAgePerJuly2027, SDIT_OFFICIAL_METADATA } from '@/types/sdit-form';

interface EditBiodataModalProps {
  isOpen: boolean;
  onClose: () => void;
  regNo: string;
  initialStudentName: string;
  initialNik: string;
  initialGender: string;
  initialPob: string;
  initialDob: string;
  initialAddress: string;
  schoolSlug: string;
  schoolSpecificData?: Record<string, any>;
  parentData?: Record<string, any>;
  onSuccess?: () => void;
}

export default function EditBiodataModal({
  isOpen,
  onClose,
  regNo,
  initialStudentName,
  initialNik,
  initialGender,
  initialPob,
  initialDob,
  initialAddress,
  schoolSlug,
  schoolSpecificData = {},
  parentData = {},
  onSuccess,
}: EditBiodataModalProps) {
  const [activeTab, setActiveTab] = useState<'ANAK' | 'ORTU' | 'LAINNYA' | 'BERKAS'>('ANAK');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [studentName, setStudentName] = useState(initialStudentName || '');
  const [nik, setNik] = useState(initialNik || '');
  const [gender, setGender] = useState(initialGender || 'L');
  const [pob, setPob] = useState(initialPob || 'Majalengka');
  const [dob, setDob] = useState(initialDob ? initialDob.substring(0, 10) : '2019-05-14');
  const [address, setAddress] = useState(initialAddress || '');

  // Specific SDIT Form State
  const [sdData, setSdData] = useState({
    nickname: schoolSpecificData.nickname || '',
    religion: schoolSpecificData.religion || 'Islam',
    citizenship: schoolSpecificData.citizenship || 'WNI',
    childOrder: schoolSpecificData.childOrder || '1',
    siblingsCount: schoolSpecificData.siblingsCount || '1',
    stepSiblingsCount: schoolSpecificData.stepSiblingsCount || '0',
    dailyLanguage: schoolSpecificData.dailyLanguage || 'Bahasa Indonesia & Sunda',
    heightCm: schoolSpecificData.heightCm || '',
    weightKg: schoolSpecificData.weightKg || '',
    diseaseHistory: schoolSpecificData.diseaseHistory || 'Tidak ada',
    bloodType: schoolSpecificData.bloodType || 'Belum Tahu',
    distanceToSchoolKm: schoolSpecificData.distanceToSchoolKm || '1',
    livingWith: schoolSpecificData.livingWith || 'Kedua Orang Tua',
    phone: schoolSpecificData.phone || parentData.phone || parentData.motherPhone || '',

    // Ortu
    fatherName: parentData.fatherName || '',
    fatherBirthYear: parentData.fatherBirthYear || '',
    fatherEducation: parentData.fatherEducation || 'S1 / Sarjana',
    fatherJob: parentData.fatherJob || '',
    fatherCompany: parentData.fatherCompany || '',
    fatherPosition: parentData.fatherPosition || '',
    fatherOfficeAddress: parentData.fatherOfficeAddress || '',
    fatherHomeAddress: parentData.fatherHomeAddress || '',
    fatherPhone: parentData.fatherPhone || '',

    motherName: parentData.motherName || '',
    motherBirthYear: parentData.motherBirthYear || '',
    motherEducation: parentData.motherEducation || 'S1 / Sarjana',
    motherJob: parentData.motherJob || '',
    motherCompany: parentData.motherCompany || '',
    motherPosition: parentData.motherPosition || '',
    motherOfficeAddress: parentData.motherOfficeAddress || '',
    motherHomeAddress: parentData.motherHomeAddress || '',
    motherPhone: parentData.motherPhone || parentData.phone || '',

    guardianName: parentData.guardianName || '',
    guardianBirthYear: parentData.guardianBirthYear || '',
    guardianEducation: parentData.guardianEducation || '',
    guardianJob: parentData.guardianJob || '',
    guardianCompany: parentData.guardianCompany || '',
    guardianPosition: parentData.guardianPosition || '',
    guardianOfficeAddress: parentData.guardianOfficeAddress || '',
    guardianHomeAddress: parentData.guardianHomeAddress || '',
    guardianPhone: parentData.guardianPhone || '',

    // Lain-lain
    transportation: schoolSpecificData.transportation || 'Diantar Orang Tua',
    admissionAs: schoolSpecificData.admissionAs || 'Murid Baru Kelas 1',
    originSchoolName: schoolSpecificData.originSchoolName || 'TK / RA Al-Afiyah',
    originSchoolAddress: schoolSpecificData.originSchoolAddress || 'Majalengka',
    originSchoolPhone: schoolSpecificData.originSchoolPhone || '',

    transferSchoolName: schoolSpecificData.transferSchoolName || '',
    transferSchoolAddress: schoolSpecificData.transferSchoolAddress || '',
    transferSchoolPhone: schoolSpecificData.transferSchoolPhone || '',
    transferLeaveDate: schoolSpecificData.transferLeaveDate || '',

    otherNotes: schoolSpecificData.otherNotes || '',
    firstKnownSource: schoolSpecificData.firstKnownSource || 'Keluarga & Sahabat',
    mainReason: schoolSpecificData.mainReason || 'Program Tahfidz Al-Qur’an & Adab Islami',

    // Checklist
    checkIjazahTk: Boolean(schoolSpecificData.checkIjazahTk),
    checkKK: Boolean(schoolSpecificData.checkKK),
    checkAkta: Boolean(schoolSpecificData.checkAkta),
    checkPasFoto: Boolean(schoolSpecificData.checkPasFoto),
    checkSuratPindah: Boolean(schoolSpecificData.checkSuratPindah),
    checkRaportPindah: Boolean(schoolSpecificData.checkRaportPindah),
    checkNisnPindah: Boolean(schoolSpecificData.checkNisnPindah),
  });

  if (!isOpen) return null;

  const ageCalculation = calculateAgePerJuly2027(dob);

  const updateSd = (key: string, value: any) => {
    setSdData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/portal/ppdb/update-biodata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationNo: regNo,
          studentName,
          nik,
          gender,
          pob,
          dob,
          address,
          schoolSpecificData: {
            ...schoolSpecificData,
            nickname: sdData.nickname,
            religion: sdData.religion,
            citizenship: sdData.citizenship,
            childOrder: sdData.childOrder,
            siblingsCount: sdData.siblingsCount,
            stepSiblingsCount: sdData.stepSiblingsCount,
            dailyLanguage: sdData.dailyLanguage,
            heightCm: sdData.heightCm,
            weightKg: sdData.weightKg,
            diseaseHistory: sdData.diseaseHistory,
            bloodType: sdData.bloodType,
            distanceToSchoolKm: sdData.distanceToSchoolKm,
            livingWith: sdData.livingWith,
            phone: sdData.phone,
            transportation: sdData.transportation,
            admissionAs: sdData.admissionAs,
            originSchoolName: sdData.originSchoolName,
            originSchoolAddress: sdData.originSchoolAddress,
            originSchoolPhone: sdData.originSchoolPhone,
            transferSchoolName: sdData.transferSchoolName,
            transferSchoolAddress: sdData.transferSchoolAddress,
            transferSchoolPhone: sdData.transferSchoolPhone,
            transferLeaveDate: sdData.transferLeaveDate,
            otherNotes: sdData.otherNotes,
            firstKnownSource: sdData.firstKnownSource,
            mainReason: sdData.mainReason,
            checkIjazahTk: sdData.checkIjazahTk,
            checkKK: sdData.checkKK,
            checkAkta: sdData.checkAkta,
            checkPasFoto: sdData.checkPasFoto,
            checkSuratPindah: sdData.checkSuratPindah,
            checkRaportPindah: sdData.checkRaportPindah,
            checkNisnPindah: sdData.checkNisnPindah,
          },
          parentData: {
            ...parentData,
            fatherName: sdData.fatherName,
            fatherBirthYear: sdData.fatherBirthYear,
            fatherEducation: sdData.fatherEducation,
            fatherJob: sdData.fatherJob,
            fatherCompany: sdData.fatherCompany,
            fatherPosition: sdData.fatherPosition,
            fatherOfficeAddress: sdData.fatherOfficeAddress,
            fatherHomeAddress: sdData.fatherHomeAddress,
            fatherPhone: sdData.fatherPhone,
            motherName: sdData.motherName,
            motherBirthYear: sdData.motherBirthYear,
            motherEducation: sdData.motherEducation,
            motherJob: sdData.motherJob,
            motherCompany: sdData.motherCompany,
            motherPosition: sdData.motherPosition,
            motherOfficeAddress: sdData.motherOfficeAddress,
            motherHomeAddress: sdData.motherHomeAddress,
            motherPhone: sdData.motherPhone,
            guardianName: sdData.guardianName,
            guardianBirthYear: sdData.guardianBirthYear,
            guardianEducation: sdData.guardianEducation,
            guardianJob: sdData.guardianJob,
            guardianCompany: sdData.guardianCompany,
            guardianPosition: sdData.guardianPosition,
            guardianOfficeAddress: sdData.guardianOfficeAddress,
            guardianHomeAddress: sdData.guardianHomeAddress,
            guardianPhone: sdData.guardianPhone,
            phone: sdData.motherPhone || sdData.fatherPhone,
          },
        }),
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || 'Gagal menyimpan data formulir');
      }

      setSuccessMsg('Alhamdulillah! Biodata formulir 28 poin berhasil disimpan & disusulkan.');
      if (onSuccess) {
        onSuccess();
      }
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200">
        
        {/* Header Modal */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#184F48] to-[#2D7A70] text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <FileText className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Formulir Resmi SDIT Al-Afiyah
                </span>
                <span className="text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded-full">
                  {regNo}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-white mt-0.5">
                Lengkapi / Edit Biodata 28 Butir Pertanyaan
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-2 overflow-x-auto text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('ANAK')}
            className={`py-3 px-4 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'ANAK'
                ? 'border-[#184F48] text-[#184F48] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            A. Keterangan Anak (1-17)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ORTU')}
            className={`py-3 px-4 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'ORTU'
                ? 'border-[#184F48] text-[#184F48] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            B. Orang Tua & Wali (18-20)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('LAINNYA')}
            className={`py-3 px-4 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'LAINNYA'
                ? 'border-[#184F48] text-[#184F48] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            C. Asal Sekolah & Lainnya (21-28)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('BERKAS')}
            className={`py-3 px-4 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'BERKAS'
                ? 'border-[#184F48] text-[#184F48] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Checklist 12 Persyaratan
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 sm:p-8 max-h-[68vh] overflow-y-auto space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB A: KETERANGAN ANAK (POIN 1 - 17) */}
          {activeTab === 'ANAK' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    1. Nama Lengkap Murid *
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#2D7A70] focus:outline-none"
                    placeholder="Sesuai Akta Kelahiran"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    2. Nama Panggilan
                  </label>
                  <input
                    type="text"
                    value={sdData.nickname}
                    onChange={(e) => updateSd('nickname', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#2D7A70] focus:outline-none"
                    placeholder="Nama panggilan sehari-hari"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    3. Jenis Kelamin *
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'L' | 'P')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#2D7A70] focus:outline-none"
                  >
                    <option value="L">Laki-laki (Ikhwan)</option>
                    <option value="P">Perempuan (Akhwat)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    4a. Tempat Lahir *
                  </label>
                  <input
                    type="text"
                    required
                    value={pob}
                    onChange={(e) => setPob(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#2D7A70] focus:outline-none"
                    placeholder="Kota / Kab Kelahiran"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    4b. Tanggal Lahir *
                  </label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#2D7A70] focus:outline-none"
                  />
                  {dob && (
                    <div className="mt-1 text-[11px] flex items-center space-x-1.5">
                      <span className="text-slate-500">Usia per 1 Juli 2027:</span>
                      <span className={`font-bold ${ageCalculation.isEligible ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {ageCalculation.text}
                      </span>
                      {ageCalculation.isEligible ? (
                        <span className="text-emerald-600 font-bold">(✓ Memenuhi Syarat)</span>
                      ) : (
                        <span className="text-amber-600 font-bold">(&lt; 6 Thn, butuh rekomendasi)</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    5. Agama
                  </label>
                  <select
                    value={sdData.religion}
                    onChange={(e) => updateSd('religion', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#2D7A70] focus:outline-none"
                  >
                    <option value="Islam">Islam</option>
                    <option value="Katholik">Katholik</option>
                    <option value="Protestan">Protestan</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Budha">Budha</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    6. Kewarganegaraan
                  </label>
                  <select
                    value={sdData.citizenship}
                    onChange={(e) => updateSd('citizenship', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#2D7A70] focus:outline-none"
                  >
                    <option value="WNI">WNI (Warga Negara Indonesia)</option>
                    <option value="WNA">WNA (Warga Negara Asing)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    NIK Murid (KTP / KK)
                  </label>
                  <input
                    type="text"
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    maxLength={16}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-[#2D7A70] focus:outline-none"
                    placeholder="16 digit NIK"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    7. Anak ke-
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={sdData.childOrder}
                    onChange={(e) => updateSd('childOrder', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#2D7A70] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    8. Saudara Kandung
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={sdData.siblingsCount}
                    onChange={(e) => updateSd('siblingsCount', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#2D7A70] focus:outline-none"
                    placeholder="Jumlah orang"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    9. Saudara Tiri / Angkat
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={sdData.stepSiblingsCount}
                    onChange={(e) => updateSd('stepSiblingsCount', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#2D7A70] focus:outline-none"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    10. Bahasa Sehari-hari
                  </label>
                  <input
                    type="text"
                    value={sdData.dailyLanguage}
                    onChange={(e) => updateSd('dailyLanguage', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#2D7A70] focus:outline-none"
                    placeholder="Indonesia / Sunda"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    11. Tinggi Badan (cm)
                  </label>
                  <input
                    type="number"
                    value={sdData.heightCm}
                    onChange={(e) => updateSd('heightCm', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#2D7A70] focus:outline-none"
                    placeholder="misal: 115"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    12. Berat Badan (kg)
                  </label>
                  <input
                    type="number"
                    value={sdData.weightKg}
                    onChange={(e) => updateSd('weightKg', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#2D7A70] focus:outline-none"
                    placeholder="misal: 20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    14. Golongan Darah
                  </label>
                  <select
                    value={sdData.bloodType}
                    onChange={(e) => updateSd('bloodType', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#2D7A70] focus:outline-none"
                  >
                    <option value="Belum Tahu">Belum Tahu</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="AB">AB</option>
                    <option value="O">O</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    15. Jarak ke Sekolah (km)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={sdData.distanceToSchoolKm}
                    onChange={(e) => updateSd('distanceToSchoolKm', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#2D7A70] focus:outline-none"
                    placeholder="misal: 2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    13. Penyakit yang Pernah Diderita
                  </label>
                  <input
                    type="text"
                    value={sdData.diseaseHistory}
                    onChange={(e) => updateSd('diseaseHistory', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#2D7A70] focus:outline-none"
                    placeholder="Tulis 'Tidak ada' jika sehat"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    16. Tinggal Bersama
                  </label>
                  <select
                    value={sdData.livingWith}
                    onChange={(e) => updateSd('livingWith', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#2D7A70] focus:outline-none"
                  >
                    <option value="Kedua Orang Tua">Kedua Orang Tua (Ayah & Ibu)</option>
                    <option value="Ayah">Ayah</option>
                    <option value="Ibu">Ibu</option>
                    <option value="Wali">Wali</option>
                    <option value="Sendiri / Asrama">Sendiri / Lainnya</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  17. Alamat Lengkap Rumah *
                </label>
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#2D7A70] focus:outline-none"
                  placeholder="Nama jalan, RT/RW, Dusun/Kelurahan, Kecamatan, Kab. Majalengka"
                />
              </div>
            </div>
          )}

          {/* TAB B: DATA ORANG TUA / WALI (POIN 18 - 20) */}
          {activeTab === 'ORTU' && (
            <div className="space-y-6">
              {/* 18. DATA AYAH */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
                  <User className="w-4 h-4 text-[#184F48]" />
                  <span className="text-xs font-extrabold text-slate-900 uppercase">
                    18. Data Ayah Kandung
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Nama Ayah Kandung *</label>
                    <input
                      type="text"
                      value={sdData.fatherName}
                      onChange={(e) => updateSd('fatherName', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      placeholder="Nama lengkap & gelar"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Tahun Lahir</label>
                    <input
                      type="text"
                      value={sdData.fatherBirthYear}
                      onChange={(e) => updateSd('fatherBirthYear', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      placeholder="misal: 1985"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Pendidikan Terakhir</label>
                    <input
                      type="text"
                      value={sdData.fatherEducation}
                      onChange={(e) => updateSd('fatherEducation', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      placeholder="SMA / D3 / S1 / S2 / S3"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Pekerjaan</label>
                    <input
                      type="text"
                      value={sdData.fatherJob}
                      onChange={(e) => updateSd('fatherJob', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      placeholder="PNS / Wiraswasta / Karyawan"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Nama Instansi / Usaha</label>
                    <input
                      type="text"
                      value={sdData.fatherCompany}
                      onChange={(e) => updateSd('fatherCompany', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Jabatan</label>
                    <input
                      type="text"
                      value={sdData.fatherPosition}
                      onChange={(e) => updateSd('fatherPosition', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Alamat Instansi / Kantor</label>
                    <input
                      type="text"
                      value={sdData.fatherOfficeAddress}
                      onChange={(e) => updateSd('fatherOfficeAddress', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">No. Telp / HP / WA Ayah</label>
                    <input
                      type="text"
                      value={sdData.fatherPhone}
                      onChange={(e) => updateSd('fatherPhone', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      placeholder="08xxxxxxxxxx"
                    />
                  </div>
                </div>
              </div>

              {/* 19. DATA IBU */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
                  <User className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-extrabold text-slate-900 uppercase">
                    19. Data Ibu Kandung
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Nama Ibu Kandung *</label>
                    <input
                      type="text"
                      value={sdData.motherName}
                      onChange={(e) => updateSd('motherName', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      placeholder="Nama lengkap & gelar"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Tahun Lahir</label>
                    <input
                      type="text"
                      value={sdData.motherBirthYear}
                      onChange={(e) => updateSd('motherBirthYear', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Pendidikan Terakhir</label>
                    <input
                      type="text"
                      value={sdData.motherEducation}
                      onChange={(e) => updateSd('motherEducation', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Pekerjaan</label>
                    <input
                      type="text"
                      value={sdData.motherJob}
                      onChange={(e) => updateSd('motherJob', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Nama Instansi</label>
                    <input
                      type="text"
                      value={sdData.motherCompany}
                      onChange={(e) => updateSd('motherCompany', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Jabatan</label>
                    <input
                      type="text"
                      value={sdData.motherPosition}
                      onChange={(e) => updateSd('motherPosition', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Alamat Instansi / Kantor</label>
                    <input
                      type="text"
                      value={sdData.motherOfficeAddress}
                      onChange={(e) => updateSd('motherOfficeAddress', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">No. Telp / WhatsApp Ibu (Aktif) *</label>
                    <input
                      type="text"
                      required
                      value={sdData.motherPhone}
                      onChange={(e) => updateSd('motherPhone', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold"
                      placeholder="08xxxxxxxxxx"
                    />
                  </div>
                </div>
              </div>

              {/* 20. DATA WALI (OPSIONAL) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
                  <Users className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-bold text-slate-700 uppercase">
                    20. Data Wali (Hanya diisi jika anak diasuh oleh wali)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Nama Wali</label>
                    <input
                      type="text"
                      value={sdData.guardianName}
                      onChange={(e) => updateSd('guardianName', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      placeholder="Opsional"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Pekerjaan Wali</label>
                    <input
                      type="text"
                      value={sdData.guardianJob}
                      onChange={(e) => updateSd('guardianJob', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">No. Telp / HP Wali</label>
                    <input
                      type="text"
                      value={sdData.guardianPhone}
                      onChange={(e) => updateSd('guardianPhone', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB C: KETERANGAN LAIN-LAIN (POIN 21 - 28) */}
          {activeTab === 'LAINNYA' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    21. Berangkat ke Sekolah
                  </label>
                  <select
                    value={sdData.transportation}
                    onChange={(e) => updateSd('transportation', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#2D7A70]"
                  >
                    <option value="Diantar Orang Tua">Diantar Orang Tua / Keluarga</option>
                    <option value="Sendiri / Sepeda">Sendiri / Bersepeda</option>
                    <option value="Jemputan Sekolah">Jemputan Sekolah</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    22. Masuk Sekolah Sebagai
                  </label>
                  <select
                    value={sdData.admissionAs}
                    onChange={(e) => updateSd('admissionAs', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#2D7A70]"
                  >
                    <option value="Murid Baru Kelas 1">Murid Baru Kelas 1 (Satu)</option>
                    <option value="Pindahan Kelas 2">Pindahan (Kelas 2)</option>
                    <option value="Pindahan Kelas 3">Pindahan (Kelas 3)</option>
                    <option value="Pindahan Kelas 4">Pindahan (Kelas 4)</option>
                    <option value="Pindahan Kelas 5">Pindahan (Kelas 5)</option>
                  </select>
                </div>
              </div>

              {/* 23. Asal Sekolah TK/RA */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
                <span className="text-xs font-extrabold text-[#184F48] uppercase block">
                  23. Asal Sekolah TK / BA / RA / DA
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Nama Sekolah TK/RA</label>
                    <input
                      type="text"
                      value={sdData.originSchoolName}
                      onChange={(e) => updateSd('originSchoolName', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      placeholder="misal: TK IT Al-Afiyah"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Alamat Sekolah Asal</label>
                    <input
                      type="text"
                      value={sdData.originSchoolAddress}
                      onChange={(e) => updateSd('originSchoolAddress', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Telepon / Kontak TK</label>
                    <input
                      type="text"
                      value={sdData.originSchoolPhone}
                      onChange={(e) => updateSd('originSchoolPhone', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* 24-25. Khusus Siswa Pindahan */}
              {sdData.admissionAs !== 'Murid Baru Kelas 1' && (
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
                  <span className="text-xs font-extrabold text-amber-900 uppercase block">
                    24 - 25. Khusus Murid Pindahan dari SD / MI
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Nama SD / MI Asal</label>
                      <input
                        type="text"
                        value={sdData.transferSchoolName}
                        onChange={(e) => updateSd('transferSchoolName', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Alamat Sekolah Asal</label>
                      <input
                        type="text"
                        value={sdData.transferSchoolAddress}
                        onChange={(e) => updateSd('transferSchoolAddress', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Tanggal Keluar Sekolah</label>
                      <input
                        type="date"
                        value={sdData.transferLeaveDate}
                        onChange={(e) => updateSd('transferLeaveDate', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    27. Informasi Pertama Kali Mengenal SDIT AL AFIYAH
                  </label>
                  <input
                    type="text"
                    value={sdData.firstKnownSource}
                    onChange={(e) => updateSd('firstKnownSource', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                    placeholder="misal: Kerabat, Spanduk, Media Sosial, Mitra Afiliasi"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    28. Alasan Paling Utama Memasukkan Anak ke SDIT
                  </label>
                  <input
                    type="text"
                    value={sdData.mainReason}
                    onChange={(e) => updateSd('mainReason', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                    placeholder="misal: Hafalan Al-Qur'an mutqin & adab islami"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  26. Catatan Lain-Lain yang Perlu Diketahui Sekolah
                </label>
                <textarea
                  rows={2}
                  value={sdData.otherNotes}
                  onChange={(e) => updateSd('otherNotes', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                  placeholder="Catatan khusus kondisi kesehatan, alergi, atau perhatian guru..."
                />
              </div>
            </div>
          )}

          {/* TAB D: PERSYARATAN & KELENGKAPAN CHECKLIST (12 POIN) */}
          {activeTab === 'BERKAS' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 leading-relaxed">
                <strong>Catatan Panitia:</strong> Berkas fisik dapat dimasukkan ke dalam <strong>1 stopmap</strong> dan dikumpulkan saat verifikasi formulir, paling lambat <strong>3 hari sebelum pelaksanaan Tes Observasi PPDB 2027/2028</strong>.
              </div>

              <div className="space-y-2.5">
                {[
                  { key: 'checkIjazahTk', label: '4. Fotocopy Ijazah / Surat Tamat TK/RA/BA (1 Lembar)' },
                  { key: 'checkKK', label: '5. Fotocopy Kartu Keluarga (2 Lembar)' },
                  { key: 'checkAkta', label: '6. Fotocopy Akta Kelahiran (2 Lembar)' },
                  { key: 'checkPasFoto', label: '7. Pas Foto Berwarna 3x4 (2 Lembar)' },
                  { key: 'checkSuratPindah', label: '8. Surat Pengantar dari Sekolah Asal (Bagi Murid Pindahan)' },
                  { key: 'checkRaportPindah', label: '9. Raport Terakhir dari Sekolah Sebelumnya (Bagi Murid Pindahan)' },
                  { key: 'checkNisnPindah', label: '10. Bukti Nomor Induk Siswa Nasional / NISN (Bagi Pindahan)' },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center space-x-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={Boolean((sdData as any)[item.key])}
                      onChange={(e) => updateSd(item.key, e.target.checked)}
                      className="w-4 h-4 text-[#184F48] rounded border-slate-300 focus:ring-[#2D7A70]"
                    />
                    <span className="text-xs font-semibold text-slate-800">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Footer Submit Buttons */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-slate-500">
              * Data akan tersimpan resmi di sistem pendaftaran dan langsung tercermin pada cetakan Formulir F-PPDB A4.
            </p>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Tutup
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#184F48] to-[#2D7A70] hover:opacity-95 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan &amp; Perbarui Formulir</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}
