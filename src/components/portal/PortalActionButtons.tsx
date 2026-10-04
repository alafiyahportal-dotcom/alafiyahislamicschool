'use client';

import React, { useState } from 'react';
import { Printer, Download, Award, ReceiptText, CreditCard, FileText, FileEdit } from 'lucide-react';
import AdmissionLetterModal from './AdmissionLetterModal';
import ExamCardModal from './ExamCardModal';
import OfficialReceiptModal from './OfficialReceiptModal';
import StudentIdCardModal from './StudentIdCardModal';
import OfficialRegistrationFormModal from './OfficialRegistrationFormModal';
import EditBiodataModal from './EditBiodataModal';

interface PrintCardButtonProps {
  studentName: string;
  regNo: string;
  schoolName: string;
  schoolSlug: string;
  admissionTrack?: string;
  examDate?: string;
  examTime?: string;
  examRoom?: string;
}

export function PrintCardButton({
  studentName,
  regNo,
  schoolName,
  schoolSlug,
  admissionTrack = 'REGULER',
  examDate = 'Sabtu, 28 Maret 2026',
  examTime = '08:30 - 11:30 WIB',
  examRoom = 'Gedung Utama Lingkungan Sekolah Al-Afiyah',
}: PrintCardButtonProps) {
  const [isCardOpen, setIsCardOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsCardOpen(true)}
        className="py-2 px-4 rounded-xl bg-white border border-[#2D7A70]/40 text-[#184F48] text-xs font-bold shadow-2xs hover:bg-[#E8F3F1] transition-colors flex items-center space-x-1.5 flex-shrink-0 cursor-pointer"
      >
        <Printer className="w-3.5 h-3.5 text-[#2D7A70]" />
        <span>Cetak Kartu Ujian</span>
      </button>

      <ExamCardModal
        isOpen={isCardOpen}
        onClose={() => setIsCardOpen(false)}
        studentName={studentName}
        regNo={regNo}
        schoolName={schoolName}
        schoolSlug={schoolSlug}
        admissionTrack={admissionTrack}
        examDate={examDate}
        examTime={examTime}
        examRoom={examRoom}
      />
    </>
  );
}

interface DownloadLetterButtonProps {
  studentName: string;
  regNo: string;
  schoolName: string;
  schoolSlug: string;
  admissionTrack?: string;
  nik?: string;
  parentName?: string;
}

export function DownloadLetterButton({
  studentName,
  regNo,
  schoolName,
  schoolSlug,
  admissionTrack = 'REGULER',
  nik = '3210123456780001',
  parentName = 'Bapak/Ibu Orang Tua / Wali',
}: DownloadLetterButtonProps) {
  const [isLetterOpen, setIsLetterOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsLetterOpen(true)}
        className="py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition-colors flex items-center space-x-2 flex-shrink-0 cursor-pointer"
      >
        <Award className="w-4 h-4 text-emerald-200" />
        <span>Buka & Cetak SK Kelulusan (PDF)</span>
      </button>

      <AdmissionLetterModal
        isOpen={isLetterOpen}
        onClose={() => setIsLetterOpen(false)}
        studentName={studentName}
        regNo={regNo}
        schoolName={schoolName}
        schoolSlug={schoolSlug}
        admissionTrack={admissionTrack}
        nik={nik}
        parentName={parentName}
      />
    </>
  );
}

interface ViewReceiptButtonProps {
  studentName: string;
  regNo: string;
  schoolName: string;
  orderId: string;
  amount: number;
  paymentMethod: string;
  paidAt?: string;
  parentName?: string;
  schoolSlug?: string;
}

export function ViewReceiptButton({
  studentName,
  regNo,
  schoolName,
  orderId,
  amount,
  paymentMethod,
  paidAt,
  parentName = 'Wali Murid Baru',
  schoolSlug,
}: ViewReceiptButtonProps) {
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsReceiptOpen(true)}
        className="py-1.5 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-semibold shadow-2xs transition-colors flex items-center space-x-1.5 cursor-pointer"
      >
        <ReceiptText className="w-3.5 h-3.5 text-emerald-700" />
        <span>Kuitansi Resmi (Lunas)</span>
      </button>

      <OfficialReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        studentName={studentName}
        regNo={regNo}
        schoolName={schoolName}
        orderId={orderId}
        amount={amount}
        paymentMethod={paymentMethod}
        paidAt={paidAt}
        parentName={parentName}
        schoolSlug={schoolSlug}
      />
    </>
  );
}

