import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  UserCheck,
  Search,
  Scale
} from 'lucide-react';
import {
  Student,
  ViolationRule,
  ViolationRecord,
  SchoolSettings,
  ViolationCategoryKey
} from '../types/tatib';
import {
  calculateStudentPoints,
  getDisciplineStatus,
  formatCategoryName,
  getCategoryBadge
} from '../utils/storage';

interface ModalCatatPelanggaranProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  rules: ViolationRule[];
  records: ViolationRecord[];
  settings: SchoolSettings;
  onSaveRecord: (newRecord: ViolationRecord) => void;
  preSelectedStudentId?: string;
}

export const ModalCatatPelanggaran: React.FC<ModalCatatPelanggaranProps> = ({
  isOpen,
  onClose,
  students,
  rules,
  records,
  settings,
  onSaveRecord,
  preSelectedStudentId
}) => {
  if (!isOpen) return null;

  const now = new Date();
  const currentDateStr = now.toISOString().split('T')[0];
  const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    preSelectedStudentId || (students[0]?.id || '')
  );
  const [selectedRuleId, setSelectedRuleId] = useState<string>(rules[0]?.id || '');
  const [date, setDate] = useState<string>(currentDateStr);
  const [time, setTime] = useState<string>(currentTimeStr);
  const [location, setLocation] = useState<string>('Lingkungan Sekolah');
  const [reporterName, setReporterName] = useState<string>('Guru Piket / Tim Tatib');
  const [notes, setNotes] = useState<string>('');
  const [followUpAction, setFollowUpAction] = useState<string>('');
  const [searchStudentQuery, setSearchStudentQuery] = useState<string>('');
  const [ruleCategoryFilter, setRuleCategoryFilter] = useState<string>('all');
  const [searchRuleQuery, setSearchRuleQuery] = useState<string>('');

  const selectedStudent = students.find((s) => s.id === selectedStudentId);
  const selectedRule = rules.find((r) => r.id === selectedRuleId);

  const currentPoints = selectedStudent ? calculateStudentPoints(selectedStudent.id, records) : 0;
  const additionalPoints = selectedRule ? selectedRule.points : 0;
  const projectedPoints = currentPoints + additionalPoints;

  const currentStatus = getDisciplineStatus(currentPoints, settings);
  const projectedStatus = getDisciplineStatus(projectedPoints, settings);

  const filteredStudents = students.filter((s) => {
    const q = searchStudentQuery.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.nisn.includes(q) || s.className.toLowerCase().includes(q);
  });

  const filteredRules = rules.filter((r) => {
    const matchesCat = ruleCategoryFilter === 'all' || r.category === ruleCategoryFilter;
    const matchesSearch =
      r.name.toLowerCase().includes(searchRuleQuery.toLowerCase()) ||
      r.code.toLowerCase().includes(searchRuleQuery.toLowerCase()) ||
      r.subCategory.toLowerCase().includes(searchRuleQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !selectedRule) return;

    const newRecord: ViolationRecord = {
      id: `rec-${Date.now()}`,
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      studentClass: selectedStudent.className,
      ruleId: selectedRule.id,
      ruleCode: selectedRule.code,
      ruleName: selectedRule.name,
      category: selectedRule.category,
      points: selectedRule.points,
      date,
      time,
      location,
      reporterName,
      notes: notes.trim() || `Pelanggaran ${selectedRule.name} pada jam ${time}`,
      followUpAction: followUpAction.trim() || selectedRule.sanction,
      isResolved: false
    };

    onSaveRecord(newRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-red-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Formulir Catat Pelanggaran Siswa</h3>
              <p className="text-xs text-rose-100">Sistem Poin Tata Tertib & Buku Kedisiplinan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Section 1: Pilih Siswa */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-indigo-600" />
                Pilih Peserta Didik (Siswa)
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama / NISN / kelas..."
                  value={searchStudentQuery}
                  onChange={(e) => setSearchStudentQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-indigo-500 w-full sm:w-56"
                />
              </div>
            </div>

            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 font-medium"
              required
            >
              {filteredStudents.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.className} — {s.name} (NISN: {s.nisn})
                </option>
              ))}
            </select>

            {/* Current vs Projected Score Badge */}
            {selectedStudent && (
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                <div className="text-xs flex items-center justify-between bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400">Poin Saat Ini:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700 dark:text-slate-200">{currentPoints} Poin</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${currentStatus.badgeBg}`}>
                      {currentStatus.label}
                    </span>
                  </div>
                </div>

                <div className="text-xs flex items-center justify-between bg-rose-50 dark:bg-rose-950/30 p-2.5 rounded-lg border border-rose-200 dark:border-rose-900/50">
                  <span className="text-rose-700 dark:text-rose-300 font-medium">Setelah Ditambah:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-rose-700 dark:text-rose-300 text-sm">{projectedPoints} Poin</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${projectedStatus.badgeBg}`}>
                      {projectedStatus.label}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Warning Banner if threshold exceeded */}
          {selectedStudent && projectedPoints >= settings.thresholdSp1 && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-800 dark:text-amber-100">
                  Peringatan Kedisiplinan: Ambang Batas {projectedStatus.label} Tercapai!
                </p>
                <p className="mt-0.5 text-amber-700 dark:text-amber-300">
                  Dengan penambahan pelanggaran ini, total poin siswa mencapai {projectedPoints}. Disarankan untuk segera mencetak Surat Peringatan (SP) atau Surat Panggilan Orang Tua pada menu Laporan Cetak.
                </p>
              </div>
            </div>
          )}

          {/* Section 2: Pilih Jenis Pelanggaran */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Pilih Aturan / Jenis Pelanggaran
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={ruleCategoryFilter}
                  onChange={(e) => setRuleCategoryFilter(e.target.value)}
                  className="px-2.5 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                >
                  <option value="all">Semua Kategori</option>
                  <option value="ringan">Ringan (2-10 Poin)</option>
                  <option value="sedang">Sedang (15-35 Poin)</option>
                  <option value="berat">Berat (40-75 Poin)</option>
                  <option value="sangat_berat">Sangat Berat (80-100 Poin)</option>
                </select>
                <input
                  type="text"
                  placeholder="Filter aturan..."
                  value={searchRuleQuery}
                  onChange={(e) => setSearchRuleQuery(e.target.value)}
                  className="px-2.5 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 w-36"
                />
              </div>
            </div>

            <select
              value={selectedRuleId}
              onChange={(e) => {
                setSelectedRuleId(e.target.value);
                const r = rules.find((rule) => rule.id === e.target.value);
                if (r && !followUpAction) {
                  setFollowUpAction(r.sanction);
                }
              }}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
              required
            >
              {filteredRules.map((r) => (
                <option key={r.id} value={r.id}>
                  [{r.code}] [{formatCategoryName(r.category)} +{r.points}P] {r.name}
                </option>
              ))}
            </select>

            {/* Selected Rule Details Box */}
            {selectedRule && (
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 dark:text-slate-100">{selectedRule.code}: {selectedRule.subCategory}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getCategoryBadge(selectedRule.category).badge}`}>
                      {formatCategoryName(selectedRule.category)}
                    </span>
                  </div>
                  <span className="font-extrabold text-rose-600 dark:text-rose-400 text-sm">
                    +{selectedRule.points} Poin
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 italic">
                  Sanksi Anjuran Tatib: {selectedRule.sanction}
                </p>
              </div>
            )}
          </div>

          {/* Section 3: Waktu, Lokasi, dan Pelapor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 mb-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Tanggal
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 mb-1">
                <Clock className="w-3.5 h-3.5 text-indigo-500" /> Jam / Waktu
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 mb-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-500" /> Lokasi Kejadian
              </label>
              <input
                type="text"
                placeholder="Contoh: Gerbang / Kantin / Kelas"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 mb-1">
                <UserCheck className="w-3.5 h-3.5 text-indigo-500" /> Guru / Tim Pelapor
              </label>
              <input
                type="text"
                placeholder="Nama guru / petugas piket"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                required
              />
            </div>
          </div>

          {/* Section 4: Kronologi & Tindakan Langsung */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Kronologi / Catatan Bukti Kejadian
              </label>
              <textarea
                rows={2}
                placeholder="Tuliskan keterangan detail kejadian, saksi, atau barang bukti yang diamankan..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Tindakan Pembinaan Langsung / Sanksi Edukatif Diberikan
              </label>
              <input
                type="text"
                placeholder="Contoh: Teguran lisan, pemanggilan ke ruang BK, disita barang, dsb."
                value={followUpAction}
                onChange={(e) => setFollowUpAction(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-semibold text-xs sm:text-sm shadow-md shadow-rose-900/20 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              Simpan Pelanggaran Siswa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
