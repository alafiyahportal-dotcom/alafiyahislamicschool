import React from 'react';

export default function AdminUnitLoading() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      {/* Sidebar Placeholder */}
      <div className="hidden lg:flex w-64 flex-col bg-white border-r border-slate-100 p-4 space-y-4">
        <div className="h-12 w-3/4 bg-slate-100 rounded-xl animate-pulse" />
        <div className="space-y-2 pt-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-9 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar Shimmer */}
        <div className="h-16 sm:h-20 bg-white border-b border-slate-100 px-6 flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-5 w-44 bg-slate-200 rounded-lg animate-pulse" />
            <div className="h-3 w-64 bg-slate-100 rounded-md animate-pulse" />
          </div>
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-full bg-slate-100 animate-pulse" />
            <div className="h-9 w-24 bg-slate-100 rounded-xl animate-pulse" />
          </div>
        </div>

        {/* Dashboard Body Shimmer */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-2xs space-y-3">
                <div className="flex justify-between items-center">
                  <div className="h-3.5 w-20 bg-slate-100 rounded animate-pulse" />
                  <div className="w-8 h-8 rounded-xl bg-slate-100 animate-pulse" />
                </div>
                <div className="h-7 w-28 bg-slate-200 rounded-lg animate-pulse" />
                <div className="h-3 w-36 bg-slate-100 rounded animate-pulse" />
              </div>
            ))}
          </div>

          {/* Main Content Card Shimmer */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-2xs space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div className="h-5 w-48 bg-slate-200 rounded-md animate-pulse" />
              <div className="h-8 w-28 bg-slate-100 rounded-xl animate-pulse" />
            </div>
            <div className="space-y-3 pt-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-14 bg-slate-50 rounded-xl border border-slate-100/60 animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
