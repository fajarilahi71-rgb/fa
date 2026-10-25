import { ViolationRule, Student, ViolationRecord, SchoolSettings, CounselingLog } from '../types/tatib';

export const INITIAL_RULES: ViolationRule[] = [
  // --- KATEGORI 1: PELANGGARAN RINGAN (2 - 10 POIN) ---
  {
    id: 'r-01',
    code: 'R-01',
    category: 'ringan',
    subCategory: 'Kehadiran & Waktu',
    name: 'Terlambat hadir ke sekolah kurang dari 15 menit',
    points: 3,
    sanction: 'Teguran lisan, membaca doa/Al-Quran di piket & masuk kelas setelah tanda tangan piket'
  },
  {
    id: 'r-02',
    code: 'R-02',
    category: 'ringan',
    subCategory: 'Kehadiran & Waktu',
    name: 'Terlambat hadir ke sekolah lebih dari 15 menit',
    points: 5,
    sanction: 'Tugas kebersihan ringan di taman/halaman & pembinaan oleh Guru Piket'
  },
  {
    id: 'r-03',
    code: 'R-03',
    category: 'ringan',
    subCategory: 'Kerapian & Pakaian',
    name: 'Seragam tidak lengkap (tidak memakai dasi, ikat pinggang, topi upacara, atau kaos kaki tidak standar)',
    points: 3,
    sanction: 'Peringatan lisan, pencatatan di buku pelanggaran, dan melengkapi pada hari berikutnya'
  },
  {
    id: 'r-04',
    code: 'R-04',
    category: 'ringan',
    subCategory: 'Kerapian & Pakaian',
    name: 'Memakai seragam yang tidak sesuai dengan jadwal ketentuan hari',
    points: 5,
    sanction: 'Teguran lisan dan surat pembinaan dari Wali Kelas'
  },
  {
    id: 'r-05',
    code: 'R-05',
    category: 'ringan',
    subCategory: 'Kerapian & Penampilan',
    name: 'Rambut putra gondrong / melewati kerah baju / poni menutup mata atau dicat warna-warni',
    points: 5,
    sanction: 'Peringatan tempo 3 hari untuk merapikan rambut atau pemotongan rapi oleh petugas'
  },
  {
    id: 'r-06',
    code: 'R-06',
    category: 'ringan',
    subCategory: 'Kerapian & Penampilan',
    name: 'Bagi siswi: memakai make-up berlebihan (lipstik tebal, maskara, kutek kuku) atau perhiasan mencolok',
    points: 5,
    sanction: 'Penghapusan make-up/kutek di tempat & perhiasan diamankan di ruang BK'
  },
  {
    id: 'r-07',
    code: 'R-07',
    category: 'ringan',
    subCategory: 'Ketertiban Belajar',
    name: 'Keluar kelas tanpa izin guru saat proses belajar mengajar (PBM) berlangsung',
    points: 5,
    sanction: 'Teguran guru mapel dan pembinaan sikap di kelas'
  },
  {
    id: 'r-08',
    code: 'R-08',
    category: 'ringan',
    subCategory: 'Kebersihan Lingkungan',
    name: 'Membuang sampah sembarangan / meninggalkan bungkus makanan di laci meja kelas',
    points: 5,
    sanction: 'Membersihkan ruang kelas/lorong sekolah selama 20 menit'
  },
  {
    id: 'r-09',
    code: 'R-09',
    category: 'ringan',
    subCategory: 'Ketertiban Belajar',
    name: 'Makan atau minum saat guru sedang menerangkan di dalam kelas tanpa izin',
    points: 4,
    sanction: 'Teguran lisan & peringatan dari guru mata pelajaran'
  },
  {
    id: 'r-10',
    code: 'R-10',
    category: 'ringan',
    subCategory: 'Penggunaan Teknologi',
    name: 'Membawa / memainkan smartphone (HP) saat jam KBM tanpa izin atau instruksi guru',
    points: 10,
    sanction: 'HP disita sementara di ruang BK dan diambil orang tua setelah jam pulang'
  },

  // --- KATEGORI 2: PELANGGARAN SEDANG (15 - 35 POIN) ---
  {
    id: 's-01',
    code: 'S-01',
    category: 'sedang',
    subCategory: 'Kehadiran & Membolos',
    name: 'Membolos pada jam pelajaran tertentu atau berada di kantin saat jam belajar',
    points: 15,
    sanction: 'Penyelidikan oleh guru BK, mengerjakan tugas tertulis rangkuman materi, pemanggilan orang tua'
  },
  {
    id: 's-02',
    code: 'S-02',
    category: 'sedang',
    subCategory: 'Kehadiran & Membolos',
    name: 'Tidak masuk sekolah tanpa surat keterangan sah (Alpa / Bolos seharian)',
    points: 15,
    sanction: 'Konfirmasi langsung ke nomor HP orang tua oleh Wali Kelas & pembinaan BK'
  },
  {
    id: 's-03',
    code: 'S-03',
    category: 'sedang',
    subCategory: 'Keamanan Lingkungan',
    name: 'Melompati pagar sekolah atau kabur keluar lingkungan sebelum bel pulang berbunyi',
    points: 25,
    sanction: 'Pemanggilan orang tua ke sekolah & membuat surat pernyataan tidak mengulangi'
  },
  {
    id: 's-04',
    code: 'S-04',
    category: 'sedang',
    subCategory: 'Nasionalisme & Upacara',
    name: 'Tidak mengikuti upacara bendera hari Senin atau peringatan hari besar nasional tanpa izin',
    points: 15,
    sanction: 'Hormat bendera selama 15 menit dan pembinaan wawasan kebangsaan'
  },
  {
    id: 's-05',
    code: 'S-05',
    category: 'sedang',
    subCategory: 'Etika & Sopan Santun',
    name: 'Berperilaku tidak sopan, membangkang, atau berbicara kotor kepada guru / staf sekolah',
    points: 25,
    sanction: 'Meminta maaf langsung di hadapan dewan guru & bimbingan khusus dari tim BK'
  },
  {
    id: 's-06',
    code: 'S-06',
    category: 'sedang',
    subCategory: 'Perundungan / Bullying',
    name: 'Melakukan perundungan verbal (mengejek fisik, mengolok nama orang tua, mengancam secara psikis)',
    points: 30,
    sanction: 'Pemanggilan orang tua, konseling mediasi bersama korban, dan sanksi edukasi sosial'
  },
  {
    id: 's-07',
    code: 'S-07',
    category: 'sedang',
    subCategory: 'Sarana Prasarana',
    name: 'Mencoret-coret meja, kursi, tembok sekolah, atau merusak fasilitas sekolah secara sengaja',
    points: 25,
    sanction: 'Mengecat ulang / membersihkan fasilitas yang dirusak atau mengganti kerugian'
  },
  {
    id: 's-08',
    code: 'S-08',
    category: 'sedang',
    subCategory: 'Rokok & Zat Berbahaya',
    name: 'Membawa korek/rokok atau merokok/vaping di luar pagar sekolah saat masih memakai seragam',
    points: 30,
    sanction: 'Rokok disita, pemanggilan orang tua ke sekolah, dan konseling kesehatan'
  },
  {
    id: 's-09',
    code: 'S-09',
    category: 'sedang',
    subCategory: 'Ketertiban Umum',
    name: 'Membawa kendaraan bermotor dengan knalpot bising (brong) atau berkendara membahayakan di sekolah',
    points: 20,
    sanction: 'Kendaraan ditahan di sekolah hingga knalpot diganti standar oleh orang tua'
  },

  // --- KATEGORI 3: PELANGGARAN BERAT (40 - 75 POIN) ---
  {
    id: 'b-01',
    code: 'B-01',
    category: 'berat',
    subCategory: 'Rokok & Zat Berbahaya',
    name: 'Merokok, menghisap vape / rokok elektrik di dalam area sekolah (kamar mandi, kelas, belakang kantin)',
    points: 40,
    sanction: 'Penerbitan Surat Peringatan (SP), pemanggilan orang tua ke sekolah, dan skorsing 3 hari'
  },
  {
    id: 'b-02',
    code: 'B-02',
    category: 'berat',
    subCategory: 'Kekerasan & Tawuran',
    name: 'Terlibat perkelahian fisik dengan sesama siswa di dalam maupun di luar lingkungan sekolah',
    points: 50,
    sanction: 'Penerbitan Surat Peringatan II, pemanggilan kedua orang tua, skorsing 3-5 hari'
  },
  {
    id: 'b-03',
    code: 'B-03',
    category: 'berat',
    subCategory: 'Keamanan & Senjata',
    name: 'Membawa senjata tajam (pisau, celurit, gir, pemukul) atau benda berbahaya tanpa instruksi tugas sekolah',
    points: 60,
    sanction: 'Penyitaan barang bukti, pemanggilan orang tua, perjanjian di atas materai, skorsing 7 hari'
  },
  {
    id: 'b-04',
    code: 'B-04',
    category: 'berat',
    subCategory: 'Kriminalitas & Hukum',
    name: 'Melakukan pemalakan, pemerasan uang atau barang berharga terhadap siswa lain',
    points: 60,
    sanction: 'Mengembalikan uang/barang, SP II, pemanggilan orang tua, dan pembinaan intensif kepolisian'
  },
  {
    id: 'b-05',
    code: 'B-05',
    category: 'berat',
    subCategory: 'Kriminalitas & Hukum',
    name: 'Mencuri barang milik sekolah, guru, karyawan, atau sesama siswa',
    points: 50,
    sanction: 'Mengembalikan/mengganti barang curian, pemanggilan orang tua, dan skorsing 5 hari'
  },
  {
    id: 'b-06',
    code: 'B-06',
    category: 'berat',
    subCategory: 'Dokumen & Kejujuran',
    name: 'Memalsukan tanda tangan Kepala Sekolah, Guru, Wali Kelas, Orang Tua, atau stempel sekolah',
    points: 50,
    sanction: 'Konferensi kasus bersama orang tua dan dewan guru, surat peringatan tertulis'
  },
  {
    id: 'b-07',
    code: 'B-07',
    category: 'berat',
    subCategory: 'Moral & Asusila',
    name: 'Membawa, menyimpan, menyebarkan foto atau video pornografi di gawai/lingkungan sekolah',
    points: 60,
    sanction: 'Pemeriksaan tim IT sekolah, pemanggilan orang tua, pembinaan moral & agama intensif'
  },
  {
    id: 'b-08',
    code: 'B-08',
    category: 'berat',
    subCategory: 'Judi & Taruhan',
    name: 'Melakukan perjudian (judi online di gawai atau kartu remi/taruhan) di lingkungan sekolah',
    points: 50,
    sanction: 'Penyitaan alat, pemanggilan orang tua, dan sanksi skorsing'
  },

  // --- KATEGORI 4: PELANGGARAN SANGAT BERAT (80 - 100 POIN) ---
  {
    id: 'sb-01',
    code: 'SB-01',
    category: 'sangat_berat',
    subCategory: 'Narkoba & Miras',
    name: 'Membawa, mengonsumsi, atau memperjualbelikan minuman keras (beralkohol) di lingkungan sekolah',
    points: 80,
    sanction: 'Penerbitan SP 3, pemanggilan orang tua darurat, skorsing hingga keputusan rapat dewan guru'
  },
  {
    id: 'sb-02',
    code: 'SB-02',
    category: 'sangat_berat',
    subCategory: 'Narkoba & Miras',
    name: 'Menggunakan, menyimpan, mengedarkan narkotika, psikotropika, atau zat adiktif berbahaya (Narkoba)',
    points: 100,
    sanction: 'Dikembalikan kepada orang tua / wali murid dan dilaporkan ke pihak berwajib/rehabilitasi'
  },
  {
    id: 'sb-03',
    code: 'SB-03',
    category: 'sangat_berat',
    subCategory: 'Kekerasan Berat',
    name: 'Menjadi provokator atau pemicu tawuran massal antar sekolah yang menimbulkan korban luka/kerusakan',
    points: 90,
    sanction: 'Skorsing panjang / Dikembalikan kepada orang tua dan proses hukum pihak kepolisian'
  },
  {
    id: 'sb-04',
    code: 'SB-04',
    category: 'sangat_berat',
    subCategory: 'Tindak Kriminal & Asusila',
    name: 'Melakukan tindak pidana kriminal berat (perampokan, pembegalan, atau kekerasan seksual)',
    points: 100,
    sanction: 'Pemberhentian status peserta didik (dikembalikan kepada orang tua) secara permanen'
  },
  {
    id: 'sb-05',
    code: 'SB-05',
    category: 'sangat_berat',
    subCategory: 'Pernikahan / Kesusilaan',
    name: 'Menikah atau hamil selama masa aktif menempuh pendidikan sekolah',
    points: 100,
    sanction: 'Dikembalikan secara kekeluargaan kepada orang tua untuk diarahkan ke jalur pendidikan paket/mandiri'
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-01',
    nisn: '0089123401',
    nipd: '232407001',
    name: 'Ahmad Rizky Pratama',
    gender: 'L',
    className: 'VII A',
    parentName: 'Bambang Supriyanto',
    parentPhone: '081234567890',
    address: 'Jl. Merdeka No. 12, Kel. Sukamaju',
    status: 'aktif'
  },
  {
    id: 'std-02',
    nisn: '0089123402',
    nipd: '232407002',
    name: 'Annisa Dwi Rahmawati',
    gender: 'P',
    className: 'VII A',
    parentName: 'H. Suhendra',
    parentPhone: '081398765432',
    address: 'Perumahan Griya Asri Blok B3/14',
    status: 'aktif'
  },
  {
    id: 'std-03',
    nisn: '0089123403',
    nipd: '232407003',
    name: 'Bagus Satria Wicaksono',
    gender: 'L',
    className: 'VII B',
    parentName: 'Joko Prabowo',
    parentPhone: '085711223344',
    address: 'Jl. Melati RT 02/05, Desa Mekar',
    status: 'aktif'
  },
  {
    id: 'std-04',
    nisn: '0078123404',
    nipd: '222308004',
    name: 'Dimas Aditya Nugraha',
    gender: 'L',
    className: 'VIII A',
    parentName: 'Sugiono Mulyo',
    parentPhone: '082188776655',
    address: 'Jl. Anggrek Indah No. 8',
    status: 'aktif'
  },
  {
    id: 'std-05',
    nisn: '0078123405',
    nipd: '222308005',
    name: 'Fadhil Muhammad Al-Fatih',
    gender: 'L',
    className: 'VIII B',
    parentName: 'Umar Syahroni',
    parentPhone: '081900112233',
    address: 'Jl. Pesantren No. 99',
    status: 'aktif'
  },
  {
    id: 'std-06',
    nisn: '0067123406',
    nipd: '212209006',
    name: 'Kevin Jonathan Arifin',
    gender: 'L',
    className: 'IX A',
    parentName: 'Hendrik Arifin',
    parentPhone: '081544332211',
    address: 'Komp. Harmoni Sejahtera Kav. 21',
    status: 'aktif'
  },
  {
    id: 'std-07',
    nisn: '0067123407',
    nipd: '212209007',
    name: 'Nabila Zahra Syahrani',
    gender: 'P',
    className: 'IX A',
    parentName: 'Rahmad Hidayat',
    parentPhone: '081299887766',
    address: 'Jl. Teratai Putih No. 5',
    status: 'aktif'
  },
  {
    id: 'std-08',
    nisn: '0067123408',
    nipd: '212209008',
    name: 'Reno Saputra Siregar',
    gender: 'L',
    className: 'IX B',
    parentName: 'Torkis Siregar',
    parentPhone: '082266778899',
    address: 'Jl. Veteran Raya Gang Cempaka 4',
    status: 'aktif'
  }
];

