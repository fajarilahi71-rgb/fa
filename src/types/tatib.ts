export type ViolationCategoryKey = 'ringan' | 'sedang' | 'berat' | 'sangat_berat';

export interface ViolationRule {
  id: string;
  code: string;
  category: ViolationCategoryKey;
  subCategory: string;
  name: string;
  points: number;
  sanction: string;
}

export interface Student {
  id: string;
  nisn: string;
  nipd: string;
  name: string;
  gender: 'L' | 'P';
  className: string;
  parentName: string;
  parentPhone: string;
  address: string;
  status: 'aktif' | 'mutasi' | 'skorsing' | 'dikembalikan';
}

export interface ViolationRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  ruleId: string;
  ruleCode: string;
  ruleName: string;
  category: ViolationCategoryKey;
  points: number;
  date: string;
  time: string;
  location: string;
  reporterName: string;
  notes: string;
  followUpAction: string;
  isResolved?: boolean;
}

export interface CounselingLog {
  id: string;
  studentId: string;
  date: string;
  counselor: string;
  sessionTitle: string;
  notes: string;
  agreement: string;
}

export interface SchoolSettings {
  schoolName: string;
  educationDepartment: string;
  npsn: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  city: string;
  headmasterName: string;
  headmasterNip: string;
  bkCoordinatorName: string;
  bkCoordinatorNip: string;
  tatibCoordinatorName: string;
  tatibCoordinatorNip: string;
  thresholdSp1: number;
  thresholdSp2: number;
  thresholdSp3: number;
  thresholdDrop: number;
  googleSheetId: string;
  googleSheetName: string;
  lastSyncTime: string | null;
}
