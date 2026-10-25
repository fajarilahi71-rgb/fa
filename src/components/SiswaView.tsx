import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Filter,
  Download,
  Upload,
  Phone,
  Printer,
  AlertTriangle,
  FileText,
  Edit2,
  Trash2,
  UserCheck,
  CheckCircle2,
  X,
  History,
  MessageSquare,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import {
  Student,
  ViolationRecord,
  SchoolSettings,
  CounselingLog
} from '../types/tatib';
import {
  calculateStudentPoints,
  getDisciplineStatus,
  formatDateIndo,
  formatDateShort,
  getCategoryBadge,
  formatCategoryName
} from '../utils/storage';
import { exportStudentsToCsv, triggerDownload } from '../utils/googleSheets';

interface SiswaViewProps {
  students: Student[];
  records: ViolationRecord[];
  settings: SchoolSettings;
  counselingLogs: CounselingLog[];
  onSaveStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  onRecordViolationForStudent: (studentId: string) => void;
  onPrintReportForStudent: (studentId: string) => void;
  onSaveCounselingLog: (log: CounselingLog) => void;
}

export const SiswaView: React.FC<SiswaViewProps> = ({
  students,
  records,
  settings,
  counselingLogs,
  onSaveStudent,
  onDeleteStudent,
  onRecordViolationForStudent,
  onPrintReportForStudent,
  onSaveCounselingLog
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingProfileStudent, setViewingProfileStudent] = useState<Student | null>(null);

  // Profile modal active subtab
  const [profileTab, setProfileTab] = useState<'violations' | 'counseling'>('violations');
  const [isAddingCounseling, setIsAddingCounseling] = useState<boolean>(false);
  const [newCounselingTitle, setNewCounselingTitle] = useState<string>('');
  const [newCounselingNotes, setNewCounselingNotes] = useState<string>('');
  const [newCounselingAgreement, setNewCounselingAgreement] = useState<string>('');

  // Extract all unique classes
  const classesList = Array.from(new Set(students.map((s) => s.className))).sort();

  // Filter students
  const filteredStudents = students.filter((student) => {
    const points = calculateStudentPoints(student.id, records);
    const status = getDisciplineStatus(points, settings);

    const matchesClass = selectedClass === 'all' || student.className === selectedClass;
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.nisn.includes(searchQuery) ||
      student.nipd.includes(searchQuery) ||
      student.parentName.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesStatus = true;
    if (selectedStatus === 'aman') matchesStatus = points === 0;
    else if (selectedStatus === 'bina') matchesStatus = points > 0 && points < settings.thresholdSp1;
    else if (selectedStatus === 'sp1') matchesStatus = points >= settings.thresholdSp1 && points < settings.thresholdSp2;
    else if (selectedStatus === 'sp2') matchesStatus = points >= settings.thresholdSp2 && points < settings.thresholdSp3;
    else if (selectedStatus === 'sp3') matchesStatus = points >= settings.thresholdSp3;

    return matchesClass && matchesSearch && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setIsFormModalOpen(true);
  };

  const handleExportCsv = () => {
    const csv = exportStudentsToCsv(students, records, settings);
    triggerDownload(csv, `Data_Siswa_Kedisiplinan_${new Date().toISOString().split('T')[0]}.csv`);
  };

  // Student Form Modal Component
  const renderStudentFormModal = () => {
    if (!isFormModalOpen) return null;

    const initialData: Partial<Student> = editingStudent || {
      nisn: '',
      nipd: '',
      name: '',
      gender: 'L',
      className: classesList[0] || 'VII A',
      parentName: '',
      parentPhone: '',
      address: '',
      status: 'aktif'
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget;
      const formData = new FormData(form);

      const savedStudent: Student = {
        id: editingStudent ? editingStudent.id : `std-${Date.now()}`,
        nisn: (formData.get('nisn') as string).trim(),
        nipd: (formData.get('nipd') as string).trim(),
        name: (formData.get('name') as string).trim(),
        gender: (formData.get('gender') as 'L' | 'P') || 'L',
        className: (formData.get('className') as string).trim(),
        parentName: (formData.get('parentName') as string).trim(),
        parentPhone: (formData.get('parentPhone') as string).trim(),
        address: (formData.get('address') as string).trim(),
        status: (formData.get('status') as any) || 'aktif'
      };

      onSaveStudent(savedStudent);
      setIsFormModalOpen(false);
    };

    return (
      <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 my-8">
          <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between border-b border-slate-800">
            <h3 className="font-bold text-base flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-400" />
              {editingStudent ? 'Edit Data Siswa' : 'Tambah Peserta Didik Baru'}
            </h3>
            <button
              onClick={() => setIsFormModalOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  NISN (Nomor Induk Siswa Nasional) *
                </label>
                <input
                  type="text"
                  name="nisn"
                  defaultValue={initialData.nisn}
                  placeholder="Contoh: 0089123401"
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  NIPD / Nomor Induk Sekolah
                </label>
                <input
                  type="text"
                  name="nipd"
                  defaultValue={initialData.nipd}
                  placeholder="Contoh: 232407001"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Nama Lengkap Siswa *
              </label>
              <input
                type="text"
                name="name"
                defaultValue={initialData.name}
                placeholder="Nama lengkap peserta didik..."
                required
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Kelas / Rombel *
                </label>
                <input
                  type="text"
                  name="className"
                  defaultValue={initialData.className}
                  placeholder="VII A, VIII B, dsb."
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Jenis Kelamin
                </label>
                <select
                  name="gender"
                  defaultValue={initialData.gender}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="L">Laki-laki (L)</option>
                  <option value="P">Perempuan (P)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Status Siswa
                </label>
                <select
                  name="status"
                  defaultValue={initialData.status}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="aktif">Aktif</option>
                  <option value="mutasi">Mutasi / Pindah</option>
                  <option value="skorsing">Dalam Skorsing</option>
                  <option value="dikembalikan">Dikembalikan ke Orang Tua</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Orang Tua / Wali
                </label>
                <input
                  type="text"
                  name="parentName"
                  defaultValue={initialData.parentName}
                  placeholder="Nama ayah / ibu / wali murid"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  No. Telepon / WhatsApp Orang Tua
                </label>
                <input
                  type="text"
                  name="parentPhone"
                  defaultValue={initialData.parentPhone}
                  placeholder="08123456789"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Alamat Rumah Siswa
              </label>
              <textarea
                name="address"
                rows={2}
                defaultValue={initialData.address}
                placeholder="Alamat lengkap tempat tinggal siswa..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-sm cursor-pointer"
              >
                Simpan Data Siswa
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Student Profile & Discipline History Modal
  const renderProfileModal = () => {
    if (!viewingProfileStudent) return null;

    const student = viewingProfileStudent;
    const studentRecords = records
      .filter((r) => r.studentId === student.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const studentPoints = calculateStudentPoints(student.id, records);
    const status = getDisciplineStatus(studentPoints, settings);
    const studentCounseling = counselingLogs.filter((c) => c.studentId === student.id);

    const handleSaveNewCounseling = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newCounselingTitle.trim()) return;

      const newLog: CounselingLog = {
        id: `cns-${Date.now()}`,
        studentId: student.id,
        date: new Date().toISOString().split('T')[0],
        counselor: settings.bkCoordinatorName || 'Guru BK',
        sessionTitle: newCounselingTitle.trim(),
        notes: newCounselingNotes.trim(),
        agreement: newCounselingAgreement.trim()
      };

      onSaveCounselingLog(newLog);
      setIsAddingCounseling(false);
      setNewCounselingTitle('');
      setNewCounselingNotes('');
      setNewCounselingAgreement('');
    };

    return (
      <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl overflow-hidden animate-in fade-in my-6 max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-900/50">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/40 border border-indigo-400/30 flex items-center justify-center text-xl font-black text-indigo-200">
                {student.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">{student.name}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/30 border border-indigo-400/40 text-indigo-200">
                    {student.className}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  NISN: <span className="font-mono text-white">{student.nisn}</span> &bull; NIPD: {student.nipd || '-'} &bull; Gender: {student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Wali Murid: {student.parentName} ({student.parentPhone || 'Belum ada no hp'})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right sm:pr-4 sm:border-r border-indigo-800">
                <span className="text-xs text-slate-300 block">Akumulasi Poin:</span>
                <span className="text-2xl font-black text-rose-400">{studentPoints} Poin</span>
                <span className={`block text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${status.badgeBg}`}>
                  {status.label}
                </span>
              </div>

              <button
                onClick={() => setViewingProfileStudent(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer self-start sm:self-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Action Bar inside modal */}
          <div className="bg-slate-100 dark:bg-slate-800/80 px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setProfileTab('violations')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  profileTab === 'violations'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                Riwayat Pelanggaran ({studentRecords.length})
              </button>
              <button
                onClick={() => setProfileTab('counseling')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  profileTab === 'counseling'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Catatan Bimbingan / Konseling BK ({studentCounseling.length})
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setViewingProfileStudent(null);
                  onRecordViolationForStudent(student.id);
                }}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Catat Pelanggaran
              </button>
              <button
                onClick={() => {
                  setViewingProfileStudent(null);
                  onPrintReportForStudent(student.id);
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                Cetak Dokumen
              </button>
            </div>
          </div>

          {/* Modal Content Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            {profileTab === 'violations' ? (
              <div className="space-y-3">
                {studentRecords.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                    <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-800 dark:text-white">
                      Peserta Didik Tidak Memiliki Catatan Pelanggaran
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Siswa ini memiliki riwayat kedisiplinan yang sangat baik dan tertib.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                          <th className="py-2.5 px-3">Tanggal & Jam</th>
                          <th className="py-2.5 px-3">Pasal / Pelanggaran</th>
                          <th className="py-2.5 px-3">Kategori</th>
                          <th className="py-2.5 px-3 text-right">Poin</th>
                          <th className="py-2.5 px-3">Pelapor & Lokasi</th>
                          <th className="py-2.5 px-3">Sanksi / Pembinaan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {studentRecords.map((r) => {
                          const badge = getCategoryBadge(r.category);
                          return (
                            <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                              <td className="py-2.5 px-3 whitespace-nowrap font-medium text-slate-700 dark:text-slate-300">
                                {formatDateShort(r.date)}
                                <span className="text-[10px] text-slate-400 block">{r.time}</span>
                              </td>
                              <td className="py-2.5 px-3">
                                <span className="font-bold text-slate-900 dark:text-white">
                                  [{r.ruleCode}] {r.ruleName}
                                </span>
                                {r.notes && (
                                  <p className="text-[11px] text-slate-500 italic mt-0.5">{r.notes}</p>
                                )}
                              </td>
                              <td className="py-2.5 px-3 whitespace-nowrap">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.badge}`}>
                                  {formatCategoryName(r.category)}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-right whitespace-nowrap">
                                <span className="font-black text-rose-600 dark:text-rose-400 text-sm">
                                  +{r.points}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                                <span className="font-semibold block">{r.reporterName}</span>
                                <span className="text-[10px] text-slate-400">{r.location || '-'}</span>
                              </td>
                              <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                                {r.followUpAction || '-'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white">
                      Buku Rekam Konseling & Bimbingan (BK)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Catatan pembinaan kepribadian, hasil mediasi, dan kesepakatan komitmen siswa
                    </p>
                  </div>
                  {!isAddingCounseling && (
                    <button
                      onClick={() => setIsAddingCounseling(true)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Tambah Sesi Konseling
                    </button>
                  )}
                </div>

                {/* Form to add counseling */}
                {isAddingCounseling && (
                  <form onSubmit={handleSaveNewCounseling} className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/20 space-y-3">
                    <h5 className="font-bold text-xs text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">
                      Formulir Sesi Konseling Baru
                    </h5>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Topik / Judul Sesi Konseling *
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Konseling Pembinaan Disiplin & Perjanjian Siswa"
                        value={newCounselingTitle}
                        onChange={(e) => setNewCounselingTitle(e.target.value)}
                        required
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Catatan Pengamatan Guru BK / Kronologi Pembinaan
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Uraian respon siswa, hasil diskusi, dan faktor penyebab..."
                        value={newCounselingNotes}
                        onChange={(e) => setNewCounselingNotes(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Komitmen / Kesepakatan yang Disepakati Siswa
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Siswa berjanji tidak terlambat dan siap menjalankan sanksi edukatif"
                        value={newCounselingAgreement}
                        onChange={(e) => setNewCounselingAgreement(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingCounseling(false)}
                        className="px-3 py-1 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-200 rounded cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded cursor-pointer"
                      >
                        Simpan Catatan Konseling
                      </button>
                    </div>
                  </form>
                )}

                {/* List of existing counseling sessions */}
                {studentCounseling.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-xs text-slate-500">
                    Belum ada riwayat konseling bimbingan khusus untuk siswa ini.
                  </div>
                ) : (
                  studentCounseling.map((c) => (
                    <div
                      key={c.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 space-y-2 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-indigo-700 dark:text-indigo-300">
                          {c.sessionTitle}
                        </span>
                        <span className="text-[11px] text-slate-500">{formatDateIndo(c.date)}</span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        {c.notes}
                      </p>
                      {c.agreement && (
                        <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200">
                          <span className="font-bold">Kesepakatan / Komitmen: </span>
                          {c.agreement}
                        </div>
                      )}
                      <p className="text-[10px] text-slate-400 text-right pt-1">
                        Konselor: {c.counselor}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Action & Filter Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Data Peserta Didik & Rombongan Belajar (Kelas)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Kelola master data siswa, pantau akumulasi poin kedisiplinan, dan kontak orang tua
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Download CSV Data Siswa & Poin"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Ekspor CSV</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Siswa</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-xs">
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Cari berdasarkan Nama Siswa, NISN, atau Nama Orang Tua..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filter Kelas */}
        <div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-medium"
          >
            <option value="all">Semua Kelas ({students.length} Siswa)</option>
            {classesList.map((cls) => {
              const count = students.filter((s) => s.className === cls).length;
              return (
                <option key={cls} value={cls}>
                  Kelas {cls} ({count} Siswa)
                </option>
              );
            })}
          </select>
        </div>

        {/* Filter Status Poin */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-medium"
          >
            <option value="all">Semua Status Kedisiplinan</option>
            <option value="aman">Tertib (0 Poin)</option>
            <option value="bina">Pembinaan (1-24 Poin)</option>
            <option value="sp1">Peringatan I / SP 1 (&ge;25 Poin)</option>
            <option value="sp2">Peringatan II / SP 2 (&ge;50 Poin)</option>
            <option value="sp3">Peringatan III / Kritis (&ge;75 Poin)</option>
          </select>
        </div>
      </div>

      {/* Student List Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
          <span>Menampilkan {filteredStudents.length} dari {students.length} Siswa</span>
          {selectedClass !== 'all' && (
            <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
              Kelas: {selectedClass}
            </span>
          )}
        </div>

        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Users className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              Tidak ada data siswa yang cocok
            </p>
            <p className="text-xs text-slate-400">
              Coba sesuaikan kata kunci pencarian atau ubah filter kelas.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                  <th className="py-3 px-4 font-bold">Identitas Siswa</th>
                  <th className="py-3 px-3 font-bold">Kelas</th>
                  <th className="py-3 px-3 font-bold">Orang Tua / Kontak</th>
                  <th className="py-3 px-3 font-bold text-center">Akumulasi Poin Tatib</th>
                  <th className="py-3 px-3 font-bold">Status Disiplin</th>
                  <th className="py-3 px-4 font-bold text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700/60">
                {filteredStudents.map((student) => {
                  const points = calculateStudentPoints(student.id, records);
                  const status = getDisciplineStatus(points, settings);
                  const progressPercentage = Math.min(100, Math.round((points / settings.thresholdDrop) * 100));

                  // Clean WA number for Indonesia
                  const cleanPhone = student.parentPhone ? student.parentPhone.replace(/[^0-9]/g, '') : '';
                  const waNumber = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                    >
                      {/* Name & NISN */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center shrink-0 border border-indigo-200 dark:border-indigo-800">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block hover:text-indigo-600 cursor-pointer" onClick={() => setViewingProfileStudent(student)}>
                              {student.name}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              NISN: {student.nisn} {student.nipd ? `• NIPD: ${student.nipd}` : ''}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Class */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600">
                          {student.className}
                        </span>
                      </td>

                      {/* Parent & Contact */}
                      <td className="py-3 px-3">
                        <div className="space-y-0.5">
                          <span className="font-medium text-slate-800 dark:text-slate-200 block">
                            {student.parentName || '-'}
                          </span>
                          {student.parentPhone && (
                            <div className="flex items-center gap-2 text-[11px]">
                              <span className="text-slate-500">{student.parentPhone}</span>
                              {waNumber && (
                                <a
                                  href={`https://wa.me/${waNumber}?text=Halo%20Bapak/Ibu%20${encodeURIComponent(student.parentName)},%20kami%20dari%20pihak%20sekolah%20${encodeURIComponent(settings.schoolName)}%20mengenai%20perkembangan%20kedisiplinan%20ananda%20${encodeURIComponent(student.name)}.`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 inline-flex items-center gap-0.5 font-semibold"
                                  title="Kirim pesan WhatsApp"
                                >
                                  <Phone className="w-3 h-3" /> WA
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Points & Progress Bar */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <div className="inline-flex flex-col items-center">
                          <span className={`font-black text-sm ${points > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'}`}>
                            {points} Poin
                          </span>
                          <div className="w-20 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-1 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                points >= settings.thresholdSp3
                                  ? 'bg-red-600'
                                  : points >= settings.thresholdSp2
                                  ? 'bg-amber-500'
                                  : points >= settings.thresholdSp1
                                  ? 'bg-yellow-400'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Discipline Status */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-block ${status.badgeBg}`}>
                          {status.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewingProfileStudent(student)}
                            className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 cursor-pointer"
                            title="Buka Buku Disiplin & Riwayat Siswa"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onRecordViolationForStudent(student.id)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
                            title="Catat Pelanggaran Siswa Ini"
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onPrintReportForStudent(student.id)}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 cursor-pointer"
                            title="Cetak Surat Peringatan / Rekap"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(student)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                            title="Edit Data Siswa"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Yakin ingin menghapus data siswa ${student.name}?`)) {
                                onDeleteStudent(student.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 cursor-pointer"
                            title="Hapus Siswa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {renderStudentFormModal()}
      {renderProfileModal()}
    </div>
  );
};
