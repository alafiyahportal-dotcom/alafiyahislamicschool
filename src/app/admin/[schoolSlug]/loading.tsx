import React from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminUnitLoading() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title="Memuat Data..."
          subtitle="Mohon tunggu sejenak"
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full space-y-6 animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-28 bg-white rounded-2xl border border-slate-200/70 p-5 flex flex-col justify-between"
              >
                <div className="h-3.5 w-24 bg-slate-200 rounded-md" />
                <div className="h-7 w-16 bg-slate-200 rounded-lg" />
              </div>
            ))}
          </div>
          <div className="h-96 bg-white rounded-2xl border border-slate-200/70 p-6 space-y-4">
            <div className="h-5 w-48 bg-slate-200 rounded-md" />
            <div className="h-4 w-full bg-slate-100 rounded-md" />
            <div className="h-4 w-5/6 bg-slate-100 rounded-md" />
            <div className="h-64 w-full bg-slate-50 rounded-xl mt-4" />
          </div>
        </main>
      </div>
    </div>
  );
}
