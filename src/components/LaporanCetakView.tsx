import React, { useState } from 'react';
import {
  Printer,
  FileText,
  User,
  Calendar,
  AlertTriangle,
  Building,
  CheckCircle,
  Clock,
  MapPin,
  ChevronRight,
  ShieldCheck,
  FileCheck
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
  formatCategoryName
} from '../utils/storage';

interface LaporanCetakViewProps {
  students: Student[];
  records: ViolationRecord[];
  settings: SchoolSettings;
  counselingLogs: CounselingLog[];
  initialStudentId?: string;
}

export type DocumentType =
  | 'kartu_tatib'
  | 'surat_peringatan'
  | 'surat_panggilan'
  | 'surat_perjanjian'
  | 'rekap_kelas';

export const LaporanCetakView: React.FC<LaporanCetakViewProps> = ({
  students,
  records,
  settings,
  counselingLogs,
  initialStudentId
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialStudentId || (students[0]?.id || '')
  );
  const [documentType, setDocumentType] = useState<DocumentType>('kartu_tatib');

  // Customization fields for printable documents
  const todayStr = new Date().toISOString().split('T')[0];
  const [docNumber, setDocNumber] = useState<string>('421.3 / 142 / TATIB / X / 2026');
  const [letterDate, setLetterDate] = useState<string>(todayStr);
  const [spLevel, setSpLevel] = useState<'SP 1' | 'SP 2' | 'SP 3'>('SP 1');

  // Fields for Surat Panggilan Orang Tua
  const [meetingDate, setMeetingDate] = useState<string>(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [meetingTime, setMeetingTime] = useState<string>('08:30 WIB');
  const [meetingPlace, setMeetingPlace] = useState<string>('Ruang Bimbingan Konseling (BK)');

  // Selected student details
  const selectedStudent = students.find((s) => s.id === selectedStudentId) || students[0];
  const studentRecords = selectedStudent
    ? records
        .filter((r) => r.studentId === selectedStudent.id)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    : [];
  const studentPoints = selectedStudent ? calculateStudentPoints(selectedStudent.id, records) : 0;
  const studentStatus = getDisciplineStatus(studentPoints, settings);
  const studentCounseling = selectedStudent
    ? counselingLogs.filter((c) => c.studentId === selectedStudent.id)
    : [];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Controls Box (Hidden during print) */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-xs no-print space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Printer className="w-5 h-5 text-indigo-600" />
              Laporan Cetak & Berkas Resmi Siswa
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Cetak Buku Rekam Disiplin, Surat Peringatan (SP 1/2/3), Surat Panggilan Orang Tua, dan Surat Perjanjian
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Simpan PDF (A4)</span>
          </button>
        </div>

        {/* Selection Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
          {/* Pilih Siswa */}
          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Pilih Peserta Didik
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold"
            >
              {students.map((s) => {
                const pts = calculateStudentPoints(s.id, records);
                return (
                  <option key={s.id} value={s.id}>
                    {s.className} — {s.name} ({pts} Poin • NISN: {s.nisn})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Format Dokumen */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Format Dokumen Resmi
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value as DocumentType)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
            >
              <option value="kartu_tatib">1. Buku Rekam Kedisiplinan Siswa</option>
              <option value="surat_peringatan">2. Surat Peringatan (SP 1 / 2 / 3)</option>
              <option value="surat_panggilan">3. Surat Panggilan Orang Tua</option>
              <option value="surat_perjanjian">4. Surat Pernyataan Bermaterai</option>
            </select>
          </div>

          {/* Additional Options */}
          <div>
            {documentType === 'surat_peringatan' ? (
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Tingkat Surat Peringatan
                </label>
                <select
                  value={spLevel}
                  onChange={(e) => setSpLevel(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-rose-600"
                >
                  <option value="SP 1">Surat Peringatan I (SP 1)</option>
                  <option value="SP 2">Surat Peringatan II (SP 2)</option>
                  <option value="SP 3">Surat Peringatan III (SP 3)</option>
                </select>
              </div>
            ) : documentType === 'surat_panggilan' ? (
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Jadwal Menghadap
                </label>
                <input
                  type="date"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
            ) : (
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Nomor Dokumen / Berkas
                </label>
                <input
                  type="text"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= OFFICIAL PRINT PREVIEW (A4 PAPER SIMULATION) ================= */}
      <div className="bg-slate-200 dark:bg-slate-950/80 p-2 sm:p-6 rounded-2xl flex justify-center">
        <div
          id="print-area"
          className="print-container bg-white text-black p-8 sm:p-12 shadow-2xl rounded-sm max-w-[210mm] w-full min-h-[297mm] text-left font-serif leading-relaxed"
          style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}
        >
          {/* 1. KOP SURAT RESMI SEKOLAH */}
          <div className="border-b-[3px] border-black pb-3 mb-1 text-center relative">
            <h4 className="text-[12pt] uppercase tracking-wider font-normal">
              {settings.educationDepartment}
            </h4>
            <h2 className="text-[16pt] sm:text-[18pt] font-black uppercase tracking-tight text-black mt-0.5">
              {settings.schoolName}
            </h2>
            <p className="text-[10pt] font-sans text-slate-800 mt-1">
              NPSN: {settings.npsn} &bull; Alamat: {settings.address}
            </p>
            <p className="text-[9.5pt] font-sans text-slate-800">
              Telp: {settings.phone} &bull; Email: {settings.email} &bull; Website: {settings.website}
            </p>
          </div>
          {/* Garis Ganda Kop Surat */}
          <div className="border-b-[1px] border-black mb-6"></div>

          {/* DOKUMEN TYPE 1: KARTU REKAM KEDISIPLINAN SISWA */}
          {documentType === 'kartu_tatib' && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <h3 className="text-[13pt] font-bold uppercase tracking-wider underline">
                  LEMBAR BUKU REKAM KEDISIPLINAN & TATA TERTIB SISWA
                </h3>
                <p className="text-[10pt] font-sans text-slate-700">
                  Tahun Ajaran 2026/2027 &bull; Nomor Registrasi: {selectedStudent?.nisn || '0000'}
                </p>
              </div>

              {/* Data Identitas Siswa */}
              <div className="p-3.5 border border-black text-[10.5pt] bg-slate-50/50 space-y-1 font-sans">
                <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                  <div>
                    <span className="inline-block w-36 font-semibold">Nama Peserta Didik</span>: <span className="font-bold">{selectedStudent?.name}</span>
                  </div>
                  <div>
                    <span className="inline-block w-36 font-semibold">Kelas / Rombel</span>: <span className="font-bold">{selectedStudent?.className}</span>
                  </div>
                  <div>
                    <span className="inline-block w-36 font-semibold">NISN / NIPD</span>: {selectedStudent?.nisn} / {selectedStudent?.nipd || '-'}
                  </div>
                  <div>
                    <span className="inline-block w-36 font-semibold">Jenis Kelamin</span>: {selectedStudent?.gender === 'L' ? 'Laki-laki (L)' : 'Perempuan (P)'}
                  </div>
                  <div>
                    <span className="inline-block w-36 font-semibold">Nama Orang Tua/Wali</span>: {selectedStudent?.parentName || '-'}
                  </div>
                  <div>
                    <span className="inline-block w-36 font-semibold">No. Telp / HP</span>: {selectedStudent?.parentPhone || '-'}
                  </div>
                  <div className="col-span-2">
                    <span className="inline-block w-36 font-semibold">Alamat Rumah</span>: {selectedStudent?.address || '-'}
                  </div>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-300 flex items-center justify-between">
                  <div>
                    <span className="font-semibold">Akumulasi Kredit Poin Pelanggaran: </span>
                    <span className="font-bold text-red-600 text-[11pt]">{studentPoints} Poin</span>
                  </div>
                  <div>
                    <span className="font-semibold">Status Pembinaan: </span>
                    <span className="font-bold uppercase">{studentStatus.label}</span>
                  </div>
                </div>
              </div>

              {/* Tabel Riwayat Pelanggaran */}
              <div className="space-y-2">
                <h4 className="font-bold text-[11pt] uppercase tracking-wide">
                  A. Riwayat Pelanggaran Tata Tertib yang Dilakukan
                </h4>
                {studentRecords.length === 0 ? (
                  <div className="p-4 border border-slate-300 text-center text-[10.5pt] italic text-slate-600">
                    Siswa tidak memiliki catatan pelanggaran tata tertib (Disiplin Bersih / 0 Poin).
                  </div>
                ) : (
                  <table className="w-full border-collapse border border-black text-[9.5pt] font-sans">
                    <thead>
                      <tr className="bg-slate-100 text-black border-b border-black text-center font-bold">
                        <th className="border border-black p-1.5 w-8">No</th>
                        <th className="border border-black p-1.5 w-24">Tanggal/Jam</th>
                        <th className="border border-black p-1.5">Butir Pelanggaran & Lokasi</th>
                        <th className="border border-black p-1.5 w-20">Kategori</th>
                        <th className="border border-black p-1.5 w-12">Poin</th>
                        <th className="border border-black p-1.5">Sanksi Edukatif Diberikan</th>
                        <th className="border border-black p-1.5 w-20">Pelapor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentRecords.map((r, idx) => (
                        <tr key={r.id} className="border-b border-black">
                          <td className="border border-black p-1 text-center font-mono">{idx + 1}</td>
                          <td className="border border-black p-1 text-center">
                            {formatDateShort(r.date)}
                            <br />
                            <span className="text-[8.5pt] text-slate-500">{r.time}</span>
                          </td>
                          <td className="border border-black p-1.5">
                            <span className="font-bold">[{r.ruleCode}] {r.ruleName}</span>
                            {r.notes && <div className="text-[8.5pt] italic text-slate-600">{r.notes}</div>}
                          </td>
                          <td className="border border-black p-1 text-center font-medium capitalize">
                            {formatCategoryName(r.category)}
                          </td>
                          <td className="border border-black p-1 text-center font-bold text-red-600">
                            +{r.points}
                          </td>
                          <td className="border border-black p-1.5">{r.followUpAction || '-'}</td>
                          <td className="border border-black p-1 text-center text-[8.5pt]">{r.reporterName}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-100 font-bold border-t-2 border-black">
                        <td colSpan={4} className="border border-black p-1.5 text-right uppercase">
                          Total Akumulasi Poin Pelanggaran:
                        </td>
                        <td className="border border-black p-1.5 text-center text-red-600 font-black">
                          {studentPoints}
                        </td>
                        <td colSpan={2} className="border border-black p-1.5 text-center">
                          {studentStatus.label}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                )}
              </div>

              {/* B. Catatan Konseling BK */}
              <div className="space-y-2">
                <h4 className="font-bold text-[11pt] uppercase tracking-wide">
                  B. Catatan Bimbingan Konseling & Komitmen Pembinaan
                </h4>
                {studentCounseling.length === 0 ? (
                  <div className="p-3 border border-slate-300 text-center text-[10pt] italic text-slate-600">
                    Belum dilakukan sesi konseling formal di ruang BK.
                  </div>
                ) : (
                  <div className="space-y-2 text-[9.5pt] font-sans">
                    {studentCounseling.map((c, i) => (
                      <div key={c.id} className="p-2 border border-black space-y-1">
                        <div className="flex justify-between font-bold">
                          <span>{i + 1}. {c.sessionTitle}</span>
                          <span>{formatDateIndo(c.date)}</span>
                        </div>
                        <p>{c.notes}</p>
                        {c.agreement && (
                          <p className="italic text-slate-700">Komitmen: "{c.agreement}"</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Blok Tanda Tangan */}
              <div className="pt-6 page-break-inside-avoid">
                <div className="flex justify-end text-[10.5pt] font-sans mb-4">
                  <span>{settings.city}, {formatDateIndo(letterDate)}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center text-[10pt] font-sans">
                  <div>
                    <p>Peserta Didik,</p>
                    <div className="h-16"></div>
                    <p className="font-bold underline">{selectedStudent?.name}</p>
                    <p className="text-[9pt]">NISN: {selectedStudent?.nisn}</p>
                  </div>
                  <div>
                    <p>Wali Kelas,</p>
                    <div className="h-16"></div>
                    <p className="font-bold underline">( Wali Kelas {selectedStudent?.className} )</p>
                    <p className="text-[9pt]">NIP. -</p>
                  </div>
                  <div>
                    <p>Guru BK / Konselor,</p>
                    <div className="h-16"></div>
                    <p className="font-bold underline">{settings.bkCoordinatorName}</p>
                    <p className="text-[9pt]">NIP. {settings.bkCoordinatorNip}</p>
                  </div>
                </div>

                <div className="mt-6 text-center text-[10pt] font-sans">
                  <p>Mengetahui,</p>
                  <p>Kepala {settings.schoolName}</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline">{settings.headmasterName}</p>
                  <p className="text-[9pt]">NIP. {settings.headmasterNip}</p>
                </div>
              </div>
            </div>
          )}

          {/* DOKUMEN TYPE 2: SURAT PERINGATAN (SP 1 / SP 2 / SP 3) */}
          {documentType === 'surat_peringatan' && (
            <div className="space-y-5 text-[11pt]">
              <div className="text-center space-y-1">
                <h3 className="text-[13pt] font-bold uppercase tracking-wider underline">
                  SURAT PERINGATAN ({spLevel})
                </h3>
                <p className="text-[10pt] font-sans text-slate-700">
                  Nomor: {docNumber}
                </p>
              </div>

              <p className="text-justify">
                Berdasarkan rekam jejak kedisiplinan dan ketentuan Tata Tertib Peserta Didik di lingkungan{' '}
                <strong>{settings.schoolName}</strong>, dengan ini Kepala Sekolah memberikan Surat Peringatan (<strong>{spLevel}</strong>) kepada:
              </p>

              <div className="pl-6 space-y-1.5 font-sans text-[10.5pt]">
                <div className="grid grid-cols-3 gap-2">
                  <span className="font-semibold">Nama Siswa</span>
                  <span className="col-span-2">: <strong>{selectedStudent?.name}</strong></span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="font-semibold">NISN / NIPD</span>
                  <span className="col-span-2">: {selectedStudent?.nisn} / {selectedStudent?.nipd || '-'}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="font-semibold">Kelas</span>
                  <span className="col-span-2">: <strong>{selectedStudent?.className}</strong></span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="font-semibold">Nama Orang Tua/Wali</span>
                  <span className="col-span-2">: {selectedStudent?.parentName}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="font-semibold">Akumulasi Poin Pelanggaran</span>
                  <span className="col-span-2">: <strong className="text-red-600">{studentPoints} Poin</strong> ({studentStatus.label})</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-justify">
                  Surat Peringatan ini diterbitkan atas pertimbangan pelanggaran tata tertib yang telah dilakukan secara berulang atau pelanggaran berkategori berat/sangat berat, antara lain:
                </p>

                <ul className="list-disc pl-8 font-sans text-[10pt] space-y-1">
                  {studentRecords.slice(-4).map((r) => (
                    <li key={r.id}>
                      <strong>{formatDateShort(r.date)}:</strong> [{r.ruleCode}] {r.ruleName} (+{r.points} Poin) - <em>{r.notes || r.followUpAction}</em>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 border border-black bg-slate-50 font-sans text-[10pt] space-y-1">
                <span className="font-bold">Konsekuensi & Ketentuan Pembinaan:</span>
                <p className="text-justify">
                  {spLevel === 'SP 1' &&
                    '1. Siswa wajib mematuhi seluruh tata tertib sekolah dan tidak mengulangi pelanggaran apapun. 2. Orang tua/wali murid diimbau memantau kedisiplinan belajar di rumah.'}
                  {spLevel === 'SP 2' &&
                    '1. Siswa dikenakan sanksi skorsing belajar di rumah selama 3 (tiga) hari efektif. 2. Orang tua wajib hadir ke sekolah untuk menandatangani surat perjanjian kesepakatan pembinaan.'}
                  {spLevel === 'SP 3' &&
                    '1. Siswa dikenakan skorsing 7 (tujuh) hari efektif dan surat perjanjian di atas materai. 2. Apabila melakukan 1 (satu) kali lagi pelanggaran, maka siswa akan langsung dikembalikan secara sepihak kepada orang tua/wali murid (Dikeluarkan).'}
                </p>
              </div>

              <p className="text-justify">
                Demikian Surat Peringatan ini dibuat demi tegaknya tata tertib dan perbaikan karakter peserta didik. Atas perhatian dan kerja sama Bapak/Ibu orang tua/wali murid, kami sampaikan terima kasih.
              </p>

              {/* Tanda Tangan SP */}
              <div className="pt-4 page-break-inside-avoid">
                <div className="flex justify-end text-[10.5pt] font-sans mb-3">
                  <span>{settings.city}, {formatDateIndo(letterDate)}</span>
                </div>
                <div className="grid grid-cols-2 gap-8 text-center text-[10pt] font-sans">
                  <div>
                    <p>Koordinator Tim Ketertiban / BK,</p>
                    <div className="h-16"></div>
                    <p className="font-bold underline">{settings.bkCoordinatorName}</p>
                    <p className="text-[9pt]">NIP. {settings.bkCoordinatorNip}</p>
                  </div>
                  <div>
                    <p>Kepala {settings.schoolName},</p>
                    <div className="h-16"></div>
                    <p className="font-bold underline">{settings.headmasterName}</p>
                    <p className="text-[9pt]">NIP. {settings.headmasterNip}</p>
                  </div>
                </div>

                <div className="pt-4 text-[9pt] font-sans text-slate-700">
                  <p className="font-bold">Tembusan:</p>
                  <ol className="list-decimal pl-5">
                    <li>Yth. Kepala Dinas Pendidikan Kabupaten/Kota</li>
                    <li>Yth. Pengawas Pembina Sekolah</li>
                    <li>Wali Kelas {selectedStudent?.className}</li>
                    <li>Arsip / Dokumen BK</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* DOKUMEN TYPE 3: SURAT PANGGILAN ORANG TUA */}
          {documentType === 'surat_panggilan' && (
            <div className="space-y-5 text-[11pt]">
              <div className="flex justify-between items-start">
                <div className="space-y-1 font-sans text-[10pt]">
                  <p>Nomor : {docNumber}</p>
                  <p>Lampiran : -</p>
                  <p>Hal : <strong>Panggilan Orang Tua / Wali Murid</strong></p>
                </div>
                <div className="text-right font-sans text-[10pt]">
                  <p>{settings.city}, {formatDateIndo(letterDate)}</p>
                  <p className="mt-4 font-bold">Kepada Yth.</p>
                  <p>Bapak / Ibu Orang Tua / Wali dari:</p>
                  <p className="font-bold underline">{selectedStudent?.name}</p>
                  <p>di Tempat</p>
                </div>
              </div>

              <p className="text-justify">Dengan hormat,</p>

              <p className="text-justify">
                Sehubungan dengan pembinaan kedisiplinan dan evaluasi perkembangan perilaku belajar ananda{' '}
                <strong>{selectedStudent?.name}</strong> (Kelas {selectedStudent?.className}) yang telah mencapai akumulasi{' '}
                <strong className="text-red-600">{studentPoints} Poin Pelanggaran</strong> ({studentStatus.label}), maka kami mengharap kehadiran Bapak / Ibu Orang Tua / Wali Murid pada:
              </p>

              <div className="pl-8 space-y-1.5 font-sans text-[10.5pt] bg-slate-50 p-4 border border-black">
                <div className="grid grid-cols-3 gap-2">
                  <span className="font-semibold">Hari / Tanggal</span>
                  <span className="col-span-2">: <strong>{formatDateIndo(meetingDate)}</strong></span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="font-semibold">Pukul / Waktu</span>
                  <span className="col-span-2">: <strong>{meetingTime}</strong></span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="font-semibold">Tempat</span>
                  <span className="col-span-2">: {meetingPlace}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="font-semibold">Bertemu Dengan</span>
                  <span className="col-span-2">: Guru Bimbingan Konseling (BK) & Tim Tatib Sekolah</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="font-semibold">Keperluan</span>
                  <span className="col-span-2">: Musyawarah & Penanganan Khusus Kedisiplinan Siswa</span>
                </div>
              </div>

              <p className="text-justify">
                Mengingat pentingnya agenda tersebut bagi keberlangsungan proses pendidikan ananda, kami mohon kehadiran Bapak/Ibu tepat pada waktunya dan tidak dapat diwakilkan.
              </p>

              <p className="text-justify">
                Demikian surat undangan panggilan ini kami sampaikan. Atas kerja sama dan perhatian Bapak/Ibu, kami ucapkan terima kasih.
              </p>

              {/* Tanda Tangan */}
              <div className="pt-6 page-break-inside-avoid">
                <div className="grid grid-cols-2 gap-8 text-center text-[10pt] font-sans">
                  <div>
                    <p>Guru Bimbingan Konseling (BK),</p>
                    <div className="h-16"></div>
                    <p className="font-bold underline">{settings.bkCoordinatorName}</p>
                    <p className="text-[9pt]">NIP. {settings.bkCoordinatorNip}</p>
                  </div>
                  <div>
                    <p>Mengetahui,</p>
                    <p>Kepala {settings.schoolName},</p>
                    <div className="h-16"></div>
                    <p className="font-bold underline">{settings.headmasterName}</p>
                    <p className="text-[9pt]">NIP. {settings.headmasterNip}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DOKUMEN TYPE 4: SURAT PERJANJIAN BERMATERAI */}
          {documentType === 'surat_perjanjian' && (
            <div className="space-y-4 text-[10.5pt]">
              <div className="text-center space-y-1">
                <h3 className="text-[13pt] font-bold uppercase tracking-wider underline">
                  SURAT PERNYATAAN & PERJANJIAN KEDISIPLINAN SISWA
                </h3>
                <p className="text-[9.5pt] font-sans text-slate-700">
                  Nomor: {docNumber}
                </p>
              </div>

              <p>Yang bertanda tangan di bawah ini:</p>

              <div className="pl-6 space-y-1 font-sans text-[10pt]">
                <div className="grid grid-cols-3 gap-2">
                  <span>Nama Lengkap Siswa</span>
                  <span className="col-span-2">: <strong>{selectedStudent?.name}</strong></span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span>NISN / NIPD</span>
                  <span className="col-span-2">: {selectedStudent?.nisn} / {selectedStudent?.nipd || '-'}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span>Kelas / Rombel</span>
                  <span className="col-span-2">: {selectedStudent?.className}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span>Nama Orang Tua / Wali</span>
                  <span className="col-span-2">: {selectedStudent?.parentName}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span>Alamat</span>
                  <span className="col-span-2">: {selectedStudent?.address}</span>
                </div>
              </div>

              <p className="text-justify">
                Dengan penuh kesadaran dan tanpa paksaan dari pihak manapun, dengan ini menyatakan bahwa saya mengakui telah melakukan pelanggaran tata tertib sekolah dengan akumulasi poin sebesar <strong>{studentPoints} Poin</strong>.
              </p>

              <p className="font-bold">Dengan ini saya berjanji dengan sungguh-sungguh:</p>
              <ol className="list-decimal pl-8 space-y-1 text-justify">
                <li>Tidak akan mengulangi perbuatan pelanggaran tata tertib sekolah dalam bentuk apapun.</li>
                <li>Menaati seluruh peraturan dan tata tertib yang berlaku di lingkungan {settings.schoolName}.</li>
                <li>Bersedia menjaga nama baik diri sendiri, keluarga, guru, dan almamater sekolah.</li>
                <li>
                  Apabila di kemudian hari saya mengulangi pelanggaran yang sama ataupun melanggar tata tertib lainnya, saya dan orang tua/wali murid menyatakan <strong>BERSEDIA MENERIMA SANKSI TEGAS DIKEMBALIKAN KEPADA ORANG TUA (DIKELUARKAN DARI SEKOLAH)</strong> secara sepihak dan sukarela tanpa menuntut pihak manapun.
                </li>
              </ol>

              <p className="text-justify">
                Demikian surat pernyataan ini saya buat dan tanda tangani bersama orang tua/wali murid di atas kertas bermaterai cukup untuk dapat dipergunakan sebagaimana mestinya.
              </p>

              {/* Tanda Tangan Bermaterai */}
              <div className="pt-4 page-break-inside-avoid">
                <div className="flex justify-end text-[10pt] font-sans mb-3">
                  <span>{settings.city}, {formatDateIndo(letterDate)}</span>
                </div>
                <div className="grid grid-cols-2 gap-8 text-center text-[10pt] font-sans">
                  <div>
                    <p>Menyetujui,</p>
                    <p>Orang Tua / Wali Murid,</p>
                    <div className="h-20"></div>
                    <p className="font-bold underline">{selectedStudent?.parentName || '( Nama Orang Tua )'}</p>
                  </div>
                  <div>
                    <p>Yang Membuat Pernyataan,</p>
                    <p>Peserta Didik Bersangkutan,</p>
                    <div className="h-6"></div>
                    <div className="border border-dashed border-slate-400 w-24 h-12 mx-auto flex items-center justify-center text-[8pt] text-slate-500">
                      Materai Rp 10.000
                    </div>
                    <div className="h-2"></div>
                    <p className="font-bold underline">{selectedStudent?.name}</p>
                  </div>
                </div>

                <div className="mt-6 text-center text-[10pt] font-sans">
                  <p>Mengetahui & Mengesahkan,</p>
                  <p>Kepala {settings.schoolName}</p>
                  <div className="h-16"></div>
                  <p className="font-bold underline">{settings.headmasterName}</p>
                  <p className="text-[9pt]">NIP. {settings.headmasterNip}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
