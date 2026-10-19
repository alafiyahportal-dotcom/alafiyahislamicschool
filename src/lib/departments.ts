/**
 * Utility function to categorize staff and teachers into institutional departments.
 * Safe for use in both Server Components and Client Components.
 */
export function getDepartmentByRole(role: string = '', specialization: string = ''): string {
  const text = `${role} ${specialization}`.toLowerCase();
  if (text.includes('yayasan') || text.includes('penyelenggara')) return 'Penyelenggara Lembaga';
  if (text.includes('kepala sekolah') || text.includes('pimpinan')) return 'Pimpinan Satuan Pendidikan';
  if (text.includes('developer') || text.includes('lead dev') || text.includes('programmer') || text.includes('sistem')) return 'Pengembang Sistem & IT';
  if (text.includes('komite') || text.includes('paguyuban') || text.includes('kemitraan')) return 'Komite & Sinergi Wali Murid';
  if (text.includes('kurikulum') || text.includes('merdeka') || text.includes('akademik')) return 'Kurikulum & Mutu Pembelajaran';
  if (text.includes('tahfidz') || text.includes('talaqqi') || text.includes('tartil') || text.includes('qur')) return 'Bidang Tahfidz & Keislaman';
  if (text.includes('kesiswaan') || text.includes('karakter') || text.includes('ekstrakurikuler')) return 'Kesiswaan & Pembinaan Adab';
  if (text.includes('bendahara') || text.includes('keuangan') || text.includes('anggaran')) return 'Tata Kelola Keuangan';
  if (text.includes('tata usaha') || text.includes('administrasi')) return 'Tata Usaha & Layanan Sekolah';
  return 'Tenaga Pendidik & Staf';
}
