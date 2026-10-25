import {
  Student,
  ViolationRule,
  ViolationRecord,
  SchoolSettings,
  CounselingLog,
  ViolationCategoryKey
} from '../types/tatib';
import {
  INITIAL_RULES,
  INITIAL_STUDENTS,
  INITIAL_RECORDS,
  INITIAL_SETTINGS,
  INITIAL_COUNSELING
} from '../data/initialData';

const STORAGE_KEYS = {
  RULES: 'sitatib_rules_v1',
  STUDENTS: 'sitatib_students_v1',
  RECORDS: 'sitatib_records_v1',
  SETTINGS: 'sitatib_settings_v1',
  COUNSELING: 'sitatib_counseling_v1',
};

// --- DATA ACCESSORS ---

export function getStoredRules(): ViolationRule[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RULES);
    if (!data) {
      saveRules(INITIAL_RULES);
      return INITIAL_RULES;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load rules', e);
    return INITIAL_RULES;
  }
}

export function saveRules(rules: ViolationRule[]): void {
  localStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(rules));
}

export function getStoredStudents(): Student[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (!data) {
      saveStudents(INITIAL_STUDENTS);
      return INITIAL_STUDENTS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load students', e);
    return INITIAL_STUDENTS;
  }
}

export function saveStudents(students: Student[]): void {
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
}

export function getStoredRecords(): ViolationRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RECORDS);
    if (!data) {
      saveRecords(INITIAL_RECORDS);
      return INITIAL_RECORDS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load records', e);
    return INITIAL_RECORDS;
  }
}

export function saveRecords(records: ViolationRecord[]): void {
  localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
}

export function getStoredSettings(): SchoolSettings {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!data) {
      saveSettings(INITIAL_SETTINGS);
      return INITIAL_SETTINGS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load settings', e);
    return INITIAL_SETTINGS;
  }
}

export function saveSettings(settings: SchoolSettings): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export function getStoredCounseling(): CounselingLog[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.COUNSELING);
    if (!data) {
      saveCounseling(INITIAL_COUNSELING);
      return INITIAL_COUNSELING;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load counseling', e);
    return INITIAL_COUNSELING;
  }
}

export function saveCounseling(logs: CounselingLog[]): void {
  localStorage.setItem(STORAGE_KEYS.COUNSELING, JSON.stringify(logs));
}

// --- HELPER CALCULATIONS ---

export function calculateStudentPoints(studentId: string, records: ViolationRecord[]): number {
  return records
    .filter(r => r.studentId === studentId)
    .reduce((sum, r) => sum + (Number(r.points) || 0), 0);
}

export interface DisciplineStatusInfo {
  label: string;
  colorClass: string;
  badgeBg: string;
  borderClass: string;
  level: 'aman' | 'sp1' | 'sp2' | 'sp3' | 'kritis';
  actionNote: string;
}

