'use client';

import React from 'react';
import Link from 'next/link';
import { UserCheck, ArrowRight, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

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

  return (
    <div className="bg-white rounded-2xl sm:rounded-[24px] p-4 sm:p-7 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-slate-900 tracking-tight">
            Pendaftar Murid Baru Terkini
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

      {/* Column Headers */}
      <div className="hidden sm:flex items-center gap-3 px-3 pt-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100">
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

      {/* Rows List */}
      <div className="divide-y divide-slate-100 my-auto py-1">
        {recentList.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            Belum ada pendaftaran murid baru hari ini.
          </div>
        ) : (
          recentList.map((app) => (
            <div
              key={app.id}
              className="py-3 flex items-center gap-3 hover:bg-slate-50/80 px-2 sm:px-3 rounded-xl transition-colors"
            >
              {/* 1. Student Name & Parent */}
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-xs sm:text-sm text-slate-900 truncate">
                  {app.studentName}
                </h4>
                <div className="text-xs text-slate-500 truncate mt-0.5">
                  Wali: {app.parentName}
                </div>
              </div>

              {/* 2. SID / No. Registrasi */}
              <div className="hidden sm:flex flex-col items-end justify-center w-28 sm:w-32 flex-shrink-0 text-right">
                <div className="text-xs font-mono font-semibold text-slate-700 whitespace-nowrap">
                  {app.registrationNo}
                </div>
                <div className="text-xs text-slate-400 whitespace-nowrap">
                  {app.schoolName}
                </div>
              </div>

              {/* 3. Status Dot Indicator */}
              <div className="w-28 flex-shrink-0 flex items-center justify-center">
                {app.status === 'ACCEPTED' && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Diterima</span>
                  </span>
                )}
                {app.status === 'VERIFIED' && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>Berkas Sah</span>
                  </span>
                )}
                {app.status === 'PAYMENT_PENDING' && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span>Menunggu Bayar</span>
                  </span>
                )}
                {app.status === 'SUBMITTED' && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span>Terkirim</span>
                  </span>
                )}
              </div>

              {/* 4. Score Ratio / Payment */}
              <div className="w-20 flex-shrink-0 hidden md:flex items-center justify-end">
                <span className={`inline-flex items-center gap-1 text-xs font-semibold whitespace-nowrap ${app.paymentStatus === 'PAID' ? 'text-emerald-700' : 'text-amber-700'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${app.paymentStatus === 'PAID' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <span>{app.paymentStatus === 'PAID' ? 'LUNAS' : 'PENDING'}</span>
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
          className="font-semibold text-slate-700 hover:text-[#10B981] transition-colors"
        >
          Lihat Semua Seleksi →
        </Link>
      </div>
    </div>
  );
}
