'use client';

import React from 'react';
import Link from 'next/link';
import { UserCheck, ArrowRight, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import StudentEduAvatar from '@/components/common/StudentEduAvatar';

interface RecentApplicant {
  id: string;
  registrationNo: string;
  studentName: string;
  gender?: string;
  schoolName: string;
  schoolSlug: string;
  parentName: string;
  status: string;
  paymentStatus: string;
  amount: number;
  createdAt: string;
}

interface EdukaRecentStudentsProps {
  applicants: RecentApplicant[];
  schoolSlug?: 'tk' | 'sd' | 'smp' | 'foundation';
}

export default function EdukaRecentStudents({ applicants, schoolSlug = 'foundation' }: EdukaRecentStudentsProps) {
  // Take up to 5 most recent applicants
  const recentList = applicants.slice(0, 5);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="bg-white rounded-[24px] p-6 sm:p-7 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-slate-900 tracking-tight">
            Pendaftar Murid Baru Terkini (Recent Applicants)
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Calon murid yang baru mendaftar di sistem PPDB
          </p>
        </div>

        <Link
          href={schoolSlug && schoolSlug !== 'foundation' ? `/admin/${schoolSlug}/students` : '/admin/foundation/students'}
          className="text-xs font-semibold text-[#10B981] hover:underline flex items-center space-x-1"
        >
          <span>Buku Induk</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Column Headers for Perfect Horizontal & Vertical Alignment */}
      <div className="hidden sm:flex items-center gap-3 px-3 pt-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
        <div className="flex-1 min-w-0">
          Calon Murid
        </div>
        <div className="w-28 sm:w-32 flex-shrink-0 text-right">
          No. Registrasi
        </div>
        <div className="w-28 flex-shrink-0 text-center">
          Status Berkas
        </div>
        <div className="w-20 flex-shrink-0 text-right pr-1 hidden md:block">
          Biaya
        </div>
      </div>

      {/* Rows List with Strict Tabular Alignment */}
      <div className="divide-y divide-slate-100 my-auto py-1">
        {recentList.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            Belum ada pendaftaran murid baru hari ini.
          </div>
        ) : (
          recentList.map((app) => (
            <div
              key={app.id}
              className="py-3 flex items-center gap-3 hover:bg-slate-50/80 px-2 sm:px-3 rounded-2xl transition-colors"
            >
              {/* 1. Avatar + Name (Flex-1 absorbs variation in name lengths) */}
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <StudentEduAvatar
                  gender={app.gender}
                  name={app.studentName}
                  size="md"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-xs sm:text-sm text-slate-900 truncate">
                    {app.studentName}
                  </h4>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    Wali: {app.parentName}
                  </div>
                </div>
              </div>

              {/* 2. SID / No. Registrasi (Fixed-width column, right-aligned) */}
              <div className="hidden sm:flex flex-col items-end justify-center w-28 sm:w-32 flex-shrink-0 text-right">
                <div className="text-[11px] font-mono font-semibold text-slate-700">
                  {app.registrationNo}
                </div>
                <div className="text-[10px] text-slate-400">
                  {app.schoolName}
                </div>
              </div>

              {/* 3. Status Badge Pill (Fixed-width column, centered uniform badge) */}
              <div className="w-28 flex-shrink-0 flex items-center justify-center">
                {app.status === 'ACCEPTED' && (
                  <span className="inline-block w-24 text-center py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                    Diterima
                  </span>
                )}
                {app.status === 'VERIFIED' && (
                  <span className="inline-block w-24 text-center py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs">
                    Berkas Sah
                  </span>
                )}
                {app.status === 'PAYMENT_PENDING' && (
                  <span className="inline-block w-24 text-center py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs">
                    Menunggu Bayar
                  </span>
                )}
                {app.status === 'SUBMITTED' && (
                  <span className="inline-block w-24 text-center py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs">
                    Terkirim
                  </span>
                )}
              </div>

              {/* 4. Score Ratio / Payment (Fixed-width column, right-aligned) */}
              <div className="w-20 flex-shrink-0 hidden md:flex items-center justify-end">
                <span className="inline-block w-16 text-center text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg tabular-nums">
                  {app.paymentStatus === 'PAID' ? 'LUNAS' : 'PENDING'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer link to all PPDB selection */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-2">
        <span>Menampilkan 5 pendaftar terbaru</span>
        <Link
          href="/admin/sd/ppdb"
          className="font-bold text-slate-700 hover:text-[#10B981] transition-colors"
        >
          Lihat Semua Seleksi →
        </Link>
      </div>
    </div>
  );
}
