/**
 * Tipe Data Resmi Formulir Pendaftaran Calon Peserta Didik Baru
 * SDIT AL AFIYAH - Yayasan Pendidikan Imam Bonjol Majalengka
 * Tahun Pelajaran 2027/2028
 */

export interface SDITRegistrationFormData {
  // A. KETERANGAN ANAK (Poin 1 - 17)
  studentName: string; // 1. Nama lengkap
  nickname?: string; // 2. Nama panggilan
  gender: 'L' | 'P'; // 3. Jenis kelamin (Laki-laki / Perempuan)
  pob: string; // 4. Tempat lahir
  dob: string; // 4. Tanggal lahir (YYYY-MM-DD)
  religion?: string; // 5. Agama (Islam / Katholik / Protestan / Hindu / Budha)
  citizenship?: string; // 6. Kewarganegaraan (WNI / WNA)
  childOrder?: string | number; // 7. Anak ke
  siblingsCount?: string | number; // 8. Jumlah saudara kandung (... Orang)
  stepSiblingsCount?: string | number; // 9. Jumlah saudara tiri/angkat (... Orang)
  dailyLanguage?: string; // 10. Bahasa sehari-hari
  heightCm?: string | number; // 11. Tinggi badan (... cm)
  weightKg?: string | number; // 12. Berat badan (... kg)
  diseaseHistory?: string; // 13. Penyakit yang pernah diderita
  bloodType?: string; // 14. Golongan darah (A / B / AB / O / Belum Tahu)
  distanceToSchoolKm?: string | number; // 15. Jarak dari rumah ke sekolah (... km)
  livingWith?: string; // 16. Mengikuti/tinggal dengan (Ayah / Ibu / Keduanya / Wali / Sendiri)
  address: string; // 17. Alamat lengkap
  phone?: string; // Telp / Hp

  // B. KETERANGAN ORANG TUA / WALI (Poin 18 - 20)
  fatherName: string; // 18. Nama Ayah kandung
  fatherBirthYear?: string; // Tahun lahir
  fatherEducation?: string; // Pendidikan terakhir
  fatherJob?: string; // Pekerjaan
  fatherCompany?: string; // Nama instansi / perusahaan
  fatherPosition?: string; // Jabatan
  fatherOfficeAddress?: string; // Alamat instansi
  fatherHomeAddress?: string; // Alamat rumah
  fatherPhone?: string; // Telp / Hp

  motherName: string; // 19. Nama Ibu kandung
  motherBirthYear?: string; // Tahun lahir
  motherEducation?: string; // Pendidikan terakhir
  motherJob?: string; // Pekerjaan
  motherCompany?: string; // Nama instansi / perusahaan
  motherPosition?: string; // Jabatan
  motherOfficeAddress?: string; // Alamat instansi
  motherHomeAddress?: string; // Alamat rumah
  motherPhone: string; // Telp / Hp (WhatsApp Utama)

  guardianName?: string; // 20. Nama Wali (jika diasuh wali)
  guardianBirthYear?: string;
  guardianEducation?: string;
  guardianJob?: string;
  guardianCompany?: string;
  guardianPosition?: string;
  guardianOfficeAddress?: string;
  guardianHomeAddress?: string;
  guardianPhone?: string;

  // C. KETERANGAN LAIN-LAIN (Poin 21 - 28)
  transportation?: string; // 21. Berangkat Sekolah: diantar / sendiri / jemputan
  admissionAs?: string; // 22. Masuk sekolah sebagai: Murid kelas 1 / pindahan (kelas ...)
  
  // 23. Asal sekolah TK / BA / RA / DA
  originSchoolName?: string;
  originSchoolAddress?: string;
  originSchoolPhone?: string;

  // 24. Pindahan dari sekolah SD / MI (jika pindahan)
  transferSchoolName?: string;
  transferSchoolAddress?: string;
  transferSchoolPhone?: string;
  transferLeaveDate?: string; // 25. Tgl meninggalkan sekolah

  otherNotes?: string; // 26. Lain-lain yang perlu
  firstKnownSource?: string; // 27. Informasi pertama kali Mengenal SDIT AL AFIYAH
  mainReason?: string; // 28. Alasan paling utama Memasukkan anak ke SDIT AL AFIYAH

  // PERSYARATAN & KELENGKAPAN CHECKLIST (12 Butir)
  checkAge6Years?: boolean; // 1. Usia min 6 tahun per 1 Juli 2027
  checkFeePaid?: boolean; // 2. Membayar biaya pendaftaran (Gel 1: Rp 250.000)
  checkFormFilled?: boolean; // 3. Mengisi formulir pendaftaran
  checkIjazahTk?: boolean; // 4. Foto copy ijazah/surat tamat TK/RA/BA (1 lembar)
  checkKK?: boolean; // 5. Foto copy Kartu Keluarga (2 lembar)
  checkAkta?: boolean; // 6. Foto copy Akta Kelahiran (2 lembar)
  checkPasFoto?: boolean; // 7. Pas foto berwarna 3x4 (2 lembar)
  checkSuratPindah?: boolean; // 8. Surat pengantar (bagi pindahan)
  checkRaportPindah?: boolean; // 9. Raport terakhir (bagi pindahan)
  checkNisnPindah?: boolean; // 10. NISN (bagi pindahan)
  checkKelakuanBaik?: boolean; // 11. Surat kelakuan baik (bagi pindahan)
  checkAkreditasiPindah?: boolean; // 12. Surat Akreditasi (bagi pindahan)
}

/**
 * Menghitung usia anak per 1 Juli 2027 berdasarkan tanggal lahir
 */
export function calculateAgePerJuly2027(dobString: string): {
  years: number;
  months: number;
  isEligible: boolean;
  text: string;
} {
  if (!dobString) {
    return { years: 0, months: 0, isEligible: false, text: '-' };
  }

  const birthDate = new Date(dobString);
  const targetDate = new Date('2027-07-01');

  if (isNaN(birthDate.getTime())) {
    return { years: 0, months: 0, isEligible: false, text: '-' };
  }

  let years = targetDate.getFullYear() - birthDate.getFullYear();
  let months = targetDate.getMonth() - birthDate.getMonth();

  if (months < 0 || (months === 0 && targetDate.getDate() < birthDate.getDate())) {
    years--;
    months += 12;
  }

  const isEligible = years >= 6;
  const text = `${years} Tahun ${months} Bulan`;

  return { years, months, isEligible, text };
}

export const SDIT_OFFICIAL_METADATA = {
  foundationName: 'YAYASAN PENDIDIKAN IMAM BONJOL',
  arabicName: 'المدرسة الإبتدائية المتكاملة العافية',
  schoolName: 'SEKOLAH DASAR ISLAM TERPADU SDIT AL AFIYAH',
  skDisdik: 'SK. DISDIK NOMOR: 473 TAHUN 2017',
  nss: '102021601070',
  npsn: '69900910',
  address: 'LINGKUNGAN GIRI ASIH - JL. GERAKAN KOPERASI MAJALENGKA WETAN 45411',
  phone: '0813-1013-9001',
  academicYear: '2027/2028',
  waveFees: {
    wave1: { name: 'Gelombang 1', fee: 250000, label: 'Rp 250.000,00', period: '1 Oktober 2026 – 30 Desember 2026' },
    wave2: { name: 'Gelombang 2', fee: 275000, label: 'Rp 275.000,00', period: '1 Januari 2027 – 3 April 2027' },
    wave3: { name: 'Gelombang 3', fee: 300000, label: 'Rp 300.000,00', period: '6 April 2027 – 26 Juni 2027' },
  },
};