export const INITIAL_RECORDS: ViolationRecord[] = [
  {
    id: 'rec-01',
    studentId: 'std-08',
    studentName: 'Reno Saputra Siregar',
    studentClass: 'IX B',
    ruleId: 's-03',
    ruleCode: 'S-03',
    ruleName: 'Melompati pagar sekolah atau kabur keluar lingkungan sebelum bel pulang berbunyi',
    category: 'sedang',
    points: 25,
    date: '2026-10-18',
    time: '11:30',
    location: 'Pagar Belakang Lab IPA',
    reporterName: 'Bambang Prakoso, S.Pd. (Tatib)',
    notes: 'Terlihat bersama dua orang lainnya berusaha kabur saat pergantian jam pelajaran ke-5.',
    followUpAction: 'Dipanggil ke ruang BK, orang tua dihubungi melalui telepon.',
    isResolved: true
  },
  {
    id: 'rec-02',
    studentId: 'std-08',
    studentName: 'Reno Saputra Siregar',
    studentClass: 'IX B',
    ruleId: 'b-01',
    ruleCode: 'B-01',
    ruleName: 'Merokok, menghisap vape / rokok elektrik di dalam area sekolah',
    category: 'berat',
    points: 40,
    date: '2026-10-22',
    time: '12:45',
    location: 'Toilet Siswa Lantai 2',
    reporterName: 'Siti Nurhaliza, S.Pd. (BK)',
    notes: 'Ditemukan barang bukti 1 pod vape dan liquid rasa apel di saku celana.',
    followUpAction: 'Diterbitkan Surat Panggilan Orang Tua dan SP 1 (Total poin mencapai 65).',
    isResolved: false
  },
  {
    id: 'rec-03',
    studentId: 'std-04',
    studentName: 'Dimas Aditya Nugraha',
    studentClass: 'VIII A',
    ruleId: 'r-05',
    ruleCode: 'R-05',
    ruleName: 'Rambut putra gondrong / melewati kerah baju / poni menutup mata',
    category: 'ringan',
    points: 5,
    date: '2026-10-20',
    time: '07:10',
    location: 'Gerbang Utama',
    reporterName: 'Guru Piket',
    notes: 'Rambut bagian belakang sudah menyentuh kerah kemeja.',
    followUpAction: 'Diberi tempo sampai hari Jumat untuk memotong rapi.',
    isResolved: true
  },
  {
    id: 'rec-04',
    studentId: 'std-04',
    studentName: 'Dimas Aditya Nugraha',
    studentClass: 'VIII A',
    ruleId: 'r-10',
    ruleCode: 'R-10',
    ruleName: 'Membawa / memainkan smartphone (HP) saat jam KBM tanpa izin atau instruksi guru',
    category: 'ringan',
    points: 10,
    date: '2026-10-24',
    time: '09:15',
    location: 'Ruang Kelas VIII A',
    reporterName: 'Wali Kelas VIII A',
    notes: 'Bermain game online di bawah kolong meja saat pelajaran Matematika.',
    followUpAction: 'HP diamankan sampai pukul 14.00 WIB dan membuat janji tertulis.',
    isResolved: true
  },
  {
    id: 'rec-05',
    studentId: 'std-03',
    studentName: 'Bagus Satria Wicaksono',
    studentClass: 'VII B',
    ruleId: 'r-01',
    ruleCode: 'R-01',
    ruleName: 'Terlambat hadir ke sekolah kurang dari 15 menit',
    category: 'ringan',
    points: 3,
    date: '2026-10-23',
    time: '07:08',
    location: 'Gerbang Piket',
    reporterName: 'Guru Piket Pagi',
    notes: 'Ban sepeda bocor di tengah jalan.',
    followUpAction: 'Membaca juz amma di lobi dan diizinkan masuk kelas.',
    isResolved: true
  }
];

