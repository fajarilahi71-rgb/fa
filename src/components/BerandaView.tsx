import React from 'react';
import {
  Users,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  FileText,
  Printer,
  ChevronRight,
  TrendingUp,
  Clock,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';
import {
  Student,
  ViolationRecord,
  ViolationRule,
  SchoolSettings
} from '../types/tatib';
import {
  calculateStudentPoints,
  getDisciplineStatus,
  formatCategoryName,
  getCategoryBadge,
  formatDateIndo,
  formatDateShort
} from '../utils/storage';

interface BerandaViewProps {
  students: Student[];
  records: ViolationRecord[];
  rules: ViolationRule[];
  settings: SchoolSettings;
  onOpenQuickRecord: () => void;
  onSelectStudentForReport: (studentId: string) => void;
  onNavigateToTab: (tab: 'siswa' | 'tatib' | 'laporan' | 'seting') => void;
}

export const BerandaView: React.FC<BerandaViewProps> = ({
  students,
  records,
  rules,
  settings,
  onOpenQuickRecord,
  onSelectStudentForReport,
  onNavigateToTab
}) => {
  // Calculations
  const totalStudents = students.length;
  
  // Student points map
  const studentPointsMap = students.map((s) => {
    const points = calculateStudentPoints(s.id, records);
    const status = getDisciplineStatus(points, settings);
    return {
      student: s,
      points,
      status
    };
  });

  const disciplinedCount = studentPointsMap.filter((item) => item.points === 0).length;
  const inGuidanceCount = studentPointsMap.filter((item) => item.points > 0 && item.points < settings.thresholdSp1).length;
  const warningCount = studentPointsMap.filter((item) => item.points >= settings.thresholdSp1).length;

  // Breakdown by violation category
  const categoryCounts = {
    ringan: records.filter((r) => r.category === 'ringan').length,
    sedang: records.filter((r) => r.category === 'sedang').length,
    berat: records.filter((r) => r.category === 'berat').length,
    sangat_berat: records.filter((r) => r.category === 'sangat_berat').length
  };

  const totalViolations = records.length;

  // Students requiring critical attention (sorted by highest points)
  const studentsNeedingAttention = [...studentPointsMap]
    .filter((item) => item.points >= settings.thresholdSp1)
    .sort((a, b) => b.points - a.points);

  // Recent 5 violations
  const recentViolations = [...records]
    .sort((a, b) => new Date(`${b.date}T${b.time || '00:00'}`).getTime() - new Date(`${a.date}T${a.time || '00:00'}`).getTime())
    .slice(0, 6);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Welcome Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-900/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Sistem Buku Disiplin & Pelanggaran Terpadu
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Tata Tertib & Buku Kedisiplinan Siswa
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Selamat datang di portal pengelolaan kedisiplinan dan pembinaan karakter siswa{' '}
              <span className="font-semibold text-white">{settings.schoolName}</span>. Catat pelanggaran secara transparan, pantau sistem kredit poin, dan terbitkan surat peringatan secara otomatis.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <button
              onClick={onOpenQuickRecord}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white font-bold text-sm shadow-lg shadow-rose-950/40 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              Catat Pelanggaran Cepat
            </button>
            <button
              onClick={() => onNavigateToTab('laporan')}
              className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-semibold text-sm border border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              Cetak Laporan / SP
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Siswa */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Peserta Didik
            </p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white mt-1">
              {totalStudents}
            </h3>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Data Aktif & Terdata
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Siswa Tertib */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Tertib & Tanpa Poin
            </p>
            <h3 className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {disciplinedCount}
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
              {totalStudents > 0 ? `${Math.round((disciplinedCount / totalStudents) * 100)}% dari seluruh siswa` : '0%'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Butuh Penanganan / SP */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Peringatan (SP 1, 2, 3)
            </p>
            <h3 className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 mt-1">
              {warningCount}
            </h3>
            <span className="text-xs font-medium text-rose-600 dark:text-rose-400 flex items-center gap-1 mt-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Poin &ge; {settings.thresholdSp1} Poin
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <AlertOctagon className="w-6 h-6" />
          </div>
        </div>

        {/* Total Kasus Pelanggaran */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Kasus Tercatat
            </p>
            <h3 className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">
              {totalViolations}
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
              {categoryCounts.ringan} Ringan &bull; {categoryCounts.sedang} Sedang &bull; {categoryCounts.berat + categoryCounts.sangat_berat} Berat
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <FileText className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Row: Kategori Pelanggaran & Ambang Batas Poin */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Breakdown Pelanggaran Berdasarkan Tingkat */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white text-base">
                Distribusi Kategori Pelanggaran Tata Tertib
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Berdasarkan 4 tingkatan sistem kredit poin pelanggaran sekolah
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('tatib')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Lihat Katalog Tatib <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            {/* Ringan */}
            <div className="p-4 rounded-xl border border-sky-200 dark:border-sky-900/50 bg-sky-50/50 dark:bg-sky-950/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-800 dark:text-sky-300 uppercase tracking-wider">
                  1. Pelanggaran Ringan
                </span>
                <span className="text-xs font-black text-sky-700 dark:text-sky-300 bg-sky-200 dark:bg-sky-900/60 px-2 py-0.5 rounded-full">
                  2 - 10 Poin
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-sky-900 dark:text-sky-100">{categoryCounts.ringan} Kasus</span>
                <span className="text-xs text-sky-600 dark:text-sky-400 font-medium">
                  {totalViolations > 0 ? `${Math.round((categoryCounts.ringan / totalViolations) * 100)}%` : '0%'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">
                Terlambat, atribut seragam, rambut gondrong, keluar kelas saat PBM, buang sampah, HP saat belajar.
              </p>
            </div>

            {/* Sedang */}
            <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                  2. Pelanggaran Sedang
                </span>
                <span className="text-xs font-black text-amber-700 dark:text-amber-300 bg-amber-200 dark:bg-amber-900/60 px-2 py-0.5 rounded-full">
                  15 - 35 Poin
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-amber-900 dark:text-amber-100">{categoryCounts.sedang} Kasus</span>
                <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                  {totalViolations > 0 ? `${Math.round((categoryCounts.sedang / totalViolations) * 100)}%` : '0%'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">
                Membolos/alpa, melompat pagar, merokok berseragam di luar sekolah, bullying verbal, merusak fasilitas meja.
              </p>
            </div>

            {/* Berat */}
            <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider">
                  3. Pelanggaran Berat
                </span>
                <span className="text-xs font-black text-rose-700 dark:text-rose-300 bg-rose-200 dark:bg-rose-900/60 px-2 py-0.5 rounded-full">
                  40 - 75 Poin
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-rose-900 dark:text-rose-100">{categoryCounts.berat} Kasus</span>
                <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {totalViolations > 0 ? `${Math.round((categoryCounts.berat / totalViolations) * 100)}%` : '0%'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">
                Merokok/vape di sekolah, perkelahian fisik, bawa senjata tajam, pemerasan/palak, mencuri, pornografi.
              </p>
            </div>

            {/* Sangat Berat */}
            <div className="p-4 rounded-xl border border-red-300 dark:border-red-900 bg-red-100/60 dark:bg-red-950/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-900 dark:text-red-200 uppercase tracking-wider">
                  4. Sangat Berat
                </span>
                <span className="text-xs font-black text-white bg-red-700 px-2 py-0.5 rounded-full">
                  80 - 100 Poin
                </span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-red-950 dark:text-red-100">{categoryCounts.sangat_berat} Kasus</span>
                <span className="text-xs text-red-700 dark:text-red-300 font-bold">
                  Skorsing / DO
                </span>
              </div>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 line-clamp-2">
                Narkoba, miras di sekolah, tindak pidana kepolisian, provokator tawuran massal, pernikahan dini/hamil.
              </p>
            </div>
          </div>
        </div>

        {/* Ambang Batas Sanksi Poin */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-slate-800 dark:text-white text-base">
              Alur Pembinaan & Surat Peringatan
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ketentuan akumulasi poin dan tindak lanjut pendidik:
          </p>

          <div className="space-y-3 pt-1">
            <div className="flex items-start gap-3 p-2.5 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800/50">
              <span className="font-black text-xs px-2 py-1 rounded bg-yellow-400 text-slate-900 shrink-0">
                &ge; {settings.thresholdSp1} P
              </span>
              <div>
                <p className="text-xs font-bold text-yellow-950 dark:text-yellow-200">Surat Peringatan I (SP 1)</p>
                <p className="text-[11px] text-yellow-800 dark:text-yellow-300">Panggilan Orang Tua I & pembinaan oleh Guru BK / Wali Kelas</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50">
              <span className="font-black text-xs px-2 py-1 rounded bg-amber-500 text-white shrink-0">
                &ge; {settings.thresholdSp2} P
              </span>
              <div>
                <p className="text-xs font-bold text-amber-950 dark:text-amber-200">Surat Peringatan II (SP 2)</p>
                <p className="text-[11px] text-amber-800 dark:text-amber-300">Panggilan Orang Tua II, Skorsing 3 hari & surat perjanjian</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50">
              <span className="font-black text-xs px-2 py-1 rounded bg-rose-600 text-white shrink-0">
                &ge; {settings.thresholdSp3} P
              </span>
              <div>
                <p className="text-xs font-bold text-rose-950 dark:text-rose-200">Surat Peringatan III (SP 3)</p>
                <p className="text-[11px] text-rose-800 dark:text-rose-300">Skorsing 7 hari, perjanjian bermaterai, panggilan Kepala Sekolah</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-lg bg-red-100 dark:bg-red-950/40 border border-red-300 dark:border-red-800">
              <span className="font-black text-xs px-2 py-1 rounded bg-red-700 text-white shrink-0">
                &ge; {settings.thresholdDrop} P
              </span>
              <div>
                <p className="text-xs font-bold text-red-950 dark:text-red-200">Konferensi Kasus Dewan Guru</p>
                <p className="text-[11px] text-red-800 dark:text-red-300">Dikembalikan kepada orang tua / wali (Dikeluarkan)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row: Siswa Butuh Penanganan & Aktivitas Terkini */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Siswa Membutuhkan Tindak Lanjut / SP */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <h3 className="font-bold text-slate-800 dark:text-white text-base">
                Peserta Didik Perlu Perhatian Khusus
              </h3>
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
              {studentsNeedingAttention.length} Siswa
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Siswa dengan akumulasi poin melewati ambang batas pembinaan (SP 1 / SP 2 / SP 3)
          </p>

          <div className="space-y-3">
            {studentsNeedingAttention.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Semua Siswa Dalam Kondisi Tertib
                </p>
                <p className="text-xs text-slate-500">
                  Tidak ada peserta didik yang mencapai ambang batas Surat Peringatan (SP).
                </p>
              </div>
            ) : (
              studentsNeedingAttention.map(({ student, points, status }) => (
                <div
                  key={student.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/80 gap-3 hover:border-slate-300 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {student.name}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                        {student.className}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>NISN: {student.nisn}</span>
                      <span>&bull;</span>
                      <span>Ortu: {student.parentName} ({student.parentPhone})</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-700">
                    <div className="text-right">
                      <span className="font-black text-rose-600 dark:text-rose-400 text-base">{points} Poin</span>
                      <span className={`block text-[10px] font-semibold px-2 py-0.5 rounded-full ${status.badgeBg}`}>
                        {status.label}
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectStudentForReport(student.id)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 shadow-xs cursor-pointer"
                      title="Cetak Surat Peringatan Siswa Ini"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Cetak SP</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Jurnal Pelanggaran Terbaru */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-800 dark:text-white text-base">
                Jurnal Catatan Pelanggaran Terkini
              </h3>
            </div>
            <button
              onClick={() => onNavigateToTab('tatib')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Lihat Semua Log <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Aktivitas pencatatan kedisiplinan terbaru oleh guru dan staf
          </p>

          <div className="space-y-3">
            {recentViolations.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                <p className="text-xs text-slate-500">Belum ada riwayat pelanggaran tercatat.</p>
              </div>
            ) : (
              recentViolations.map((rec) => {
                const catBadge = getCategoryBadge(rec.category);
                return (
                  <div
                    key={rec.id}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-800 dark:text-white">
                          {rec.studentName}
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {rec.studentClass}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${catBadge.badge}`}>
                          {formatCategoryName(rec.category)}
                        </span>
                        <span className="font-black text-xs text-rose-600 dark:text-rose-400">
                          +{rec.points} P
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-1">
                      {rec.ruleName}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                      <span>Pelapor: {rec.reporterName}</span>
                      <span>{formatDateShort(rec.date)} {rec.time ? `• ${rec.time}` : ''}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
