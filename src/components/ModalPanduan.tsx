import React from 'react';
import {
  X,
  BookOpen,
  PlusCircle,
  Users,
  ShieldAlert,
  Printer,
  Settings,
  FileSpreadsheet,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';

interface ModalPanduanProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModalPanduan: React.FC<ModalPanduanProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 my-8 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 to-sky-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">Panduan Penggunaan SiTatib</h3>
              <p className="text-xs text-sky-100">Langkah Praktis Pengelolaan Tata Tertib Sekolah</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          {/* Step 1 */}
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-black flex items-center justify-center shrink-0 text-sm">
              1
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <PlusCircle className="w-4 h-4 text-rose-600" />
                Mencatat Pelanggaran Siswa (Cepat & Akurat)
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Klik tombol merah <strong>"Catat Pelanggaran"</strong> di kanan atas atau di Beranda. Pilih nama siswa, pilih jenis pelanggaran dari 4 kategori (Ringan, Sedang, Berat, Sangat Berat), masukkan waktu, lokasi, dan kronologi singkat. Poin siswa akan otomatis terakumulasi dan sistem memberi peringatan jika melewati batas SP!
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-black flex items-center justify-center shrink-0 text-sm">
              2
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-600" />
                Memantau Data Siswa & Hubungi Orang Tua
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Buka menu <strong>"Nama Siswa & Kelas"</strong>. Anda dapat menyaring data per kelas (VII A, VII B, dst.) atau mencari nama/NISN. Klik ikon <strong>WhatsApp</strong> di samping nomor orang tua untuk langsung mengirim pesan pembinaan, atau klik ikon <strong>Buku Rekam</strong> untuk melihat kartu pelanggaran dan mencatat sesi konseling BK.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 font-black flex items-center justify-center shrink-0 text-sm">
              3
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                Melihat Pedoman Tata Tertib & Jurnal
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Buka menu <strong>"Tata Tertib / Pelanggaran"</strong>. Tab <em>Pedoman</em> memuat butir pasal lengkap dan sanksi edukatifnya (bisa ditambah/diedit). Tab <em>Jurnal</em> berisi seluruh rekaman kejadian pelanggaran harian yang bisa disaring dan ditandai jika siswa sudah selesai dibina.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-black flex items-center justify-center shrink-0 text-sm">
              4
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Printer className="w-4 h-4 text-emerald-600" />
                Mencetak Dokumen Resmi (Buku Tatib, SP & Panggilan)
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Buka menu <strong>"Laporan Cetak Per Siswa"</strong>. Pilih siswa dan format dokumen yang diinginkan:
                <br />
                &bull; <strong>Buku Rekam Kedisiplinan Siswa</strong> (rekap poin & riwayat pembinaan).
                <br />
                &bull; <strong>Surat Peringatan (SP 1 / SP 2 / SP 3)</strong> format resmi dinas pendidikan.
                <br />
                &bull; <strong>Surat Panggilan Orang Tua</strong> dengan jadwal hari, jam, dan ruang BK.
                <br />
                &bull; <strong>Surat Pernyataan / Perjanjian Bermaterai Rp 10.000</strong>.
                <br />
                Klik <strong>"Cetak / Simpan PDF (A4)"</strong> untuk langsung mencetak berkas bertanda tangan resmi tanpa ada tampilan navigasi aplikasi.
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 font-black flex items-center justify-center shrink-0 text-sm">
              5
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-sky-600" />
                Pengaturan Sekolah & Google Sheets
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Buka menu <strong>"Seting"</strong> untuk mengganti Nama Sekolah, Nama Kepala Sekolah/NIP, Guru BK, ambang batas poin sanksi SP, dan mengunduh data dalam format CSV untuk dibuka di Google Sheets atau akun belajar Anda.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs cursor-pointer"
          >
            Mengerti & Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
