import React, { useState } from 'react';
import {
  Settings,
  School,
  UserCheck,
  Sliders,
  FileSpreadsheet,
  Database,
  Save,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { SchoolSettings, Student, ViolationRecord, ViolationRule } from '../types/tatib';
import {
  resetAllDataToDefault,
  exportAllDataAsJson,
  importAllDataFromJson
} from '../utils/storage';
import {
  exportStudentsToCsv,
  exportRecordsToCsv,
  exportRulesToCsv,
  triggerDownload
} from '../utils/googleSheets';

interface SetingViewProps {
  settings: SchoolSettings;
  onSaveSettings: (settings: SchoolSettings) => void;
  students: Student[];
  records: ViolationRecord[];
  rules: ViolationRule[];
  onReloadAllData: () => void;
}

export const SetingView: React.FC<SetingViewProps> = ({
  settings,
  onSaveSettings,
  students,
  records,
  rules,
  onReloadAllData
}) => {
  const [formData, setFormData] = useState<SchoolSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<'profil' | 'ambang' | 'sheets' | 'database'>('profil');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportBackup = () => {
    const jsonStr = exportAllDataAsJson();
    const dateStr = new Date().toISOString().split('T')[0];
    triggerDownload(jsonStr, `SiTatib_Backup_${dateStr}.json`, 'application/json');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = importAllDataFromJson(content);
        if (ok) {
          alert('Data berhasil dipulihkan dari berkas backup!');
          onReloadAllData();
        } else {
          alert('Format berkas backup tidak valid.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefault = () => {
    if (
      window.confirm(
        'Apakah Anda yakin ingin mengatur ulang semua data (siswa, pelanggaran, aturan tatib, pengaturan) ke contoh awal bawaan?'
      )
    ) {
      resetAllDataToDefault();
      alert('Semua data berhasil direset ke pengaturan awal.');
      onReloadAllData();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600" />
            Pengaturan Sistem & Profil Sekolah
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Konfigurasi kop surat resmi, nama pejabat penandatangan, ambang batas poin SP, integrasi Google Sheets, dan cadangan data
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Pengaturan Berhasil Disimpan!
          </div>
        )}
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-700 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSubTab('profil')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'profil'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <School className="w-4 h-4" />
          Profil Sekolah & Kop Surat
        </button>

        <button
          onClick={() => setActiveSubTab('ambang')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'ambang'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Ambang Batas Poin Sanksi (SP)
        </button>

        <button
          onClick={() => setActiveSubTab('sheets')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'sheets'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          Integrasi Google Sheets
        </button>

        <button
          onClick={() => setActiveSubTab('database')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'database'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Database className="w-4 h-4" />
          Cadangan & Pemulihan Data
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SUBTAB 1: PROFIL SEKOLAH & PEJABAT */}
        {activeSubTab === 'profil' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <School className="w-4 h-4 text-indigo-600" />
                Identitas Lembaga & Kop Surat Dokumen
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Informasi ini akan tercetak otomatis pada kepala surat (kop) Surat Peringatan, Surat Panggilan Orang Tua, dan Buku Rekam Disiplin.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Instansi / Dinas Pendidikan Penaung
                  </label>
                  <input
                    type="text"
                    name="educationDepartment"
                    value={formData.educationDepartment}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Nama Satuan Pendidikan (Sekolah) *
                  </label>
                  <input
                    type="text"
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    NPSN (Nomor Pokok Sekolah Nasional)
                  </label>
                  <input
                    type="text"
                    name="npsn"
                    value={formData.npsn}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Alamat Lengkap Sekolah
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Kota / Kabupaten Titimangsa Dokumen
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Nomor Telepon Kantor
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Email Resmi
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Website / Portal Sekolah
                  </label>
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Pejabat Penandatangan */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-indigo-600" />
                Data Pejabat Penandatangan Surat & Laporan
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Nama Kepala Sekolah Lengkap Gelar
                  </label>
                  <input
                    type="text"
                    name="headmasterName"
                    value={formData.headmasterName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    NIP Kepala Sekolah
                  </label>
                  <input
                    type="text"
                    name="headmasterNip"
                    value={formData.headmasterNip}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Nama Koordinator Bimbingan Konseling (BK)
                  </label>
                  <input
                    type="text"
                    name="bkCoordinatorName"
                    value={formData.bkCoordinatorName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    NIP Koordinator BK
                  </label>
                  <input
                    type="text"
                    name="bkCoordinatorNip"
                    value={formData.bkCoordinatorNip}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Nama Koordinator Ketertiban / Tim Tatib
                  </label>
                  <input
                    type="text"
                    name="tatibCoordinatorName"
                    value={formData.tatibCoordinatorName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    NIP Koordinator Tatib
                  </label>
                  <input
                    type="text"
                    name="tatibCoordinatorNip"
                    value={formData.tatibCoordinatorNip}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: AMBANG BATAS POIN SANKSI */}
        {activeSubTab === 'ambang' && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-xs space-y-6">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600" />
                Ketentuan Ambang Batas Poin Sanksi & Surat Peringatan
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Tentukan jumlah batas kredit poin pelanggaran bagi peserta didik untuk memicu penerbitan surat peringatan dan tindakan pembinaan sekolah.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* SP 1 */}
              <div className="p-4 rounded-xl border border-yellow-200 dark:border-yellow-800/60 bg-yellow-50/50 dark:bg-yellow-950/20 space-y-2">
                <span className="text-xs font-bold text-yellow-900 dark:text-yellow-200 block uppercase">
                  Peringatan I (SP 1)
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    name="thresholdSp1"
                    min={1}
                    max={100}
                    value={formData.thresholdSp1}
                    onChange={handleChange}
                    className="w-24 px-3 py-1.5 text-base font-black rounded-lg border border-yellow-300 dark:border-yellow-700 bg-white dark:bg-slate-900 text-yellow-900 dark:text-yellow-200"
                  />
                  <span className="text-xs font-semibold text-yellow-800 dark:text-yellow-300">Poin</span>
                </div>
                <p className="text-[11px] text-yellow-700 dark:text-yellow-400">
                  Pembinaan Wali Kelas, bimbingan awal BK, dan teguran tertulis.
                </p>
              </div>

              {/* SP 2 */}
              <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/50 dark:bg-amber-950/20 space-y-2">
                <span className="text-xs font-bold text-amber-900 dark:text-amber-200 block uppercase">
                  Peringatan II (SP 2)
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    name="thresholdSp2"
                    min={1}
                    max={100}
                    value={formData.thresholdSp2}
                    onChange={handleChange}
                    className="w-24 px-3 py-1.5 text-base font-black rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 text-amber-900 dark:text-amber-200"
                  />
                  <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">Poin</span>
                </div>
                <p className="text-[11px] text-amber-700 dark:text-amber-400">
                  Panggilan Orang Tua II, skorsing belajar mandiri 3 hari, dan surat perjanjian.
                </p>
              </div>

              {/* SP 3 */}
              <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-800/60 bg-rose-50/50 dark:bg-rose-950/20 space-y-2">
                <span className="text-xs font-bold text-rose-900 dark:text-rose-200 block uppercase">
                  Peringatan III (SP 3)
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    name="thresholdSp3"
                    min={1}
                    max={100}
                    value={formData.thresholdSp3}
                    onChange={handleChange}
                    className="w-24 px-3 py-1.5 text-base font-black rounded-lg border border-rose-300 dark:border-rose-700 bg-white dark:bg-slate-900 text-rose-900 dark:text-rose-200"
                  />
                  <span className="text-xs font-semibold text-rose-800 dark:text-rose-300">Poin</span>
                </div>
                <p className="text-[11px] text-rose-700 dark:text-rose-400">
                  Skorsing 7 hari, surat perjanjian bermaterai Rp 10.000, peringatan terakhir.
                </p>
              </div>

              {/* Drop / DO */}
              <div className="p-4 rounded-xl border border-red-300 dark:border-red-800 bg-red-100/60 dark:bg-red-950/40 space-y-2">
                <span className="text-xs font-bold text-red-950 dark:text-red-200 block uppercase">
                  Dikembalikan ke Orang Tua
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    name="thresholdDrop"
                    min={1}
                    max={100}
                    value={formData.thresholdDrop}
                    onChange={handleChange}
                    className="w-24 px-3 py-1.5 text-base font-black rounded-lg border border-red-400 dark:border-red-700 bg-white dark:bg-slate-900 text-red-900 dark:text-red-200"
                  />
                  <span className="text-xs font-semibold text-red-800 dark:text-red-300">Poin</span>
                </div>
                <p className="text-[11px] text-red-700 dark:text-red-400">
                  Konferensi kasus dewan guru, pemberhentian hak siswa (Dikeluarkan).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 3: INTEGRASI GOOGLE SHEETS */}
        {activeSubTab === 'sheets' && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
                  <FileSpreadsheet className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Integrasi Google Sheets & Akun Belajar
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Akun Guru Terhubung:{' '}
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      fajarilahi71@guru.smp.belajar.id
                    </span>
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Siap Sinkronisasi Sheets
              </span>
            </div>

            {/* Quick Export Downloads for Sheets */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Unduh Data Siap Impor ke Google Spreadsheet:
              </span>
              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    const csv = exportStudentsToCsv(students, records, settings);
                    triggerDownload(csv, `Sheet_Data_Siswa_${new Date().toISOString().split('T')[0]}.csv`);
                  }}
                  className="px-3.5 py-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  Unduh Sheet Siswa & Poin (CSV)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const csv = exportRecordsToCsv(records);
                    triggerDownload(csv, `Sheet_Jurnal_Pelanggaran_${new Date().toISOString().split('T')[0]}.csv`);
                  }}
                  className="px-3.5 py-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  Unduh Sheet Jurnal Pelanggaran (CSV)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const csv = exportRulesToCsv(rules);
                    triggerDownload(csv, `Sheet_Katalog_Tatib_${new Date().toISOString().split('T')[0]}.csv`);
                  }}
                  className="px-3.5 py-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-600 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  Unduh Sheet Katalog Tatib (CSV)
                </button>
              </div>
            </div>

            {/* Google Sheets Config Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  ID Google Spreadsheet (Opsional)
                </label>
                <input
                  type="text"
                  name="googleSheetId"
                  value={formData.googleSheetId}
                  onChange={handleChange}
                  placeholder="Contoh: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Dapat disalin dari URL Google Sheets setelah `/d/` dan sebelum `/edit`
                </span>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Tab / Lembar Kerja Sheet
                </label>
                <input
                  type="text"
                  name="googleSheetName"
                  value={formData.googleSheetName}
                  onChange={handleChange}
                  placeholder="SiTatib_Data_Pelanggaran"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Instruction Steps */}
            <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/20 text-xs text-slate-700 dark:text-slate-300 space-y-2">
              <span className="font-bold text-indigo-900 dark:text-indigo-200 block">
                Petunjuk Integrasi Google Sheets:
              </span>
              <ol className="list-decimal pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                <li>
                  Klik tombol <strong>Unduh Sheet Jurnal Pelanggaran (CSV)</strong> di atas.
                </li>
                <li>
                  Buka akun Google Drive / Google Sheets Anda (dengan akun <code>fajarilahi71@guru.smp.belajar.id</code>).
                </li>
                <li>
                  Pilih <strong>File &rarr; Impor &rarr; Upload</strong> berkas CSV yang diunduh untuk membuka data tatib di spreadsheet secara langsung.
                </li>
              </ol>
            </div>
          </div>
        )}

        {/* SUBTAB 4: CADANGAN & PEMULIHAN */}
        {activeSubTab === 'database' && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-xs space-y-6">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-600" />
                Manajemen Cadangan & Pemulihan Data (Backup & Restore)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Simpan seluruh data siswa, riwayat pelanggaran, aturan tatib, dan rekam bimbingan konseling ke file JSON cadangan agar data tidak hilang.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Backup */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 space-y-3">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-800 dark:text-white">
                  <Download className="w-4 h-4 text-indigo-600" />
                  Cadangkan Seluruh Data (Backup)
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Unduh seluruh database SiTatib dalam satu berkas format JSON untuk disimpan di komputer atau Google Drive Anda.
                </p>
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Unduh File Backup JSON
                </button>
              </div>

              {/* Restore */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 space-y-3">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-800 dark:text-white">
                  <Upload className="w-4 h-4 text-emerald-600" />
                  Pulihkan dari Berkas JSON (Restore)
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pilih file backup JSON yang pernah Anda unduh sebelumnya untuk memulihkan seluruh data aplikasi.
                </p>
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Pilih File Restore (.json)
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportBackup}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Reset to Default */}
            <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="font-bold text-xs text-red-900 dark:text-red-200 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  Reset ke Data Awal Bawaan (Default Sample Data)
                </span>
                <p className="text-[11px] text-red-800 dark:text-red-300">
                  Kembalikan master data siswa, aturan tata tertib 4 kategori, dan contoh kasus ke format semula.
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetDefault}
                className="px-3.5 py-1.5 rounded-lg border border-red-300 dark:border-red-800 bg-white dark:bg-slate-900 text-red-700 dark:text-red-300 hover:bg-red-100 text-xs font-bold shrink-0 cursor-pointer"
              >
                Reset ke Default
              </button>
            </div>
          </div>
        )}

        {/* Save Button Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Simpan Perubahan Pengaturan
          </button>
        </div>
      </form>
    </div>
  );
};
