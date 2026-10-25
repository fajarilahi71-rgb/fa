import React from 'react';
import {
  LayoutDashboard,
  Users,
  ShieldAlert,
  Printer,
  Settings,
  PlusCircle,
  School,
  FileSpreadsheet,
  HelpCircle
} from 'lucide-react';
import { SchoolSettings } from '../types/tatib';

export type ActiveTab = 'beranda' | 'siswa' | 'tatib' | 'laporan' | 'seting';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  settings: SchoolSettings;
  onOpenQuickRecord: () => void;
  onOpenGuide: () => void;
  pendingSpCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  settings,
  onOpenQuickRecord,
  onOpenGuide,
  pendingSpCount
}) => {
  const currentDateIndo = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const navItems = [
    {
      id: 'beranda' as ActiveTab,
      label: 'Beranda',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'siswa' as ActiveTab,
      label: 'Nama Siswa & Kelas',
      icon: Users,
      badge: pendingSpCount > 0 ? `${pendingSpCount} SP` : null,
      badgeColor: 'bg-rose-500 text-white'
    },
    {
      id: 'tatib' as ActiveTab,
      label: 'Tata Tertib / Pelanggaran',
      icon: ShieldAlert,
      badge: null
    },
    {
      id: 'laporan' as ActiveTab,
      label: 'Laporan Cetak Per Siswa',
      icon: Printer,
      badge: 'Resmi',
      badgeColor: 'bg-emerald-600 text-white'
    },
    {
      id: 'seting' as ActiveTab,
      label: 'Seting',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-lg border-b border-slate-800 no-print">
      {/* Top Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-400 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white">
              <School className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight bg-gradient-to-r from-sky-300 via-white to-indigo-200 bg-clip-text text-transparent">
                  SiTatib
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-900/80 text-indigo-300 border border-indigo-700/60">
                  SMP / MTs / SMA
                </span>
              </div>
              <h1 className="text-xs text-slate-400 font-medium truncate max-w-xs sm:max-w-md">
                {settings.schoolName || 'Sistem Tata Tertib Peserta Didik'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs text-slate-300 font-medium">{currentDateIndo}</span>
              <span className="text-[11px] text-emerald-400 flex items-center justify-end gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Tahun Ajaran 2026/2027
              </span>
            </div>

            {/* Panduan Button */}
            <button
              onClick={onOpenGuide}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              title="Buka Buku Panduan Penggunaan"
            >
              <HelpCircle className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline">Panduan</span>
            </button>

            {/* Quick Action Button */}
            <button
              onClick={onOpenQuickRecord}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white text-xs sm:text-sm font-semibold shadow-md shadow-rose-900/30 transition-all active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Catat Pelanggaran</span>
              <span className="sm:hidden">Catat</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 sm:space-x-2 py-2 overflow-x-auto scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      item.badgeColor || 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
