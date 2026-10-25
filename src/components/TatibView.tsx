import React, { useState } from 'react';
import {
  ShieldAlert,
  BookOpen,
  ListFilter,
  Plus,
  Download,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Edit2,
  Trash2,
  X,
  FileCheck,
  Scale
} from 'lucide-react';
import {
  ViolationRule,
  ViolationRecord,
  ViolationCategoryKey,
  SchoolSettings
} from '../types/tatib';
import {
  formatCategoryName,
  getCategoryBadge,
  formatDateIndo,
  formatDateShort
} from '../utils/storage';
import {
  exportRulesToCsv,
  exportRecordsToCsv,
  triggerDownload
} from '../utils/googleSheets';

interface TatibViewProps {
  rules: ViolationRule[];
  records: ViolationRecord[];
  settings: SchoolSettings;
  onSaveRule: (rule: ViolationRule) => void;
  onDeleteRule: (ruleId: string) => void;
  onUpdateRecord: (record: ViolationRecord) => void;
  onDeleteRecord: (recordId: string) => void;
  onOpenQuickRecord: () => void;
}

export const TatibView: React.FC<TatibViewProps> = ({
  rules,
  records,
  settings,
  onSaveRule,
  onDeleteRule,
  onUpdateRecord,
  onDeleteRecord,
  onOpenQuickRecord
}) => {
  const [subTab, setSubTab] = useState<'katalog' | 'jurnal'>('katalog');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Jurnal filter state
  const [jurnalClassFilter, setJurnalClassFilter] = useState<string>('all');
  const [jurnalCategoryFilter, setJurnalCategoryFilter] = useState<string>('all');
  const [jurnalSearchQuery, setJurnalSearchQuery] = useState<string>('');

  // Rule Form Modal state
  const [isRuleModalOpen, setIsRuleModalOpen] = useState<boolean>(false);
  const [editingRule, setEditingRule] = useState<ViolationRule | null>(null);

  // Category summary metadata
  const categoryMeta: Record<
    ViolationCategoryKey,
    { title: string; range: string; desc: string; standardSanction: string; color: string }
  > = {
    ringan: {
      title: 'Pelanggaran Ringan',
      range: '2 - 10 Poin',
      desc: 'Pelanggaran terhadap disiplin waktu, kelengkapan seragam/atribut, kerapian diri, dan ketertiban belajar di kelas.',
      standardSanction: 'Teguran lisan, pencatatan di buku piket, tugas kebersihan lingkungan, atau hafalan materi.',
      color: 'sky'
    },
    sedang: {
      title: 'Pelanggaran Sedang',
      range: '15 - 35 Poin',
      desc: 'Pelanggaran terhadap komitmen kehadiran (membolos), etika kesopanan terhadap guru, perundungan verbal, dan perusakan sarana.',
      standardSanction: 'Pemanggilan orang tua tahap awal, bimbingan konseling intensif BK, surat pernyataan tertulis, dan sanksi edukatif.',
      color: 'amber'
    },
    berat: {
      title: 'Pelanggaran Berat',
      range: '40 - 75 Poin',
      desc: 'Pelanggaran norma moral, rokok/vape di sekolah, perkelahian fisik, pemalakan, pencurian, dan membawa senjata tajam.',
      standardSanction: 'Penerbitan Surat Peringatan (SP 1 / SP 2), pemanggilan darurat orang tua ke sekolah, dan skorsing 3 - 5 hari.',
      color: 'rose'
    },
    sangat_berat: {
      title: 'Pelanggaran Sangat Berat',
      range: '80 - 100 Poin',
      desc: 'Pelanggaran hukum pidana, miras, narkoba, kekerasan seksual massal, provokasi tawuran antar sekolah, atau pernikahan dini.',
      standardSanction: 'Penerbitan SP 3, skorsing hingga keputusan rapat dewan guru / Dikembalikan kepada Orang Tua (Dikeluarkan).',
      color: 'red'
    }
  };

  // Filter Rules
  const filteredRules = rules.filter((r) => {
    const matchesCat = selectedCategory === 'all' || r.category === selectedCategory;
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.subCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.sanction.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Unique classes in records
  const recordClasses = Array.from(new Set(records.map((r) => r.studentClass))).sort();

  // Filter Records
  const filteredRecords = records
    .filter((r) => {
      const matchesClass = jurnalClassFilter === 'all' || r.studentClass === jurnalClassFilter;
      const matchesCat = jurnalCategoryFilter === 'all' || r.category === jurnalCategoryFilter;
      const matchesSearch =
        r.studentName.toLowerCase().includes(jurnalSearchQuery.toLowerCase()) ||
        r.ruleName.toLowerCase().includes(jurnalSearchQuery.toLowerCase()) ||
        r.reporterName.toLowerCase().includes(jurnalSearchQuery.toLowerCase()) ||
        r.notes.toLowerCase().includes(jurnalSearchQuery.toLowerCase());
      return matchesClass && matchesCat && matchesSearch;
    })
    .sort((a, b) => new Date(`${b.date}T${b.time || '00:00'}`).getTime() - new Date(`${a.date}T${a.time || '00:00'}`).getTime());

  const handleOpenAddRule = () => {
    setEditingRule(null);
    setIsRuleModalOpen(true);
  };

  const handleOpenEditRule = (rule: ViolationRule) => {
    setEditingRule(rule);
    setIsRuleModalOpen(true);
  };

  const handleExportRules = () => {
    const csv = exportRulesToCsv(rules);
    triggerDownload(csv, `Katalog_Tata_Tertib_Sekolah_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportRecords = () => {
    const csv = exportRecordsToCsv(records);
    triggerDownload(csv, `Jurnal_Pelanggaran_Siswa_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleToggleResolveRecord = (record: ViolationRecord) => {
    onUpdateRecord({
      ...record,
      isResolved: !record.isResolved
    });
  };

  // Rule Form Modal
  const renderRuleModal = () => {
    if (!isRuleModalOpen) return null;

    const initialData: Partial<ViolationRule> = editingRule || {
      code: '',
      category: 'ringan',
      subCategory: 'Umum',
      name: '',
      points: 5,
      sanction: 'Teguran lisan dan pembinaan'
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget;
      const formData = new FormData(form);

      const savedRule: ViolationRule = {
        id: editingRule ? editingRule.id : `rule-${Date.now()}`,
        code: (formData.get('code') as string).trim().toUpperCase(),
        category: formData.get('category') as ViolationCategoryKey,
        subCategory: (formData.get('subCategory') as string).trim(),
        name: (formData.get('name') as string).trim(),
        points: Number(formData.get('points')) || 5,
        sanction: (formData.get('sanction') as string).trim()
      };

      onSaveRule(savedRule);
      setIsRuleModalOpen(false);
    };

    return (
      <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 my-8">
          <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between border-b border-slate-800">
            <h3 className="font-bold text-base flex items-center gap-2">
              <Scale className="w-5 h-5 text-indigo-400" />
              {editingRule ? 'Edit Butir Tata Tertib' : 'Tambah Aturan Tata Tertib Baru'}
            </h3>
            <button
              onClick={() => setIsRuleModalOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Kode Pasal *
                </label>
                <input
                  type="text"
                  name="code"
                  defaultValue={initialData.code}
                  placeholder="Contoh: R-11 / S-10 / B-09"
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white uppercase font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Kategori Pelanggaran *
                </label>
                <select
                  name="category"
                  defaultValue={initialData.category}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="ringan">Ringan (2 - 10 Poin)</option>
                  <option value="sedang">Sedang (15 - 35 Poin)</option>
                  <option value="berat">Berat (40 - 75 Poin)</option>
                  <option value="sangat_berat">Sangat Berat (80 - 100 Poin)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Sub-Kategori / Bidang
                </label>
                <input
                  type="text"
                  name="subCategory"
                  defaultValue={initialData.subCategory}
                  placeholder="Kerapian, Kehadiran, Etika, dsb."
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Bobot Poin *
                </label>
                <input
                  type="number"
                  name="points"
                  min={1}
                  max={100}
                  defaultValue={initialData.points}
                  required
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Deskripsi Pelanggaran Tata Tertib *
              </label>
              <textarea
                name="name"
                rows={2}
                defaultValue={initialData.name}
                placeholder="Tuliskan uraian jelas jenis pelanggaran..."
                required
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Sanksi Edukatif & Bentuk Pembinaan *
              </label>
              <textarea
                name="sanction"
                rows={2}
                defaultValue={initialData.sanction}
                placeholder="Tuliskan sanksi atau tindakan pembinaan yang dianjurkan..."
                required
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsRuleModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-sm cursor-pointer"
              >
                Simpan Aturan
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            Pedoman Tata Tertib & Jurnal Pelanggaran Siswa
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Daftar lengkap 4 tingkatan pelanggaran (Ringan, Sedang, Berat, Sangat Berat) dan rekam kejadian pelanggaran harian
          </p>
        </div>

        {/* Tab switch between Katalog & Jurnal */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded-xl flex items-center border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setSubTab('katalog')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                subTab === 'katalog'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Pedoman Tata Tertib ({rules.length})
            </button>
            <button
              onClick={() => setSubTab('jurnal')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                subTab === 'jurnal'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              Jurnal Pelanggaran ({records.length})
            </button>
          </div>
        </div>
      </div>

      {subTab === 'katalog' ? (
        /* ================= SUBTAB 1: PEDOMAN & KATALOG TATA TERTIB ================= */
        <div className="space-y-6">
          {/* Action and Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-xs">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                Semua ({rules.length})
              </button>
              <button
                onClick={() => setSelectedCategory('ringan')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === 'ringan'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-sky-50 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                }`}
              >
                1. Ringan (2-10 P)
              </button>
              <button
                onClick={() => setSelectedCategory('sedang')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === 'sedang'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                }`}
              >
                2. Sedang (15-35 P)
              </button>
              <button
                onClick={() => setSelectedCategory('berat')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === 'berat'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                }`}
              >
                3. Berat (40-75 P)
              </button>
              <button
                onClick={() => setSelectedCategory('sangat_berat')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === 'sangat_berat'
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200 border border-red-300 dark:border-red-800'
                }`}
              >
                4. Sangat Berat (80-100 P)
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari butir aturan tatib..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 w-full sm:w-48"
                />
              </div>
              <button
                onClick={handleExportRules}
                className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                title="Ekspor Pedoman Tatib ke CSV"
              >
                <Download className="w-4 h-4 text-emerald-600" />
              </button>
              <button
                onClick={handleOpenAddRule}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Aturan</span>
              </button>
            </div>
          </div>

          {/* Category Banner Explanation if specific category selected */}
          {selectedCategory !== 'all' && (
            <div
              className={`p-5 rounded-2xl border ${
                selectedCategory === 'ringan'
                  ? 'bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-800 text-sky-950 dark:text-sky-100'
                  : selectedCategory === 'sedang'
                  ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-100'
                  : selectedCategory === 'berat'
                  ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-100'
                  : 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-950 dark:text-red-100'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-extrabold text-base">
                    {categoryMeta[selectedCategory as ViolationCategoryKey].title} ({categoryMeta[selectedCategory as ViolationCategoryKey].range})
                  </h3>
                  <p className="text-xs opacity-90 mt-1 max-w-2xl">
                    {categoryMeta[selectedCategory as ViolationCategoryKey].desc}
                  </p>
                </div>
                <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/70 dark:bg-black/30 border border-black/10 shrink-0">
                  <span className="font-bold">Sanksi Standar: </span>
                  {categoryMeta[selectedCategory as ViolationCategoryKey].standardSanction}
                </div>
              </div>
            </div>
          )}

          {/* Rules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRules.map((rule) => {
              const badge = getCategoryBadge(rule.category);
              return (
                <div
                  key={rule.id}
                  className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-xs hover:border-slate-300 dark:hover:border-slate-600 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600">
                          {rule.code}
                        </span>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {rule.subCategory}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${badge.badge}`}>
                          {formatCategoryName(rule.category)}
                        </span>
                        <span className="font-black text-rose-600 dark:text-rose-400 text-sm">
                          +{rule.points} P
                        </span>
                      </div>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                      {rule.name}
                    </h4>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                      <span className="font-bold text-indigo-700 dark:text-indigo-400 block text-[11px] uppercase tracking-wider">
                        Sanksi Edukatif & Pembinaan:
                      </span>
                      <p className="italic leading-relaxed">{rule.sanction}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs">
                    <button
                      onClick={onOpenQuickRecord}
                      className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Catat Kasus Ini
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditRule(rule)}
                        className="p-1.5 rounded text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                        title="Edit Aturan Ini"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Hapus aturan ${rule.code}: ${rule.name}?`)) {
                            onDeleteRule(rule.id);
                          }
                        }}
                        className="p-1.5 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 cursor-pointer"
                        title="Hapus Aturan Ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ================= SUBTAB 2: JURNAL & LOG PELANGGARAN SISWA ================= */
        <div className="space-y-4">
          {/* Filters for Jurnal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-xs">
            <div className="relative md:col-span-2">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama siswa, nama pelanggaran, atau nama guru pelapor..."
                value={jurnalSearchQuery}
                onChange={(e) => setJurnalSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <select
                value={jurnalClassFilter}
                onChange={(e) => setJurnalClassFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-medium"
              >
                <option value="all">Semua Kelas</option>
                {recordClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    Kelas {cls}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={jurnalCategoryFilter}
                onChange={(e) => setJurnalCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-medium"
              >
                <option value="all">Semua Tingkat Pelanggaran</option>
                <option value="ringan">Ringan (2-10 P)</option>
                <option value="sedang">Sedang (15-35 P)</option>
                <option value="berat">Berat (40-75 P)</option>
                <option value="sangat_berat">Sangat Berat (80-100 P)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Total {filteredRecords.length} kejadian pelanggaran ditemukan
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportRecords}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                Ekspor Jurnal CSV
              </button>
              <button
                onClick={onOpenQuickRecord}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Catat Pelanggaran Baru
              </button>
            </div>
          </div>

          {/* Jurnal Table */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-xs overflow-hidden">
            {filteredRecords.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <FileCheck className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-semibold">Tidak ada jurnal pelanggaran yang cocok</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                      <th className="py-3 px-3 font-bold">Waktu & Tempat</th>
                      <th className="py-3 px-3 font-bold">Peserta Didik</th>
                      <th className="py-3 px-3 font-bold">Pasal Pelanggaran</th>
                      <th className="py-3 px-2 font-bold text-center">Poin</th>
                      <th className="py-3 px-3 font-bold">Pelapor</th>
                      <th className="py-3 px-3 font-bold">Sanksi / Tindak Lanjut</th>
                      <th className="py-3 px-3 font-bold text-center">Status Pembinaan</th>
                      <th className="py-3 px-3 font-bold text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700/60">
                    {filteredRecords.map((r) => {
                      const badge = getCategoryBadge(r.category);
                      return (
                        <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                          {/* Time & Place */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                              {formatDateShort(r.date)}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {r.time ? `${r.time} • ` : ''}{r.location || 'Sekolah'}
                            </span>
                          </td>

                          {/* Student */}
                          <td className="py-3 px-3">
                            <span className="font-bold text-slate-900 dark:text-white block">
                              {r.studentName}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold inline-block mt-0.5">
                              {r.studentClass}
                            </span>
                          </td>

                          {/* Rule & notes */}
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-slate-700 dark:text-slate-300 text-[11px]">
                                [{r.ruleCode}]
                              </span>
                              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold border ${badge.badge}`}>
                                {formatCategoryName(r.category)}
                              </span>
                            </div>
                            <span className="text-slate-800 dark:text-slate-200 font-medium block mt-0.5">
                              {r.ruleName}
                            </span>
                            {r.notes && (
                              <p className="text-[11px] text-slate-500 italic mt-0.5 line-clamp-1">
                                {r.notes}
                              </p>
                            )}
                          </td>

                          {/* Points */}
                          <td className="py-3 px-2 text-center whitespace-nowrap">
                            <span className="font-black text-rose-600 dark:text-rose-400 text-sm">
                              +{r.points}
                            </span>
                          </td>

                          {/* Reporter */}
                          <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                            {r.reporterName || '-'}
                          </td>

                          {/* Action taken */}
                          <td className="py-3 px-3 text-slate-700 dark:text-slate-300 max-w-xs">
                            <span className="line-clamp-2">{r.followUpAction || '-'}</span>
                          </td>

                          {/* Status */}
                          <td className="py-3 px-3 text-center whitespace-nowrap">
                            <button
                              onClick={() => handleToggleResolveRecord(r)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer transition-all ${
                                r.isResolved
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-200'
                                  : 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 hover:bg-amber-200'
                              }`}
                              title="Klik untuk mengubah status penyelesaian sanksi"
                            >
                              {r.isResolved ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Selesai
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3 h-3 text-amber-600" /> Dalam Proses
                                </>
                              )}
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-3 text-right whitespace-nowrap">
                            <button
                              onClick={() => {
                                if (window.confirm(`Yakin ingin membatalkan dan menghapus catatan pelanggaran ini?`)) {
                                  onDeleteRecord(r.id);
                                }
                              }}
                              className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 cursor-pointer"
                              title="Hapus Catatan Pelanggaran"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Tambah/Edit Aturan Tatib */}
      {renderRuleModal()}
    </div>
  );
};
