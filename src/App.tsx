import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { BerandaView } from './components/BerandaView';
import { SiswaView } from './components/SiswaView';
import { TatibView } from './components/TatibView';
import { LaporanCetakView } from './components/LaporanCetakView';
import { SetingView } from './components/SetingView';
import { ModalCatatPelanggaran } from './components/ModalCatatPelanggaran';
import { ModalPanduan } from './components/ModalPanduan';
import {
  Student,
  ViolationRecord,
  ViolationRule,
  SchoolSettings,
  CounselingLog
} from './types/tatib';
import {
  getStoredStudents,
  saveStudents,
  getStoredRecords,
  saveRecords,
  getStoredRules,
  saveRules,
  getStoredSettings,
  saveSettings,
  getStoredCounseling,
  saveCounseling,
  calculateStudentPoints
} from './utils/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('beranda');
  const [students, setStudents] = useState<Student[]>([]);
  const [records, setRecords] = useState<ViolationRecord[]>([]);
  const [rules, setRules] = useState<ViolationRule[]>([]);
  const [settings, setSettings] = useState<SchoolSettings>(getStoredSettings());
  const [counselingLogs, setCounselingLogs] = useState<CounselingLog[]>([]);

  // Modal quick record state
  const [isQuickRecordOpen, setIsQuickRecordOpen] = useState<boolean>(false);
  const [quickRecordStudentId, setQuickRecordStudentId] = useState<string | undefined>(undefined);

  // Guide modal state
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // Selected student when navigating to Laporan
  const [reportStudentId, setReportStudentId] = useState<string | undefined>(undefined);

  // Initialize data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    setStudents(getStoredStudents());
    setRecords(getStoredRecords());
    setRules(getStoredRules());
    setSettings(getStoredSettings());
    setCounselingLogs(getStoredCounseling());
  };

  // Student operations
  const handleSaveStudent = (savedStudent: Student) => {
    const existingIndex = students.findIndex((s) => s.id === savedStudent.id);
    let updated: Student[];
    if (existingIndex >= 0) {
      updated = [...students];
      updated[existingIndex] = savedStudent;
    } else {
      updated = [savedStudent, ...students];
    }
    setStudents(updated);
    saveStudents(updated);
  };

  const handleDeleteStudent = (studentId: string) => {
    const updatedStudents = students.filter((s) => s.id !== studentId);
    setStudents(updatedStudents);
    saveStudents(updatedStudents);

    // Also remove associated records
    const updatedRecords = records.filter((r) => r.studentId !== studentId);
    setRecords(updatedRecords);
    saveRecords(updatedRecords);
  };

  // Record operations
  const handleSaveRecord = (newRecord: ViolationRecord) => {
    const updated = [newRecord, ...records];
    setRecords(updated);
    saveRecords(updated);
  };

  const handleUpdateRecord = (updatedRecord: ViolationRecord) => {
    const updated = records.map((r) => (r.id === updatedRecord.id ? updatedRecord : r));
    setRecords(updated);
    saveRecords(updated);
  };

  const handleDeleteRecord = (recordId: string) => {
    const updated = records.filter((r) => r.id !== recordId);
    setRecords(updated);
    saveRecords(updated);
  };

  // Rule operations
  const handleSaveRule = (savedRule: ViolationRule) => {
    const existingIndex = rules.findIndex((r) => r.id === savedRule.id);
    let updated: ViolationRule[];
    if (existingIndex >= 0) {
      updated = [...rules];
      updated[existingIndex] = savedRule;
    } else {
      updated = [...rules, savedRule];
    }
    setRules(updated);
    saveRules(updated);
  };

  const handleDeleteRule = (ruleId: string) => {
    const updated = rules.filter((r) => r.id !== ruleId);
    setRules(updated);
    saveRules(updated);
  };

  // Counseling logs
  const handleSaveCounselingLog = (newLog: CounselingLog) => {
    const updated = [newLog, ...counselingLogs];
    setCounselingLogs(updated);
    saveCounseling(updated);
  };

  // Settings
  const handleSaveSettings = (newSettings: SchoolSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // Quick action triggers
  const handleOpenQuickRecordWithStudent = (studentId?: string) => {
    setQuickRecordStudentId(studentId);
    setIsQuickRecordOpen(true);
  };

  const handleGoToReportForStudent = (studentId: string) => {
    setReportStudentId(studentId);
    setActiveTab('laporan');
  };

  // Count students requiring SP
  const pendingSpCount = students.filter((s) => {
    const points = calculateStudentPoints(s.id, records);
    return points >= settings.thresholdSp1;
  }).length;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={settings}
        onOpenQuickRecord={() => handleOpenQuickRecordWithStudent(undefined)}
        onOpenGuide={() => setIsGuideOpen(true)}
        pendingSpCount={pendingSpCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'beranda' && (
          <BerandaView
            students={students}
            records={records}
            rules={rules}
            settings={settings}
            onOpenQuickRecord={() => handleOpenQuickRecordWithStudent(undefined)}
            onSelectStudentForReport={handleGoToReportForStudent}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'siswa' && (
          <SiswaView
            students={students}
            records={records}
            settings={settings}
            counselingLogs={counselingLogs}
            onSaveStudent={handleSaveStudent}
            onDeleteStudent={handleDeleteStudent}
            onRecordViolationForStudent={handleOpenQuickRecordWithStudent}
            onPrintReportForStudent={handleGoToReportForStudent}
            onSaveCounselingLog={handleSaveCounselingLog}
          />
        )}

        {activeTab === 'tatib' && (
          <TatibView
            rules={rules}
            records={records}
            settings={settings}
            onSaveRule={handleSaveRule}
            onDeleteRule={handleDeleteRule}
            onUpdateRecord={handleUpdateRecord}
            onDeleteRecord={handleDeleteRecord}
            onOpenQuickRecord={() => handleOpenQuickRecordWithStudent(undefined)}
          />
        )}

        {activeTab === 'laporan' && (
          <LaporanCetakView
            students={students}
            records={records}
            settings={settings}
            counselingLogs={counselingLogs}
            initialStudentId={reportStudentId}
          />
        )}

        {activeTab === 'seting' && (
          <SetingView
            settings={settings}
            onSaveSettings={handleSaveSettings}
            students={students}
            records={records}
            rules={rules}
            onReloadAllData={loadAllData}
          />
        )}
      </main>

      {/* Footer (Hidden during print) */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-4 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            {settings.schoolName} &bull; Sistem Buku Tata Tertib & Kedisiplinan Peserta Didik (SiTatib)
          </span>
          <span className="text-[11px] font-medium text-slate-400">
            Terintegrasi Google Sheets &bull; Versi 2026.1
          </span>
        </div>
      </footer>

      {/* Floating Quick Record Modal */}
      <ModalCatatPelanggaran
        isOpen={isQuickRecordOpen}
        onClose={() => {
          setIsQuickRecordOpen(false);
          setQuickRecordStudentId(undefined);
        }}
        students={students}
        rules={rules}
        records={records}
        settings={settings}
        onSaveRecord={handleSaveRecord}
        preSelectedStudentId={quickRecordStudentId}
      />

      {/* Guide Modal */}
      <ModalPanduan
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
