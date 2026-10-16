import React from 'react';

export default function AffiliateDashboardLoading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* Top Header Shimmer */}
      <header className="bg-white border-b border-slate-200/90 h-16 flex items-center px-4 sm:px-8">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 animate-pulse" />
            <div className="space-y-1">
              <div className="h-4 w-40 bg-slate-200 rounded animate-pulse" />
              <div className="h-3 w-56 bg-slate-100 rounded animate-pulse" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-9 w-28 bg-slate-100 rounded-xl animate-pulse" />
            <div className="h-9 w-9 bg-slate-100 rounded-xl animate-pulse" />
          </div>
        </div>
      </header>

      {/* Main Content Area Shimmer */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Banner Shimmer */}
        <div className="rounded-2xl bg-[#064E3B]/80 h-32 p-6 flex flex-col justify-center space-y-3">
          <div className="h-6 w-64 bg-white/20 rounded-lg animate-pulse" />
          <div className="h-3.5 w-96 bg-white/10 rounded animate-pulse" />
        </div>

        {/* 4 Cards Grid Shimmer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-3.5 w-24 bg-slate-100 rounded animate-pulse" />
                <div className="w-8 h-8 rounded-xl bg-slate-100 animate-pulse" />
              </div>
              <div className="h-7 w-32 bg-slate-200 rounded-lg animate-pulse" />
              <div className="h-3 w-28 bg-slate-100 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Big Action Card Shimmer */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
          <div className="h-5 w-44 bg-slate-200 rounded animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-28 bg-slate-50 border border-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
