import { Student, ViolationRecord, ViolationRule, SchoolSettings } from '../types/tatib';
import { calculateStudentPoints, getDisciplineStatus } from './storage';

/**
 * Generates CSV content from Student Discipline data
 */
export function exportStudentsToCsv(students: Student[], records: ViolationRecord[], settings: SchoolSettings): string {
  const headers = [
    'NISN',
    'NIPD',
    'Nama Lengkap',
    'Jenis Kelamin',
    'Kelas',
    'Total Poin Pelanggaran',
    'Status Kedisiplinan',
    'Nama Orang Tua / Wali',
    'No HP Orang Tua',
    'Alamat'
  ];

  const rows = students.map(s => {
    const points = calculateStudentPoints(s.id, records);
    const status = getDisciplineStatus(points, settings);
    return [
      `"${s.nisn}"`,
      `"${s.nipd}"`,
      `"${s.name.replace(/"/g, '""')}"`,
      s.gender === 'L' ? 'Laki-laki' : 'Perempuan',
      `"${s.className}"`,
      points,
      `"${status.label}"`,
      `"${s.parentName.replace(/"/g, '""')}"`,
      `"${s.parentPhone}"`,
      `"${s.address.replace(/"/g, '""')}"`
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\r\n');
}

/**
 * Generates CSV content from Violation Records (Jurnal Pelanggaran)
 */
export function exportRecordsToCsv(records: ViolationRecord[]): string {
  const headers = [
    'Tanggal',
    'Waktu',
    'Nama Siswa',
    'Kelas',
    'Kode Pasal',
    'Nama Pelanggaran',
    'Kategori',
    'Poin',
    'Lokasi Kejadian',
    'Guru / Tim Pelapor',
    'Catatan / Kronologi',
    'Tindak Lanjut / Sanksi',
    'Status Selesai'
  ];

  const rows = records.map(r => {
    return [
      `"${r.date}"`,
      `"${r.time}"`,
      `"${r.studentName.replace(/"/g, '""')}"`,
      `"${r.studentClass}"`,
      `"${r.ruleCode}"`,
      `"${r.ruleName.replace(/"/g, '""')}"`,
      `"${r.category}"`,
      r.points,
      `"${(r.location || '').replace(/"/g, '""')}"`,
      `"${(r.reporterName || '').replace(/"/g, '""')}"`,
      `"${(r.notes || '').replace(/"/g, '""')}"`,
      `"${(r.followUpAction || '').replace(/"/g, '""')}"`,
      r.isResolved ? 'Selesai Dibina' : 'Dalam Proses'
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\r\n');
}

/**
 * Generates CSV content from Rules catalog
 */
export function exportRulesToCsv(rules: ViolationRule[]): string {
  const headers = ['Kode', 'Kategori', 'Sub Kategori', 'Deskripsi Pelanggaran', 'Bobot Poin', 'Sanksi Edukatif'];
  const rows = rules.map(r => [
    `"${r.code}"`,
    `"${r.category}"`,
    `"${r.subCategory}"`,
    `"${r.name.replace(/"/g, '""')}"`,
    r.points,
    `"${r.sanction.replace(/"/g, '""')}"`
  ].join(','));
  return [headers.join(','), ...rows].join('\r\n');
}

/**
 * Triggers a file download in the browser
 */
export function triggerDownload(content: string, fileName: string, mimeType = 'text/csv;charset=utf-8;'): void {
  const blob = new Blob(['\uFEFF' + content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Helper to push data to Google Sheets via Sheets REST API if access token is available
 */
export async function appendRecordsToGoogleSheet(
  spreadsheetId: string,
  range: string,
  values: (string | number)[][],
  accessToken: string
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ values })
      }
    );

    if (!res.ok) {
      const err = await res.json();
      return { success: false, message: err.error?.message || 'Gagal mengirim data ke Google Sheets' };
    }

    return { success: true, message: 'Data berhasil disinkronkan ke Google Sheets!' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Terjadi kesalahan jaringan' };
  }
}