export function getDisciplineStatus(points: number, settings: SchoolSettings): DisciplineStatusInfo {
  if (points >= settings.thresholdDrop) {
    return {
      label: 'Sangat Kritis (DO / Dikembalikan)',
      colorClass: 'text-red-700 dark:text-red-300',
      badgeBg: 'bg-red-600 text-white',
      borderClass: 'border-red-600',
      level: 'kritis',
      actionNote: 'Konferensi kasus dewan guru & pengembalian ke orang tua'
    };
  }
  if (points >= settings.thresholdSp3) {
    return {
      label: 'Peringatan III (SP 3)',
      colorClass: 'text-rose-700 dark:text-rose-400',
      badgeBg: 'bg-rose-500 text-white',
      borderClass: 'border-rose-400',
      level: 'sp3',
      actionNote: 'Penerbitan SP 3, Skorsing & Perjanjian Bermaterai'
    };
  }
  if (points >= settings.thresholdSp2) {
    return {
      label: 'Peringatan II (SP 2)',
      colorClass: 'text-amber-700 dark:text-amber-300',
      badgeBg: 'bg-amber-500 text-white',
      borderClass: 'border-amber-400',
      level: 'sp2',
      actionNote: 'Penerbitan SP 2 & Panggilan Orang Tua II'
    };
  }
  if (points >= settings.thresholdSp1) {
    return {
      label: 'Peringatan I (SP 1)',
      colorClass: 'text-yellow-800 dark:text-yellow-200',
      badgeBg: 'bg-yellow-400 text-slate-900',
      borderClass: 'border-yellow-400',
      level: 'sp1',
      actionNote: 'Penerbitan SP 1 & Pembinaan Wali Kelas / BK'
    };
  }
  if (points > 0) {
    return {
      label: 'Pembinaan Awal',
      colorClass: 'text-blue-700 dark:text-blue-300',
      badgeBg: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200',
      borderClass: 'border-blue-300',
      level: 'aman',
      actionNote: 'Teguran lisan & pencatatan rekam jejak'
    };
  }
  return {
    label: 'Tertib & Disiplin',
    colorClass: 'text-emerald-700 dark:text-emerald-300',
    badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200',
    borderClass: 'border-emerald-300',
    level: 'aman',
    actionNote: 'Mempertahankan kedisiplinan dan teladan'
  };
}

export function formatCategoryName(category: ViolationCategoryKey): string {
  switch (category) {
    case 'ringan':
      return 'Ringan';
    case 'sedang':
      return 'Sedang';
    case 'berat':
      return 'Berat';
    case 'sangat_berat':
      return 'Sangat Berat';
    default:
      return category;
  }
}

export function getCategoryBadge(category: ViolationCategoryKey) {
  switch (category) {
    case 'ringan':
      return {
        label: 'Ringan (2-10 P)',
        badge: 'bg-sky-100 text-sky-800 border-sky-300',
        dot: 'bg-sky-500'
      };
    case 'sedang':
      return {
        label: 'Sedang (15-35 P)',
        badge: 'bg-amber-100 text-amber-900 border-amber-300',
        dot: 'bg-amber-500'
      };
    case 'berat':
      return {
        label: 'Berat (40-75 P)',
        badge: 'bg-rose-100 text-rose-900 border-rose-300',
        dot: 'bg-rose-500'
      };
    case 'sangat_berat':
      return {
        label: 'Sangat Berat (80-100 P)',
        badge: 'bg-red-700 text-white border-red-800',
        dot: 'bg-red-300'
      };
    default:
      return {
        label: category,
        badge: 'bg-slate-100 text-slate-800 border-slate-300',
        dot: 'bg-slate-500'
      };
  }
}

export function formatDateIndo(dateStr: string): string {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

export function formatDateShort(dateStr: string): string {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

// Reset everything to defaults
export function resetAllDataToDefault(): void {
  saveRules(INITIAL_RULES);
  saveStudents(INITIAL_STUDENTS);
  saveRecords(INITIAL_RECORDS);
  saveSettings(INITIAL_SETTINGS);
  saveCounseling(INITIAL_COUNSELING);
}

// Export all as JSON backup file
export function exportAllDataAsJson(): string {
  const payload = {
    appName: 'SiTatib',
    exportDate: new Date().toISOString(),
    rules: getStoredRules(),
    students: getStoredStudents(),
    records: getStoredRecords(),
    settings: getStoredSettings(),
    counseling: getStoredCounseling(),
  };
  return JSON.stringify(payload, null, 2);
}

// Import JSON file
export function importAllDataFromJson(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.rules && Array.isArray(data.rules)) saveRules(data.rules);
    if (data.students && Array.isArray(data.students)) saveStudents(data.students);
    if (data.records && Array.isArray(data.records)) saveRecords(data.records);
    if (data.settings && typeof data.settings === 'object') saveSettings(data.settings);
    if (data.counseling && Array.isArray(data.counseling)) saveCounseling(data.counseling);
    return true;
  } catch (e) {
    console.error('Import failed', e);
    return false;
  }
}
