'use client';

import React, { useState } from 'react';
import {
  UserCheck,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Check,
  AlertCircle,
  Award,
  School as SchoolIcon,
} from 'lucide-react';

export interface TeacherItem {
  id: string;
  schoolId: string;
  name: string;
  role: string;
  specialization: string | null;
  photoUrl: string | null;
  bio: string | null;
  order: number;
  isActive: boolean;
  school: {
    slug: string;
    name: string;
  };
}

interface TeacherManagerClientProps {
  initialTeachers: TeacherItem[];
  schoolSlug: string;
  schoolName: string;
  schoolId: string;
}

export default function TeacherManagerClient({
  initialTeachers,
  schoolSlug,
  schoolName,
  schoolId,
}: TeacherManagerClientProps) {
  const [teachers, setTeachers] = useState<TeacherItem[]>(initialTeachers);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<TeacherItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formSpecialization, setFormSpecialization] = useState('');
  const [formPhotoUrl, setFormPhotoUrl] = useState('');
  const [formBio, setFormBio] = useState('');
  const [formOrder, setFormOrder] = useState(0);
  const [formIsActive, setFormIsActive] = useState(true);

  const openAddModal = () => {
    setEditingTeacher(null);
    setFormName('');
    setFormRole('');
    setFormSpecialization('');
    setFormPhotoUrl('');
    setFormBio('');
    setFormOrder(teachers.length + 1);
    setFormIsActive(true);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (teacher: TeacherItem) => {
    setEditingTeacher(teacher);
    setFormName(teacher.name);
    setFormRole(teacher.role);
    setFormSpecialization(teacher.specialization || '');
    setFormPhotoUrl(teacher.photoUrl || '');
    setFormBio(teacher.bio || '');
    setFormOrder(teacher.order);
    setFormIsActive(teacher.isActive);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTeacher(null);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formRole.trim()) {
      setErrorMessage('Nama lengkap dan amanah/jabatan pendidik wajib diisi');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (editingTeacher) {
        // Update Teacher
        const res = await fetch(`/api/admin/teachers/${editingTeacher.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formName.trim(),
            role: formRole.trim(),
            specialization: formSpecialization.trim() || null,
            photoUrl: formPhotoUrl.trim() || null,
            bio: formBio.trim() || null,
            order: Number(formOrder),
            isActive: formIsActive,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Gagal memperbarui data guru');

        setTeachers((prev) =>
          prev.map((t) => (t.id === editingTeacher.id ? data.teacher : t))
        );
      } else {
        // Create Teacher
        const res = await fetch('/api/admin/teachers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            schoolId,
            name: formName.trim(),
            role: formRole.trim(),
            specialization: formSpecialization.trim() || null,
            photoUrl: formPhotoUrl.trim() || null,
            bio: formBio.trim() || null,
            order: Number(formOrder),
            isActive: formIsActive,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Gagal menambahkan data guru');

        setTeachers((prev) => [...prev, data.teacher]);
      }
      closeModal();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan sistem';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (teacher: TeacherItem) => {
    const updatedStatus = !teacher.isActive;
    try {
      const res = await fetch(`/api/admin/teachers/${teacher.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: updatedStatus }),
      });
      if (res.ok) {
        setTeachers((prev) =>
          prev.map((t) => (t.id === teacher.id ? { ...t, isActive: updatedStatus } : t))
        );
      }
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus data guru "${name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/teachers/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setTeachers((prev) => prev.filter((t) => t.id !== id));
      } else {
        alert('Gagal menghapus data guru');
      }
    } catch (err) {
      console.error('Failed to delete teacher:', err);
      alert('Terjadi kesalahan saat menghapus data');
    }
  };

  const filteredTeachers = teachers.filter((t) => {
    const matchSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.specialization && t.specialization.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchSearch) return false;

    if (statusFilter === 'ACTIVE') return t.isActive;
    if (statusFilter === 'INACTIVE') return !t.isActive;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Filter and Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama guru, amanah, atau keahlian..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all text-slate-800"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {/* Status Filter Pills */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-semibold overflow-x-auto">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                statusFilter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({teachers.length})
            </button>
            <button
              onClick={() => setStatusFilter('ACTIVE')}
              className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                statusFilter === 'ACTIVE'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Aktif ({teachers.filter((t) => t.isActive).length})
            </button>
            <button
              onClick={() => setStatusFilter('INACTIVE')}
              className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
                statusFilter === 'INACTIVE'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Nonaktif ({teachers.filter((t) => !t.isActive).length})
            </button>
          </div>

          {/* Add Teacher Button */}
          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow active:scale-98 w-full sm:w-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Guru</span>
          </button>
        </div>
      </div>

      {/* Teachers Table / Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredTeachers.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Tidak ada data guru ditemukan</h3>
            <p className="text-xs text-slate-500 mt-1">
              Coba sesuaikan kata kunci pencarian atau klik tombol &quot;Tambah Guru&quot; untuk memasukkan data baru.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 w-16">Urut</th>
                  <th className="py-3.5 px-4">Profil Guru &amp; Tenaga Pendidik</th>
                  <th className="py-3.5 px-4">Amanah &amp; Posisi</th>
                  <th className="py-3.5 px-4">Spesialisasi / Keilmuan</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-xs">
                      #{teacher.order}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={teacher.photoUrl || '/images/arc-ustadz.jpg'}
                          alt={teacher.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 flex-shrink-0 shadow-xs"
                        />
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                            {teacher.name}
                          </p>
                          {teacher.bio && (
                            <p className="text-xs text-slate-500 truncate max-w-xs">{teacher.bio}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-100">
                        <Award className="w-3.5 h-3.5 text-emerald-600" />
                        {teacher.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600 max-w-xs">
                      {teacher.specialization || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(teacher)}
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                          teacher.isActive
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                        title="Klik untuk mengubah status"
                      >
                        {teacher.isActive ? 'Aktif' : 'Nonaktif'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(teacher)}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-all"
                          title="Edit Data Guru"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(teacher.id, teacher.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all"
                          title="Hapus Data Guru"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Dialog Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingTeacher ? 'Edit Data Guru' : 'Tambah Dewan Guru Baru'}
                  </h3>
                  <p className="text-xs text-slate-500">Unit: {schoolName}</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Lengkap & Gelar <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bapak H. Ahmad Fauzi, Lc., M.Ag."
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Amanah / Jabatan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Koordinator Tahfidz Al-Qur'an"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Urutan Tampil
                  </label>
                  <input
                    type="number"
                    value={formOrder}
                    onChange={(e) => setFormOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Spesialisasi / Bidang Keilmuan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Pengampu Tahfidz Al-Qur'an Mutqin, Alumni Universitas Al-Azhar Mesir"
                  value={formSpecialization}
                  onChange={(e) => setFormSpecialization(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  URL Foto Profil / Pas Foto
                </label>
                <div className="flex gap-3 items-center">
                  <img
                    src={formPhotoUrl || '/images/arc-ustadz.jpg'}
                    alt="Preview"
                    className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-xs flex-shrink-0"
                  />
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formPhotoUrl}
                    onChange={(e) => setFormPhotoUrl(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-900 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ringkasan Profil / Dedikasi Singkat
                </label>
                <textarea
                  rows={3}
                  placeholder="Ceritakan rekam jejak mendidik dan dedikasi guru..."
                  value={formBio}
                  onChange={(e) => setFormBio(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-900"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-600 border-slate-300"
                />
                <label htmlFor="isActiveToggle" className="text-xs font-medium text-slate-700">
                  Tampilkan profil guru di halaman publik ({schoolName})
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400 rounded-lg transition-all shadow-sm active:scale-98"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Data Guru'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