interface PrintIdCardButtonProps {
  studentName: string;
  regNo: string;
  schoolName: string;
  schoolSlug: string;
  gender?: string;
  nik?: string;
  admissionTrack?: string;
  status?: string;
  parentPhone?: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

export function PrintIdCardButton({
  studentName,
  regNo,
  schoolName,
  schoolSlug,
  gender = 'L',
  nik = '3210123456780001',
  admissionTrack = 'REGULER',
  status = 'ACCEPTED',
  parentPhone = '0812-2334-4552',
  variant = 'outline',
}: PrintIdCardButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getButtonClass = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-[#184F48] to-[#2D7A70] hover:opacity-95 text-white shadow-sm';
      case 'secondary':
        return 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm';
      case 'outline':
      default:
        return 'bg-white border border-[#2D7A70]/40 text-[#184F48] hover:bg-[#E8F3F1] shadow-2xs';
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 flex-shrink-0 cursor-pointer ${getButtonClass()}`}
      >
        <CreditCard className="w-3.5 h-3.5 text-teal-500" />
        <span>Kartu Murid (KTM) Digital</span>
      </button>

      <StudentIdCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        studentName={studentName}
        regNo={regNo}
        schoolName={schoolName}
        schoolSlug={schoolSlug}
        gender={gender}
        nik={nik}
        admissionTrack={admissionTrack}
        status={status}
        parentPhone={parentPhone}
      />
    </>
  );
}

interface PrintRegistrationFormButtonProps {
  regNo: string;
  studentName: string;
  nik: string;
  gender: string;
  pob: string;
  dob: string;
  address: string;
  schoolName: string;
  schoolSlug: string;
  admissionTrack?: string;
  schoolSpecificData?: Record<string, unknown>;
  parentData?: Record<string, string>;
  createdAt?: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

export function PrintRegistrationFormButton({
  regNo,
  studentName,
  nik,
  gender,
  pob,
  dob,
  address,
  schoolName,
  schoolSlug,
  admissionTrack = 'REGULER',
  schoolSpecificData = {},
  parentData = {},
  createdAt,
  variant = 'outline',
}: PrintRegistrationFormButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getButtonClass = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-[#184F48] to-[#2D7A70] hover:opacity-95 text-white shadow-sm';
      case 'secondary':
        return 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm';
      case 'outline':
      default:
        return 'bg-white border border-[#2D7A70]/40 text-[#184F48] hover:bg-[#E8F3F1] shadow-2xs';
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 flex-shrink-0 cursor-pointer ${getButtonClass()}`}
      >
        <FileText className="w-3.5 h-3.5 text-[#2D7A70]" />
        <span>Cetak Formulir (F-PPDB A4)</span>
      </button>

      <OfficialRegistrationFormModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        regNo={regNo}
        studentName={studentName}
        nik={nik}
        gender={gender}
        pob={pob}
        dob={dob}
        address={address}
        schoolName={schoolName}
        schoolSlug={schoolSlug}
        admissionTrack={admissionTrack}
        schoolSpecificData={schoolSpecificData}
        parentData={parentData}
        createdAt={createdAt}
      />
    </>
  );
}

interface EditBiodataButtonProps {
  regNo: string;
  studentName: string;
  nik: string;
  gender: string;
  pob: string;
  dob: string;
  address: string;
  schoolSlug: string;
  schoolSpecificData?: Record<string, any>;
  parentData?: Record<string, any>;
  variant?: 'primary' | 'secondary' | 'outline' | 'amber';
  buttonText?: string;
}

export function EditBiodataButton({
  regNo,
  studentName,
  nik,
  gender,
  pob,
  dob,
  address,
  schoolSlug,
  schoolSpecificData = {},
  parentData = {},
  variant = 'outline',
  buttonText = 'Lengkapi / Susulkan Biodata 28 Poin',
}: EditBiodataButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getButtonClass = () => {
    switch (variant) {
      case 'primary':
        return 'bg-[#184F48] hover:bg-[#133f3a] text-white shadow-sm';
      case 'amber':
        return 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs';
      case 'secondary':
        return 'bg-[#E8F3F1] hover:bg-[#d5eae6] text-[#184F48] border border-[#2D7A70]/30 shadow-2xs';
      case 'outline':
      default:
        return 'bg-white border border-[#2D7A70]/40 text-[#184F48] hover:bg-[#E8F3F1] shadow-2xs';
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 flex-shrink-0 cursor-pointer ${getButtonClass()}`}
      >
        <FileEdit className="w-3.5 h-3.5 text-[#2D7A70]" />
        <span>{buttonText}</span>
      </button>

      <EditBiodataModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        regNo={regNo}
        initialStudentName={studentName}
        initialNik={nik}
        initialGender={gender}
        initialPob={pob}
        initialDob={dob}
        initialAddress={address}
        schoolSlug={schoolSlug}
        schoolSpecificData={schoolSpecificData}
        parentData={parentData}
        onSuccess={() => {
          if (typeof window !== 'undefined') {
            window.location.reload();
          }
        }}
      />
    </>
  );
}