export const INITIAL_COUNSELING: CounselingLog[] = [
  {
    id: 'cns-01',
    studentId: 'std-08',
    date: '2026-10-23',
    counselor: 'Siti Nurhaliza, S.Pd., Kons.',
    sessionTitle: 'Konseling Tahap 1: Pembinaan Perilaku Disiplin & Bahaya Rokok/Vape',
    notes: 'Siswa mengakui kesalahannya melompat pagar dan membawa vape karena diajak pergaulan di luar jam sekolah. Menyadari dampaknya terhadap kesehatan dan citra sekolah.',
    agreement: 'Siswa berkomitmen tidak mengulangi, bersedia menjalani piket kebersihan masjid sekolah selama 3 hari, dan sanggup hadir didampingi ayah pada pertemuan wali murid.'
  }
];

export const INITIAL_SETTINGS: SchoolSettings = {
  schoolName: 'SMP NEGERI 1 CERDAS MANDIRI',
  educationDepartment: 'PEMERINTAH KABUPATEN / DINAS PENDIDIKAN DAN KEBUDAYAAN',
  npsn: '20210088',
  address: 'Jl. Pendidikan Karakter No. 45, Kecamatan Cerdas, Kode Pos 14045',
  phone: '(021) 7890-1234',
  email: 'tatib.smpn1cerdas@sekolah.belajar.id',
  website: 'www.smpn1cerdasmandiri.sch.id',
  city: 'Kota Pelajar',
  headmasterName: 'Drs. H. Ahmad Fauzi, M.Pd.',
  headmasterNip: '19750815 200003 1 004',
  bkCoordinatorName: 'Siti Nurhaliza, S.Pd., Kons.',
  bkCoordinatorNip: '19820412 200801 2 015',
  tatibCoordinatorName: 'Bambang Prakoso, S.Pd.',
  tatibCoordinatorNip: '19850920 201001 1 009',
  thresholdSp1: 25,
  thresholdSp2: 50,
  thresholdSp3: 75,
  thresholdDrop: 100,
  googleSheetId: '',
  googleSheetName: 'SiTatib_Data_Pelanggaran',
  lastSyncTime: null
};
